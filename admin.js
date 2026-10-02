const express    = require('express');
const router     = express.Router();
const User       = require('../models/User');
const Student    = require('../models/Student');
const Attendance = require('../models/Attendance');
const { requireLogin, requireAdmin } = require('../middleware/auth');

router.use(requireLogin, requireAdmin);

// GET /admin
router.get('/', async (req, res) => {
    try {
        const totalUsers      = await User.countDocuments();
        const totalStudents   = await Student.countDocuments();
        const totalAttendance = await Attendance.countDocuments();
        const recentUsers     = await User.find().sort({ createdAt: -1 }).limit(5);
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            totalUsers, totalStudents, totalAttendance, recentUsers
        });
    } catch (err) { req.flash('error', 'Error loading admin.'); res.redirect('/dashboard'); }
});

// GET /admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.render('admin/users', { title: 'Manage Users', users });
    } catch (err) { res.redirect('/admin'); }
});

// DELETE /admin/users/:id
router.delete('/users/:id', async (req, res) => {
    try {
        if (req.params.id === req.session.user._id.toString()) {
            req.flash('error', 'Cannot delete your own account.');
            return res.redirect('/admin/users');
        }
        await User.findByIdAndDelete(req.params.id);
        req.flash('success', 'User deleted.');
        res.redirect('/admin/users');
    } catch (err) { res.redirect('/admin/users'); }
});

module.exports = router;
