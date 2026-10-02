const mongoose = require('mongoose');

// ── Attendance Schema ─────────────────────────────────────────
// Each document = one student's attendance on one date for one subject.
// References Student and User by ObjectId (MongoDB's relational linking).
// MongoDB's flexible schema allows adding remarks or extra fields later
// without migrating the entire table — ideal for attendance records.
const attendanceSchema = new mongoose.Schema({
    student:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    date:     { type: Date, required: true },
    status:   { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
    subject:  { type: String, required: true, trim: true },
    remarks:  { type: String, trim: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt:{ type: Date, default: Date.now }
});

// Compound index: fast queries for student + date + subject
attendanceSchema.index({ student: 1, date: 1, subject: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
