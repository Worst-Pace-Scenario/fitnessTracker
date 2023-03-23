const {Client} = require("pg");

const client = new Client(`postgress://localhost:5432/worstPaceScenario`)
client.password = "1025464"

module.exports = {
    client
}