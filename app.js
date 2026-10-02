require('dotenv').config();
const express      = require('express');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const flash        = require('connect-flash');
const methodOverride = require('method-override');
const mongoose     = require('mongoose');
const bcrypt       = require('bcrypt');
const path         = require('path');

const logger       = require('./middleware/logger');
const User         = require('./models/User');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── MongoDB Connection ────────────────────────────────────────
// mongoose.connect() establishes a persistent connection pool.
// All models (User, Student, Attendance) use this connection.
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('\x1b[32m✓ MongoDB connected\x1b[0m');
        await seedAdmin();
    })
    .catch(err => console.error('✗ MongoDB error:', err.message));

// ── Seed Admin User ───────────────────────────────────────────
async function seedAdmin() {
    const exists = await User.findOne({ email: 'admin@school.edu' });
    if (!exists) {
        const hash = await bcrypt.hash('admin123', 10);
        await User.create({ name: 'Admin', email: 'admin@school.edu', password: hash, role: 'admin' });
        console.log('\x1b[33m✓ Admin seeded: admin@school.edu / admin123\x1b[0m');
    }
}

// ── View Engine ───────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static Files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Body Parsing ──────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Method Override ───────────────────────────────────────────
app.use(methodOverride('_method'));

// ── Session Middleware ────────────────────────────────────────
// Sessions are stored IN MongoDB via connect-mongo.
// This means sessions persist across server restarts.
// req.session.user is set on login and cleared on logout.
app.use(session({
    secret:            process.env.SESSION_SECRET || 'attendance_secret',
    resave:            false,
    saveUninitialized: false,
    store:             MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie:            { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

// ── Flash Messages ────────────────────────────────────────────
app.use(flash());

// ── Logger Middleware ─────────────────────────────────────────
// Runs on every request — logs method, URL, and session user
app.use(logger);

// ── Global Locals ─────────────────────────────────────────────
// Makes user/flash available in ALL EJS templates
app.use((req, res, next) => {
    res.locals.user    = req.session.user || null;
    res.locals.success = req.flash('success');
    res.locals.error   = req.flash('error');
    next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/',           require('./routes/index'));
app.use('/',           require('./routes/auth'));
app.use('/students',   require('./routes/students'));
app.use('/attendance', require('./routes/attendance'));
app.use('/admin',      require('./routes/admin'));

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { title: 'Server Error', error: err.message });
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\x1b[36m🎓 Attendance System running at http://localhost:${PORT}\x1b[0m`);
});
