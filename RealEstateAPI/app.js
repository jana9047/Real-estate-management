const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 9091;


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

// DELETE
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


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



// PUT property (Update)
app.put('/api/properties/:id', (req, res) => {
    const propertyId = req.params.id;
    const { propertyName, propertyAddress, propertyPrice } = req.body;

    // Validate input
    if (!propertyName || !propertyAddress || !propertyPrice) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
      
    // Update logic
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

