const express = require('express')
const userRouter = express.Router();
const jwt = require('jsonwebtoken')
require ('dotenv').config();

const {
  createUser,
  getUser, 
  getUserById,
  getUserByUsername, 
  getAllRoutinesByUser
} = require("../db/index.js")

userRouter.post("/register", async (req, res) => {
  try {
    const {username, password} = req.body;

    const userExists = await getUserByUsername(username)

    if (userExists) {
      return res.status(409).json({
        message: "Username already exists, please try again"
      })
    }

    if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters"
        });
      } else if (username.length < 8) {
        return res.status(400).json({
          message: "Username must be at least 8 characters"
        });
    }
    
    const user = await createUser({ username, password });

    const token = jwt.sign( user , process.env.JWT_SECRET);
    res.send({
      message: "Registration successful",
      token
    }).status(201);
    } catch (error) {
    console.log(error).status(500)
  }
})

userRouter.post("/login", async(req, res) => {
  const {username, password} = req.body;
  
  if (!username || !password) {
    res.send({
      message: "please provide both username and password or register for a new account"
    })
  }
  try {
      const user = await getUser ({username, password});

      if (user && user.password == password) {
        const token = jwt.sign(user, process.env.JWT_SECRET);
        // create token & return to user
        res.send({ message: "you're logged in!", token:token });
      } else {
        res.send({ 
          message: 'Invalid username or password'
        });
      }
    } catch(error) {
      res.sned(error).status(500)
    }
})

userRouter.get("/me", async (req, res)=> {
  const {username, password, id} = req.body

  try {
    const user = await getUserById ({username, password, id});

    if (user && user.password == password) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      // create token & return to user
      res.send({ 
        message: "you're logged in!", token:token });
    } else {
      res.send({ 
        message: 'Invalid username or password'.status(401)
      });
    }
  } catch(error) {
    console.log(error).status(505)
  }
  res.send({username, id})
   
})

userRouter.get("/:username/routines", async (req, res) =>{
  const {username, routines, id} = req.body
  try {
    
    if (req.body.user) {
      const userRoutines = await getAllRoutinesByUser ({username, routines, id})
      res.send(userRoutines).status(202)
    } else {
      res.send("you are not logged in").status(401)
    }
    } catch (error) {
    console.log(error).status(505)
  }
})

module.exports = {userRouter}



