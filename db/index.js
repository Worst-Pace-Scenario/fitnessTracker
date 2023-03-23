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


async function buildDb() {
    try {
        const usersToCreate = [
          { username: "albert", password: "bertie99" },
          { username: "sandra", password: "sandra123" },
          { username: "glamgal", password: "glamgal123" },
        ]

        client.connect()
        // const users = await Promise.all(usersToCreate.map(createUser))


        const albert =  await getUserByUsername("albert")
        const sandra = await getUserById(2)
        const glamgal = await getUser({username: "glamgal", password: "glamgal123"})

        console.log("albert", albert)
        console.log("sandra", sandra)
        console.log("glamgal", glamgal)
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