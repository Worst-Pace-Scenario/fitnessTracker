const express = require("express");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const cors = require("cors")
require('dotenv').config();

const {RoutineRouter} = require("./api/routines")
const activities = require("./api/Activities")
const {userRouter} = require("./api/users")
const RoutineActivities = require("./api/RoutineActivities")


const {client} = require("./db")

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    res.header("Access-Control-Allow-Credentials","true");
    next();
  });

app.use(cors())

app.use(express.json())

app.use(morgan('dev'));


app.use("/api/routines", RoutineRouter)

app.use("/api/activities", activities)

app.use("api/users", userRouter)

app.use("/api/routine_activities", RoutineActivities)

client.connect();
app.listen(1337, ()=> {
    console.log("We are now connected to port 1337")
}) 