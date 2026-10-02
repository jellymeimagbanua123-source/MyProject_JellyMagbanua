# 🎓 AttendEase — Student Attendance System

A web application for managing student attendance built with **Express.js**, **MongoDB**, and **EJS** with a **Claymorphism** UI.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Backend | Express.js (Node.js) | Lightweight REST/web server with middleware support |
| Database | MongoDB (Mongoose) | Flexible document model fits attendance records well |
| Templating | EJS | Server-side rendering with dynamic data |
| Auth | express-session + bcrypt | Secure session-based authentication |
| Session Store | connect-mongo | Sessions persisted IN MongoDB — survives restarts |

---

## Why MongoDB?

Attendance records are document-oriented — each record is a self-contained object with student reference, date, subject, status, and remarks. MongoDB's flexible schema allows adding new fields (e.g., geolocation, photo) without schema migration. The `populate()` method handles the student reference efficiently. Three collections are used:

- **users** — teacher and admin accounts
- **students** — enrolled student records
- **attendances** — one document per student per subject per day

---

## Express Middleware Used

### 1. `middleware/logger.js` — Request Logger
- Registered globally: `app.use(logger)`
- Runs on **every** incoming request
- Logs: timestamp, HTTP method, URL, and session user (or 'guest')
- Calls `next()` to pass control to the route handler

### 2. `middleware/auth.js` — Authentication Guard
- `requireLogin` — checks `req.session.user`, redirects to `/login` if missing
- `requireAdmin` — checks `req.session.user.role === 'admin'`
- Mounted on specific routers: `router.use(requireLogin)`

### 3. `express-session` + `connect-mongo` — Session Middleware
- Registered in `app.js` before routes
- Session data stored in MongoDB `sessions` collection
- `req.session.user` set on login, destroyed on logout

---

## Session Management

1. **Login** — bcrypt verifies password → `req.session.user = { _id, name, email, role }` saved
2. **Every request** — `res.locals.user` populated from session for use in all EJS views
3. **Protected routes** — `requireLogin` middleware checks session before route handler runs
4. **Logout** — `req.session.destroy()` clears the session from MongoDB and memory

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally (default: `mongodb://localhost:27017`)
- MongoDB Compass (optional, for viewing data)

### 1. Install dependencies
```bash
cd attendance_system
npm install
```

### 2. Configure environment
Edit `.env` if needed:
```
MONGODB_URI=mongodb://localhost:27017/attendance_db
SESSION_SECRET=attendance_secret_2024
PORT=4000
```

### 3. Start the server
```bash
npm start
```

Visit: **http://localhost:4000**

### 4. Default credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | admin123 |
| Teacher | Register at /register | — |

---

## MongoDB Compass

Connect to: `mongodb://localhost:27017`

Database: `attendance_db`

Collections:
- `users` — teacher/admin accounts
- `students` — student records
- `attendances` — attendance logs (with ObjectId references)
- `sessions` — active user sessions (managed by connect-mongo)

---

## Project Structure

```
attendance_system/
├── app.js              # Express app, MongoDB connection, middleware, routes
├── .env                # Environment variables (NOT committed)
├── .gitignore
├── middleware/
│   ├── auth.js         # requireLogin, requireAdmin
│   └── logger.js       # Request logger
├── models/
│   ├── User.js         # users collection
│   ├── Student.js      # students collection
│   └── Attendance.js   # attendances collection
├── routes/
│   ├── index.js        # Dashboard
│   ├── auth.js         # Login/register/logout
│   ├── students.js     # Student CRUD
│   ├── attendance.js   # Mark + report
│   └── admin.js        # Admin panel
└── views/              # EJS templates (claymorphism UI)
```
