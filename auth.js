const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db'); // المسار الصحيح إلى db.js

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Please enter username and password.');
    }

    try {
        // Check if user already exists
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            return res.status(400).send('Username already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).send('User created successfully.');

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('An error occurred on the server while trying to sign up.');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Please enter username and password.');
    }

    try {
        // 1. Find the user by name from the database
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            // User not found
            return res.status(401).send('Incorrect username or password.');
        }

        const user = rows[0];

        // 2. Compare the submitted password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Passwords do not match
            return res.status(401).send('Incorrect username or password.');
        }

        // 3. If the credentials are correct, create a session for the user
        req.session.user = {
            id: user.id,
            username: user.username,
            // Add any other user data you want to store in the session
        };
        
        // 4. Redirect the user to a protected page such as the dashboard
        // You can also send a success response in JSON format
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred on the server while trying to log in.');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard'); // أو أي صفحة أخرى
        }
        res.clearCookie('connect.sid'); // اسم ملف تعريف الارتباط الافتراضي للجلسة
        res.redirect('/login');
    });
});

module.exports = router;
