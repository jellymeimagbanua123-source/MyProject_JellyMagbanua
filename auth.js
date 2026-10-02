const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const User    = require('../models/User');

// GET /login
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('login', { title: 'Login' });
});

// POST /login
// 1. Find user by email in MongoDB
// 2. bcrypt.compare() verifies password against hash
// 3. On success: set req.session.user (session stored in MongoDB)
// 4. On fail: flash error and redirect back
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            req.flash('error', 'Email and password are required.');
            return res.redirect('/login');
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Store user info in session (NOT password)
        req.session.user = {
            _id:  user._id,
            name: user.name,
            email: user.email,
            role:  user.role
        };

        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/dashboard');
    } catch (err) {
        req.flash('error', 'Login failed.');
        res.redirect('/login');
    }
});

// GET /register
router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('register', { title: 'Register' });
});

// POST /register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/register');
        }

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            req.flash('error', 'Email already registered.');
            return res.redirect('/register');
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hash, role: role || 'teacher' });
        req.flash('success', 'Account created! Please log in.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error', 'Registration failed.');
        res.redirect('/register');
    }
});

// GET /logout
// Destroys session — user must login again to access protected routes
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
