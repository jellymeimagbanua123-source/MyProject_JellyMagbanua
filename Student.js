const mongoose = require('mongoose');

// ── Student Schema ────────────────────────────────────────────
// Stores enrolled student records.
// MongoDB is appropriate here because student data is document-oriented:
// each student is a self-contained record that can be queried independently.
const studentSchema = new mongoose.Schema({
    studentId:  { type: String, required: true, unique: true, trim: true },
    firstName:  { type: String, required: true, trim: true },
    lastName:   { type: String, required: true, trim: true },
    email:      { type: String, trim: true },
    course:     { type: String, required: true },
    yearLevel:  { type: Number, default: 1, min: 1, max: 5 },
    section:    { type: String, trim: true },
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt:  { type: Date, default: Date.now }
});

// Virtual: full name
studentSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', studentSchema);
