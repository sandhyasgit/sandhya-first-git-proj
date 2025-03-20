const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const port = 5000;

// Configure CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Your MySQL host (usually localhost)
  user: 'root',      // Your MySQL username
  password: 'Sandhya@123',      // Your MySQL password (if any)
  database: 'todo_app', // The database you created
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// API to get all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    } else {
      res.json(results);
    }
  });
});

// API to add a new todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  db.query('INSERT INTO todos (text, completed) VALUES (?, ?)', [text, false], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to add todo' });
    } else {
      res.json({ id: result.insertId, text, completed: false });
    }
  });
});

// API to toggle todo completion
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to update todo' });
    } else {
      res.json({ id, completed });
    }
  });
});

// API to delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete todo' });
    } else {
      res.json({ id });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
