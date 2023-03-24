const {Client} = require("pg");

const client = new Client(`postgress://localhost:5432/worstPaceScenario`)
client.password = "1025464"


                                                            //USERS
async function createUser({username, password}) {
    try {
        const {rows} = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1,$2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `,[username, password])

        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getUser({username, password}){
    try {
        const {rows : [user] } = await client.query(`
            SELECT * FROM users
            WHERE username = $1 AND password = $2;
        `,[username, password])

        if(!user) return null;

        const routines = await getAllRoutinesByUser(user)
        user.routines = routines;

        return user;
    } catch (error) {
        console.log(error)
    }
}

async function getUserById(id) {
    try {
        const {rows: [user]} = await client.query(`
        SELECT id, username FROM users
        WHERE id = $1;
        `,[id])
        if(!user) return null

        const routines = await getAllRoutinesByUser(user);
        user.routines = routines;

        return user;
    } catch (error) {
        console.log(error)
    }
}

async function getUserByUsername(username) {
    try {
        const {rows : [user]} = await client.query(`
        SELECT * FROM users
        WHERE username = $1;
        `, [username]);

        if(!user) return null;

        const routines = await getAllRoutinesByUser(user);
        user.routines = routines

        return user;
    } catch (error) {
        console.log(error);
    }
}




                                                                    //activites
async function createActivity({name, description}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO activities(name, description)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `,[name, description]);

        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function getAllActivities() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM activities;
        `)

        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getActivityById(id){
    try {
        const {rows: [activity] } =  await client.query(`
        SELECT * FROM activities
        WHERE id = $1;
        `,[id])

        return activity;
    } catch (error) {
        console.log(error);
    }
}

async function updateActivity({id, name, description}){
    try {
        const {rows} = await client.query(`
        UPDATE activities
        SET "name" = $1, "description" = $2
        WHERE id = $3
        RETURNING *;
        `,[name, description, id])
        
        return rows;
    } catch (error) {
        console.log(error)
    }
}


                                                                            //Routines
async function createRoutine({creatorId, isPublic, name, goal}){
    try {
        const {rows} = await client.query(`
        INSERT INTO routines("creatorId", "isPublic", name, goal)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [creatorId, isPublic, name, goal])

        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getRoutinesWithoutActivities() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM routines;
        `)

        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getRoutineById(id) {
    try {
        const {rows: [routine]} = await client.query(`
        SELECT routines.* FROM routines
        WHERE routines.id = $1;
        `, [id])

        if(!routine)return undefined

        const {rows: activites} = await client.query(`
        SELECT activities.* FROM activities
        JOIN "routine_activities" on "routine_activities"."activityId" = activities.id
        WHERE "routine_activities"."routineId" = $1;
        `, [id])

        routine.activites = activites;

        return routine;
    } catch (error) {
        console.log(error)
    }
}

async function getAllRoutines() {
    try {
        const {rows: ids} = await client.query(`
        SELECT id FROM routines;
        `)

        const routines = await Promise.all(ids.map(
            routine => getRoutineById(routine.id)
        ))

        return rows;
    } catch (error) {
        console.log(error)
    }

}

async function getAllPublicRoutines() {
    try {
        const {rows: ids} = await client.query(`
        SELECT id FROM routines
        WHERE "isPublic" = true;
        `)
        
        const routines = await Promise.all(ids.map(
            routine => getRoutineById(routine.id)
        ))

        return routines;
    } catch (error) {
        console.log(error)
    }
}

async function getAllRoutinesByUser({id}) {
    try {
        const {rows: ids} = await client.query(`
        SELECT id FROM routines
        WHERE "creatorId" = $1;
        `,[id])
        
        const routines = await Promise.all(ids.map(
            routine => getRoutineById(routine.id)
        ))

        return routines;
    } catch (error) {
        console.log(error)
    }
}

async function getPublicRoutinesByUser({id}) {
    try {
        const {rows: ids} = await client.query(`
        SELECT id FROM routines
        WHERE routines."creatorId" = $1 && "isPublic" = true;
        `,[id])
        
        const routines = await Promise.all(ids.map(
            routine => getRoutineById(routine.id)
        ))

        return routines;
    } catch (error) {
        console.log(error)
    }
}

async function getPublicRoutinesByActivity({activityId}) {
    try {
        const {rows: ids} = await client.query(`
        SELECT routines.id FROM routines
        JOIN "routine_activities" on "routine_activities"."routineId" = routines.id
        WHERE "routine_activities".id = $1  && "isPublic" = true;
        `,[activityId])
        
        const routines = await Promise.all(ids.map(
            routine => getRoutineById(routine.id)
        ))

        return routines;
    } catch (error) {
        console.log(error)
    }
}

async function updateRoutine ({id, isPublic, name, goal}) {
    try {
        const {rows} = await client.query(`
        UPDATE routines
        SET "isPublic" = $1, name = $2, goal = $3
        WHERE id = ${id}
        RETURNING *;
        `,[isPublic, name, goal])

        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function destroyRoutine(id) {
    try {
        const destoryedRoutine = await getRoutineById(id)

        client.query(`
        DELETE FROM routines
        WHERE id = $1;
        `,[id])

        client.query(`
        DELETE FROM "routine_activities"
        WHERE "routineId" = $1;
        `,[id])

        return destoryedRoutine;
    } catch (error) {
        console.log(error)
    }

}


                                                                                    //routine_activites

async function getRoutineActivityById(id) {
   try {
        const {rows : [routAct]} = await client.query(`
        SELECT * FROM "routine_activities"
        WHERE id = $1,
        `,[id])

        return routAct;
   } catch (error) {
    console.log(error)
   }
}

async function addActivityToRoutine({routineId, activityId, count, duration}) {
    try {
        const {rows: [routAct]} = await client.query(`
        INSERT INTO "routine_activities"("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [routineId, activityId, count, duration])
        
        return routAct;
    } catch (error) {
        console.log(error)
    }
}

