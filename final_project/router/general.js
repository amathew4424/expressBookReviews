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
  return new Promise((resolve)=>{
    resolve(res.json(books));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return new Promise((resolve, reject)=>{
    let isbn = req.params.isbn;
    if(booksListContainsId(isbn))
      resolve(res.json(books[isbn]));
    else
      reject();
  }).catch(()=>{
    res.status(204).send('Book not found')
  });
});
  
function getBooksList(){
  return new Promise((resolve)=>{
    resolve(Object.values(books));
  });
}

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let booksByAuthor = (await getBooksList()).filter(
    book => book.author.includes(req.params.author)
  );
  return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let booksByTitle = (await getBooksList()).filter(
    book => book.title.includes(req.params.title)
  );
  return res.json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(booksListContainsId(isbn))
    return res.json(books[isbn].reviews);
  else
    return res.status(204).send('Book not found');
});

function booksListContainsId(isbn){
  return Object.keys(books).includes(isbn);
}

module.exports.general = public_users;
