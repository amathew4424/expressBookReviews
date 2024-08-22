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

    return res.send('Successfully logged in as: '+ username + ' : ' + accessToken);
  }
  else
    return res.status(403).send('Invalid username/password');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let reviews = books[isbn].reviews;
  let review_exists = false;
  if(reviews[username]) 
    review_exists = true;

  reviews[username] = req.body.review;
  review_exists? 
    res.send("Review updated") :
    res.send("Review added");
  return;
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let reviews = books[isbn].reviews;
  if(reviews[username])
    delete reviews[username];

  return res.send('deleted successfully');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