async function updateRoutineActivity({id, count, duration}) {
    try {
        const {rows: [routAct]} = await client .query(`
        UPDATE "routine_activities"
        SET count = $1, duration = $2
        WHERE id = ${id}
        RETURNING *;
        `,[count, duration])
        
        
        return routAct;
    } catch (error) {
        console.log(error)
    }
}

async function destroyRoutineActivity(id) {
    try {
        const destroyedRoutAct = await getRoutineActivityById(id)

        client.query(`
        DELETE FROM "routine_activities"
        WHERE id = ${id}
        `)

        return destroyedRoutAct;
    } catch (error) {
        console.log(error)
    }
}

async function getRoutineActivityByRoutine ({id}) {
    try {
        console.log("now looking for routine: ", id)
        const {rows} = await client.query(`
        SELECT * FROM "routine_activities"
        WHERE "routineId" = ${id}
        `)

        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function buildDb() {
    try {
        const usersToCreate = [
          { username: "albert", password: "bertie99" },
          { username: "sandra", password: "sandra123" },
          { username: "glamgal", password: "glamgal123" },
        ]

        client.connect()
        
        const users = await Promise.all(usersToCreate.map(createUser))


        const activitiesToCreate = [
            {
              name: "wide-grip standing barbell curl",
              description: "Lift that barbell!",
            },
            {
              name: "Incline Dumbbell Hammer Curl",
              description:
                "Lie down face up on an incline bench and lift thee barbells slowly upward toward chest",
            },
            {
              name: "bench press",
              description: "Lift a safe amount, but push yourself!",
            },
            { name: "Push Ups", description: "Pretty sure you know what to do!" },
            { name: "squats", description: "Heavy lifting." },
            { name: "treadmill", description: "running" },
            { name: "stairs", description: "climb those stairs" },
          ]
          const activities = await Promise.all(activitiesToCreate.map(createActivity))
    
        const routinesToCreate = [
            {
              creatorId: 2,
              isPublic: false,
              name: "Bicep Day",
              goal: "Work the Back and Biceps.",
            },
            {
              creatorId: 1,
              isPublic: true,
              name: "Chest Day",
              goal: "To beef up the Chest and Triceps!",
            },
            {
              creatorId: 1,
              isPublic: false,
              name: "Leg Day",
              goal: "Running, stairs, squats",
            },
            {
              creatorId: 2,
              isPublic: true,
              name: "Cardio Day",
              goal: "Running, stairs. Stuff that gets your heart pumping!",
            },
          ]
          const routines = await Promise.all(
            routinesToCreate.map((routine) => createRoutine(routine))
          )
          console.log("Routines Created: ", routines)

        const [bicepRoutine, chestRoutine, legRoutine, cardioRoutine] =  await getRoutinesWithoutActivities()
        
        const [bicep1, bicep2, chest1, chest2, leg1, leg2, leg3] = await getAllActivities()
        const routineActivitiesToCreate = [
            {
              routineId: bicepRoutine.id,
              activityId: bicep1.id,
              count: 10,
              duration: 5,
            },
            {
              routineId: bicepRoutine.id,
              activityId: bicep2.id,
              count: 10,
              duration: 8,
            },
            {
              routineId: chestRoutine.id,
              activityId: chest1.id,
              count: 10,
              duration: 8,
            },
            {
              routineId: chestRoutine.id,
              activityId: chest2.id,
              count: 10,
              duration: 7,
            },
            {
              routineId: legRoutine.id,
              activityId: leg1.id,
              count: 10,
              duration: 9,
            },
            {
              routineId: legRoutine.id,
              activityId: leg2.id,
              count: 10,
              duration: 10,
            },
            {
              routineId: legRoutine.id,
              activityId: leg3.id,
              count: 10,
              duration: 7,
            },
            {
              routineId: cardioRoutine.id,
              activityId: leg2.id,
              count: 10,
              duration: 10,
            },
            {
              routineId: cardioRoutine.id,
              activityId: leg3.id,
              count: 10,
              duration: 15,
            },
          ]
          const routineActivities = await Promise.all(
            routineActivitiesToCreate.map(addActivityToRoutine)
          )
        client.end()
        // console.log("Users created:")
        // console.log(users)
        // console.log("Finished creating users!")
    } catch (error) {
            console.error("Error creating users!")
            throw error
          }
}

// buildDb()

module.exports = {
    client
}