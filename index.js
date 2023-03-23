const express = require("express");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
require('dotenv').config();


const {client} = require("./db")

const app = express();

app.use(express.json())

app.use(morgan('dev'));

client.connect();
app.listen(1337, ()=> {
    console.log("We are now connected to port 1337")
})