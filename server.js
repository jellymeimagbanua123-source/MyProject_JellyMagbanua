const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Helper: read JSON file ─────────────────────────────────
function readDB() {
    const raw = fs.readFileSync(path.join(__dirname, 'data', 'students.json'));
    return JSON.parse(raw);
}

// ── Helper: write JSON file ────────────────────────────────
function writeDB(data) {
    fs.writeFileSync(
        path.join(__dirname, 'data', 'students.json'),
        JSON.stringify(data, null, 4)
    );
}

// ── GET all students ───────────────────────────────────────
app.get('/api/students', function(req, res) {
    const students = readDB();
    res.json(students);
});

// ── GET single student by id ───────────────────────────────
app.get('/api/students/:id', function(req, res) {
    const students = readDB();
    const student  = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
});

// ── POST add new student ───────────────────────────────────
app.post('/api/students', function(req, res) {
    const students   = readDB();
    const { name, course, year, gpa, status } = req.body;

    if (!name || !course) {
        return res.status(400).json({ error: 'Name and course are required' });
    }

    const newStudent = {
        id:     students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name:   name,
        course: course,
        year:   parseInt(year)   || 1,
        gpa:    parseFloat(gpa)  || 0.00,
        status: status           || 'Active'
    };

    students.push(newStudent);
    writeDB(students);
    res.status(201).json(newStudent);
});

// ── DELETE student by id ───────────────────────────────────
app.delete('/api/students/:id', function(req, res) {
    const students = readDB();
    const index    = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Student not found' });

    const deleted = students.splice(index, 1);
    writeDB(students);
    res.json({ message: 'Deleted', student: deleted[0] });
});

// ── Start server ───────────────────────────────────────────
app.listen(PORT, function() {
    console.log('Server running at http://localhost:' + PORT);
});
