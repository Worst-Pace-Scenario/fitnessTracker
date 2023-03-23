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

        // const routines = await getRoutinesByUser(user.id)
        // user.routines = routines;

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

        // const routines = await getRoutinesByUser(id);
        // user.routines = routines;

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

        // const routines = await getRoutinesByUser(user.id);
        // user.routines = routines

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


async function buildDb() {
    try {
        const usersToCreate = [
          { username: "albert", password: "bertie99" },
          { username: "sandra", password: "sandra123" },
          { username: "glamgal", password: "glamgal123" },
        ]

        client.connect()
        // const users = await Promise.all(usersToCreate.map(createUser))


        // const albert =  await getUserByUsername("albert")
        // const sandra = await getUserById(2)
        // const glamgal = await getUser({username: "glamgal", password: "glamgal123"})

        // console.log("albert", albert)
        // console.log("sandra", sandra)
        // console.log("glamgal", glamgal)

        // const activitiesToCreate = [
        //     {
        //       name: "wide-grip standing barbell curl",
        //       description: "Lift that barbell!",
        //     },
        //     {
        //       name: "Incline Dumbbell Hammer Curl",
        //       description:
        //         "Lie down face up on an incline bench and lift thee barbells slowly upward toward chest",
        //     },
        //     {
        //       name: "bench press",
        //       description: "Lift a safe amount, but push yourself!",
        //     },
        //     { name: "Push Ups", description: "Pretty sure you know what to do!" },
        //     { name: "squats", description: "Heavy lifting." },
        //     { name: "treadmill", description: "running" },
        //     { name: "stairs", description: "climb those stairs" },
        //   ]
        //   const activities = await Promise.all(activitiesToCreate.map(createActivity))
      
        //   console.log("activities created:")
        //   console.log(activities)

        const activites = await getAllActivities();
        console.log("All activities: ", activites);

        const benchPress = await getActivityById(3);
        console.log("bench press", benchPress);

        const updatedAct = await updateActivity({id : 1, name: "Updates!", description: "I was updated"})
        console.log(updatedAct)


        client.end()
        // console.log("Users created:")
        // console.log(users)
        // console.log("Finished creating users!")
    } catch (error) {
            console.error("Error creating users!")
            throw error
          }
}

buildDb()

module.exports = {
    client, createUser
}