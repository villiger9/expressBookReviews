const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Get the ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Look up the book in the books object
    const book = books[isbn];
  
    // Check if the book exists
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN." });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    // Get all book keys (ISBNs)
    const bookKeys = Object.keys(books);
  
    // Filter books by matching author
    const matchingBooks = bookKeys
      .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
      .map(key => ({ isbn: key, ...books[key] }));
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found for the given author." });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let matchedBooks = [];

    bookKeys.forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            matchedBooks.push({ isbn: key, ...books[key] });
        }
    });

    if (matchedBooks.length > 0) {
        return res.status(200).json(matchedBooks);
    } else {
        return res.status(404).json({ message: "No books found with the given title." });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get ISBN from request params

    // Check if the book exists
    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        return res.status(200).json(reviews);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});


module.exports.general = public_users;
