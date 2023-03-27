const express = require('express');
const apiRouter = express.Router();

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
// const { JWT_SECRET } = process.env;
const password = "1025464"

const secret = process.env.JWT_SECRET


apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  let auth = "";
    if(req.header("Authorization")){
        auth = req.header('Authorization');
    }
    if(req.header("authorization")){
        auth = req.header("authorization")
    }

  if (!auth) { 
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { username, password, id } = jwt.verify(token, secret);
    // const { id } = jwt.verify(token, password);
      console.log("calling function for this id: " + id)

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

apiRouter.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
  });

apiRouter.use((error, req, res, next) => {
    res.send({
      name: error.name,
      message: error.message
    });
  });


module.exports = apiRouter;