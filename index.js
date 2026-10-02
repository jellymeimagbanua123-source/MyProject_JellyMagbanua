const express    = require('express');
const router     = express.Router();
const Student    = require('../models/Student');
const Attendance = require('../models/Attendance');
const { requireLogin } = require('../middleware/auth');

// GET / — redirect to dashboard or login
router.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.redirect('/login');
});

// GET /dashboard — main dashboard with stats
router.get('/dashboard', requireLogin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const totalStudents   = await Student.countDocuments();
        const todayAttendance = await Attendance.find({ date: { $gte: today, $lt: tomorrow } })
            .populate('student');

        const presentToday  = todayAttendance.filter(a => a.status === 'present').length;
        const absentToday   = todayAttendance.filter(a => a.status === 'absent').length;
        const lateToday     = todayAttendance.filter(a => a.status === 'late').length;

        // Recent attendance records
        const recentAttendance = await Attendance.find()
            .populate('student')
            .populate('markedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('dashboard', {
            title: 'Dashboard',
            totalStudents,
            presentToday,
            absentToday,
            lateToday,
            recentAttendance,
            today: today.toLocaleDateString()
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
