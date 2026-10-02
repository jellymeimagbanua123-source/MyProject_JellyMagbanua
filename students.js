const express  = require('express');
const router   = express.Router();
const Student  = require('../models/Student');
const Attendance = require('../models/Attendance');
const { requireLogin } = require('../middleware/auth');

router.use(requireLogin);

// GET /students
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';
        const query  = search
            ? { $or: [
                { firstName: new RegExp(search, 'i') },
                { lastName:  new RegExp(search, 'i') },
                { studentId: new RegExp(search, 'i') },
                { course:    new RegExp(search, 'i') }
              ]}
            : {};
        const students = await Student.find(query).sort({ lastName: 1 });
        res.render('students/index', { title: 'Students', students, search });
    } catch (err) { next(err); }
});

// GET /students/add
router.get('/add', (req, res) => {
    res.render('students/add', { title: 'Add Student' });
});

// POST /students
router.post('/', async (req, res) => {
    try {
        const { studentId, firstName, lastName, email, course, yearLevel, section } = req.body;
        await Student.create({
            studentId, firstName, lastName, email, course,
            yearLevel: parseInt(yearLevel) || 1, section,
            createdBy: req.session.user._id
        });
        req.flash('success', 'Student added successfully!');
        res.redirect('/students');
    } catch (err) {
        if (err.code === 11000) req.flash('error', 'Student ID already exists.');
        else req.flash('error', 'Failed to add student.');
        res.redirect('/students/add');
    }
});

// GET /students/:id
router.get('/:id', async (req, res) => {
    try {
        const student    = await Student.findById(req.params.id);
        if (!student) { req.flash('error', 'Student not found.'); return res.redirect('/students'); }
        const attendance = await Attendance.find({ student: req.params.id })
            .sort({ date: -1 }).limit(30);
        const totalDays  = attendance.length;
        const present    = attendance.filter(a => a.status === 'present').length;
        const rate       = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;
        res.render('students/detail', { title: student.firstName + ' ' + student.lastName, student, attendance, rate, totalDays, present });
    } catch (err) { req.flash('error', 'Error loading student.'); res.redirect('/students'); }
});

// GET /students/:id/edit
router.get('/:id/edit', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) { req.flash('error', 'Student not found.'); return res.redirect('/students'); }
        res.render('students/add', { title: 'Edit Student', student });
    } catch (err) { res.redirect('/students'); }
});

// PUT /students/:id
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, course, yearLevel, section } = req.body;
        await Student.findByIdAndUpdate(req.params.id, { firstName, lastName, email, course, yearLevel, section });
        req.flash('success', 'Student updated!');
        res.redirect('/students/' + req.params.id);
    } catch (err) { req.flash('error', 'Update failed.'); res.redirect('/students'); }
});

// DELETE /students/:id
router.delete('/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        await Attendance.deleteMany({ student: req.params.id });
        req.flash('success', 'Student deleted.');
        res.redirect('/students');
    } catch (err) { req.flash('error', 'Delete failed.'); res.redirect('/students'); }
});

module.exports = router;
