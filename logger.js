// ── Request Logger Middleware ─────────────────────────────────
// Registered globally in app.js via app.use(logger)
// Runs on EVERY incoming request before route handlers.
// Logs: timestamp, HTTP method, URL, and the logged-in user (or 'guest').
// Demonstrates Express middleware: receives req/res, logs, calls next().

const logger = (req, res, next) => {
    const time  = new Date().toISOString();
    const user  = req.session && req.session.user ? req.session.user.email : 'guest';
    const color = '\x1b[36m'; // cyan
    const reset = '\x1b[0m';
    console.log(`${color}[${time}] ${req.method} ${req.url} — user: ${user}${reset}`);
    next(); // pass control to the next middleware or route handler
};

module.exports = logger;
