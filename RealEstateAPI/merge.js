const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 9091; // Single port for the merged application

app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
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

// ----- Properties API -----

// GET all properties
app.get('/api/properties', (req, res) => {
    db.query('SELECT * FROM Estate', (err, results) => {
        if (err) {
            console.error('Error fetching properties:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// POST a new property
app.post('/api/properties', (req, res) => {
    const { propertyName, propertyAddress, propertyPrice } = req.body;
    db.query('INSERT INTO Estate (name, address, price) VALUES (?, ?, ?)',
        [propertyName, propertyAddress, propertyPrice],
        (err, results) => {
            if (err) {
                console.error('Error adding property:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Property added successfully', id: results.insertId });
            }
        });
});

// DELETE a property
app.delete('/api/properties/:id', (req, res) => {
    const propertyId = req.params.id;
    db.query('DELETE FROM Estate WHERE id = ?', [propertyId], (err, results) => {
        if (err) {
            console.error('Error deleting property:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Property deleted successfully' });
        }
    });
});

// PUT (update) a property
app.put('/api/properties/:id', (req, res) => {
    const propertyId = req.params.id;
    const { propertyName, propertyAddress, propertyPrice } = req.body;

    if (!propertyName || !propertyAddress || !propertyPrice) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    db.query('UPDATE Estate SET name = ?, address = ?, price = ? WHERE id = ?',
        [propertyName, propertyAddress, propertyPrice, propertyId],
        (err, results) => {
            if (err) {
                console.error('Error updating property:', err);
                res.status(500).json({ error: 'Database error' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Property not found.' });
            } else {
                res.json({ message: 'Property updated successfully' });
            }
        });
});

// ----- Tenants API -----

// GET all tenants
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

// POST a new tenant
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

// DELETE a tenant
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

// PUT (update) a tenant
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

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
