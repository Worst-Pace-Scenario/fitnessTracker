const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken')
require('dotenv').config(); 

const {
  createUser, 
  getUser, 
  getUserById, 
  getUserByUsername
} = require('..db'); 


userRouter.post("/users/register", async(req, res) => {
    const {username, password } = req.body

    if (!username || !password) {
        res.send({
            // name: 
            message: "please provide both username and password"
        })
    }
    try {
        const user = await createUser ({username, password});
    
        if (user && user.password == password) {
          const token = jwt.sign(user, process.env.JWT_SECRET);
          // create token & return to user
          res.send({ message: "you're logged in!", token:token });
        } else {
          next({ 
            name: 'IncorrectCredentialsError', 
            message: 'Username or password is incorrect'
          });
        }
      } catch(error) {
        console.log(error);
        next(error);
      }
})

userRouter.post("/user/login", async(req, res) => {

})

userRouter.get("/users/me*", async (req, res)=> {

})

userRouter.get("/users/:username/routines", async (req, res) =>{

})


