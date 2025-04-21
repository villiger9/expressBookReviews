const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Add the new user
    users.push({ username, password });

    return res.status(200).json({ message: "User successfully registered. Now you can login." });
});


// Get the book list available in the shop
// Simulated promise-based delay function
function promiseCb(cb, delay) {
	return new Promise((resolve) => {
		setTimeout(() => cb(resolve), delay);
	});
}

public_users.get('/', async function (req, res) {
	try {
		const data = await promiseCb((resolve) => {
			const booksList = Object.values(books);
			resolve(booksList);
		}, 3000); // Simulates async delay

		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
});


// Get book details based on ISBN
// Simulate an async operation with a delay
function findBookByISBN(isbn, delay = 1000) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const book = books[isbn];
          if (book) {
              resolve(book);
          } else {
              reject(new Error("Book not found for the given ISBN."));
          }
      }, delay);
  });
}

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
      const book = await findBookByISBN(isbn);
      return res.status(200).json(book);
  } catch (error) {
      return res.status(404).json({ message: error.message });
  }
});

  
  
// Simulate an async function to fetch books by author
function findBooksByAuthor(author, delay = 1000) {
  return new Promise((resolve) => {
      setTimeout(() => {
          const bookKeys = Object.keys(books);
          const matchingBooks = bookKeys
              .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
              .map(key => ({ isbn: key, ...books[key] }));

          resolve(matchingBooks);
      }, delay);
  });
}

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
      const matchingBooks = await findBooksByAuthor(author);

      if (matchingBooks.length > 0) {
          return res.status(200).json(matchingBooks);
      } else {
          return res.status(404).json({ message: "No books found for the given author." });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
  }
});

  

// Get all books based on title
function findBooksByTitle(title, delay = 1000) {
  return new Promise((resolve) => {
      setTimeout(() => {
          const bookKeys = Object.keys(books);
          const matchedBooks = bookKeys
              .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
              .map(key => ({ isbn: key, ...books[key] }));

          resolve(matchedBooks);
      }, delay);
  });
}

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
      const matchedBooks = await findBooksByTitle(title);

      if (matchedBooks.length > 0) {
          return res.status(200).json(matchedBooks);
      } else {
          return res.status(404).json({ message: "No books found with the given title." });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
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
