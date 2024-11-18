const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 9092;


app.use(cors());
app.use(bodyParser.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Jana@9047', 
    database: 'Student' 
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});


app.get('/api/tenants', (req, res) => {
    db.query('SELECT * FROM Tenants', (err, results) => {
        if (err) {
            console.error('Error fetching tenants:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});


app.post('/api/tenants', (req, res) => {
    const { tenantName, tenantEmail, tenantPhone } = req.body;
    db.query('INSERT INTO Tenants (name, email, phone) VALUES (?, ?, ?)',
        [tenantName, tenantEmail, tenantPhone],
        (err, results) => {
            if (err) {
                console.error('Error adding tenant:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Tenant added successfully', id: results.insertId });
            }
        });
});


app.delete('/api/tenants/:id', (req, res) => {
    const tenantId = req.params.id;
    db.query('DELETE FROM Tenants WHERE id = ?', [tenantId], (err, results) => {
        if (err) {
            console.error('Error deleting tenant:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Tenant deleted successfully' });
        }
    });
});


app.put('/api/tenants/:id', (req, res) => {
    const tenantId = req.params.id;
    const { tenantName, tenantEmail, tenantPhone } = req.body;


    if (!tenantName || !tenantEmail || !tenantPhone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }


    db.query('UPDATE Tenants SET name = ?, email = ?, phone = ? WHERE id = ?',
        [tenantName, tenantEmail, tenantPhone, tenantId],
        (err, results) => {
            if (err) {
                console.error('Error updating tenant:', err);
                res.status(500).json({ error: 'Database error' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Tenant not found.' });
            } else {
                res.json({ message: 'Tenant updated successfully' });
            }
        });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
