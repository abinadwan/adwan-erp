const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(session({
    secret: 'your-secret-key', // استبدل هذا بمفتاح سري آمن
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // في الإنتاج، يجب تعيين هذا إلى true مع HTTPS
}));

app.use(express.static(__dirname));

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Please enter username and password.');
    }

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            return res.status(400).send('Username already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).send('Incorrect username or password.');
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Incorrect username or password.');
        }

        req.session.user = {
            id: user.id,
            username: user.username,
        };
        
        res.status(200).send('Login successful');

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred on the server while trying to log in.');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/index.html');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login.html');
    });
});

app.use('/api/auth', router);

// Middleware to protect routes
function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Apply middleware to all routes except login and signup
app.use((req, res, next) => {
    if (req.path === '/login.html' || req.path === '/signup.html' || req.path.startsWith('/api/auth')) {
        return next();
    }
    checkAuth(req, res, next);
});

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});