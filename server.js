const bodyParser = require("body-parser");
const mysql = require('mysql2');
const express = require ('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT||3300;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '   ',
    database: 'books_directory',
   // insecureAuth: true
  // timeout: 10000
});

db.connect(err =>{
    if(err){
        console.error('Database Connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// GET all books
app.get('/books',(req, res) => {
    db.query('SELECT * FROM books_directory.books',(err, results) => {
        if(err){
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// POST a new book
app.post('/books', (req, res) => {
    const {title, author, genre, published_year} =req.body;
    db.query('INSERT INTO books_directory.books(title, author, genre, published_year) VALUES(?,?,?,?)',
        [title, author, genre,published_year],
        (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).send('Book added with ID: ${result.insertId}');
        });
});

//Start the server
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
    
});
