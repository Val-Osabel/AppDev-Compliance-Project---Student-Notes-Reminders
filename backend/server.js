const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'compliance_db'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('MySQL Connected');
});

// CREATE
app.post('/api/tasks', (req, res) => {
    const { title, category } = req.body;

    const sql = 'INSERT INTO tasks (title, category) VALUES (?, ?)';

    db.query(sql, [title, category], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
            id: result.insertId,
            title,
            category,
            status: 'pending'
        });
    });
});

// READ ALL
app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
});

// READ ONE
app.get('/api/tasks/:id', (req, res) => {
    db.query(
        'SELECT * FROM tasks WHERE id = ?',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.json(results[0]);
        }
    );
});

// UPDATE
app.put('/api/tasks/:id', (req, res) => {
    const { title, category } = req.body;

    const sql = 'UPDATE tasks SET title = ?, category = ? WHERE id = ?';

    db.query(sql, [title, category, req.params.id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: 'Updated' });
    });
});

// DELETE
app.delete('/api/tasks/:id', (req, res) => {
    db.query(
        'DELETE FROM tasks WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: 'Deleted' });
        }
    );
});

// TOGGLE STATUS
app.patch('/api/tasks/:id/toggle', (req, res) => {
    const sql = `
        UPDATE tasks
        SET status = IF(status='pending','completed','pending')
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: 'Toggled' });
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});