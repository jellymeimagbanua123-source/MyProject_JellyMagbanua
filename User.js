const mongoose = require('mongoose');

// ── User Schema ───────────────────────────────────────────────
// Stores teacher and admin accounts.
// Passwords are NEVER stored in plaintext — bcrypt hashes them.
// MongoDB stores this as a 'users' collection automatically.
const userSchema = new mongoose.Schema({
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ['admin', 'teacher'], default: 'teacher' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
