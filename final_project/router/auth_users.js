const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = require('../constants.js').secretKey;

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.map(user=>user.username).includes(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.filter(
    user => user.username == username
    && user.password == password
  ).length == 1
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign(
      {data: password}, 
      secretKey, 
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
        accessToken, username
    }

    return res.send('Successfully logged in as: '+username);
  }
  else
    return res.status(403).send('Invalid username/password');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
