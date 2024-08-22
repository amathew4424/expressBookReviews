const express = require('express');
let books = require("./booksdb.js");
const { users, isValid } = require('./auth_users.js');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    if(isValid(username))
        return res.status(409).json({message:"Username is already registered"})

    users.push({username, password});
    return res.json({message: 'User has been successfully registered'});
  } else {
    return res.status(400).send("Both username & password are required to register");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(booksListContainsId(isbn))
    return res.json(books[isbn]);
  else
    return res.status(204).send('Book not found');
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return res.json(
    getBooksList().filter(
      book => book.author.includes(req.params.author)
    )
  );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  return res.json(
    getBooksList().filter(
      book => book.title.includes(req.params.title)
    )
  );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(booksListContainsId(isbn))
    return res.json(books[isbn].reviews);
  else
    return res.status(204).send('Book not found');
});

function getBooksList(){
  return Object.values(books);
}

function booksListContainsId(isbn){
  return Object.keys(books).includes(isbn);
}

module.exports.general = public_users;
