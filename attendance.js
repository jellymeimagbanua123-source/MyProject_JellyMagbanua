const express    = require('express');
const router     = express.Router();
const Student    = require('../models/Student');
const Attendance = require('../models/Attendance');
const { requireLogin } = require('../middleware/auth');

router.use(requireLogin);

// GET /attendance/mark
router.get('/mark', async (req, res) => {
    try {
        const students = await Student.find().sort({ lastName: 1 });
        const today    = new Date().toISOString().split('T')[0];
        res.render('attendance/mark', { title: 'Mark Attendance', students, today });
    } catch (err) { req.flash('error', 'Error loading form.'); res.redirect('/dashboard'); }
});

// POST /attendance/mark — bulk save one record per student
router.post('/mark', async (req, res) => {
    try {
        const { date, subject, statuses, remarks } = req.body;
        const students = await Student.find();
        const docs = [];

        for (const student of students) {
            const sid    = student._id.toString();
            const status = statuses && statuses[sid] ? statuses[sid] : 'absent';
            const remark = remarks  && remarks[sid]  ? remarks[sid]  : '';

            // Upsert: update if already marked today, else insert
            await Attendance.findOneAndUpdate(
                { student: student._id, date: new Date(date), subject },
                { student: student._id, date: new Date(date), subject, status, remarks: remark, markedBy: req.session.user._id },
                { upsert: true, new: true }
            );
        }

        req.flash('success', `Attendance marked for ${students.length} students.`);
        res.redirect('/attendance/report');
    } catch (err) {
        req.flash('error', 'Failed to save attendance.');
        res.redirect('/attendance/mark');
    }
});

// GET /attendance/report
router.get('/report', async (req, res) => {
    try {
        const { date, subject, studentId } = req.query;
        const query = {};

        if (date)      query.date    = new Date(date);
        if (subject)   query.subject = new RegExp(subject, 'i');
        if (studentId) query.student = studentId;

        const records = await Attendance.find(query)
            .populate('student', 'firstName lastName studentId course')
            .populate('markedBy', 'name')
            .sort({ date: -1 })
            .limit(100);

        const total   = records.length;
        const present = records.filter(r => r.status === 'present').length;
        const absent  = records.filter(r => r.status === 'absent').length;
        const late    = records.filter(r => r.status === 'late').length;
        const excused = records.filter(r => r.status === 'excused').length;

        const students = await Student.find().sort({ lastName: 1 });

        res.render('attendance/report', {
            title: 'Attendance Report',
            records, total, present, absent, late, excused,
            students, filters: { date, subject, studentId }
        });
    } catch (err) { req.flash('error', 'Error loading report.'); res.redirect('/dashboard'); }
});

module.exports = router;
