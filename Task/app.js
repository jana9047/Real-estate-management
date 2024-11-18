const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Middleware to parse form data 
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the login form at the root URL "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'booking.html'));
});

// Route to handle the login POST request
app.post('/login', (req, res) => {
    const { userId, password } = req.body;

    // For now, let's assume the correct login details are:
    const validUserId = 'admin';
    const validPassword = 'p';

    // Check if the user provided correct credentials
    if (userId === validUserId && password === validPassword) {
        // Redirect to the bookings page after successful login
        res.redirect('/bookings');
    } else {
        // Send an error response if login fails
        res.send('Invalid login credentials.');
    }
});

// Route to render the bookings page
app.get('/bookings', (req, res) => {
    res.send('<h1>List of Real Estate Bookings</h1>'); // You can later replace this with dynamic data
});

// Start the server
app.listen(9091, () => {
    console.log('Server running on http://localhost:9091');
});
