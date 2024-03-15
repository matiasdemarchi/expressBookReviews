const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const promise = new Promise((resolve, reject) => {
        resolve(books)
    })
    promise.then(data => {
        res.status(200).json({books: data})
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const promise = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (!book) {
        reject(new Error('Book not found'))}
    else {
        resolve(book)}
    });
    promise
        .then(data => {
            res.status(200).json({books: data})})
        .catch(err => {
            res.status(404).json({message: err.message})       
    })  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const promise = new Promise((resolve, reject) => {
    for(const [isbn,book] of Object.entries(books)) {
        if (book["author"] == author) {
            resolve(book);
        }
    }
    if (!book) {
        reject(new Error('Book not found'))}
    });
    promise
    .then(data => {
        res.status(200).json({books: data})})
    .catch(err => {
        res.status(404).json({message: err.message})       
    })   
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const promise = new Promise((resolve, reject) => {
    for(const [isbn,book] of Object.entries(books)) {
        if (book["title"] == title) {
            resolve(book);
        }
    }
    if (!book) {
        reject(new Error('Book not found'))}
    });
    promise
    .then(data => {
        res.status(200).json({books: data})})
    .catch(err => {
        res.status(404).json({message: err.message})       
    })   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    return res.status(200).json( book["reviews"] );
  });

module.exports.general = public_users;