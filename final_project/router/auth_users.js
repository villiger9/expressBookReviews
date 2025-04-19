const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if the username exists in the users array
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => {
  // Check if the username and password match a user in the array
  return users.some((user) => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if both fields are present
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { data: username },
      'access',  // secret key
      { expiresIn: '1h' }
    );

    // Save the token in the session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User successfully logged in." });
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password." });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    // Check if review is provided
    if (!review) {
      return res.status(400).json({ message: "No review provided." });
    }
  
    // If no reviews yet, initialize the reviews object
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Add or update the review for the current user
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: `Review for book with ISBN ${isbn} added/updated successfully.`,
      reviews: books[isbn].reviews
    });
  });
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    const reviews = books[isbn].reviews;

    if (reviews[username]) {
        delete reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "No review found for this user on the given book" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
