# 🌸 Bloom & Blossom — Flower Shop E-Commerce

A complete flower shop e-commerce website built with Express.js, EJS, Tailwind CSS, and MySQL.

## Tech Stack

- **Backend**: Express.js (Node.js)
- **Templating**: EJS
- **Styling**: Tailwind CSS via CDN
- **Database**: MySQL (via XAMPP)
- **Auth**: express-session + bcrypt

## Setup Instructions

### 1. Start XAMPP
- Start **Apache** and **MySQL** in XAMPP Control Panel.

### 2. Create the Database
- Open **phpMyAdmin** at `http://localhost/phpmyadmin`
- Click **Import**, select `flower_shop/database.sql`, and run it.
- This creates the `flower_shop_db` database with tables and sample data.

### 3. Configure Environment
- Edit `.env` if needed (default: root user, no password, port 3000).

### 4. Install Dependencies
```bash
npm install
```

### 5. Start the Server
```bash
npm start
```

Visit: **http://localhost:3000**

---

## Default Credentials

| Role  | Email                      | Password  |
|-------|----------------------------|-----------|
| Admin | admin@flowershop.com       | admin123  |

> The admin password is automatically fixed on server startup using bcrypt.

---

## Features

### Customer Side
- 🌸 Beautiful homepage with hero section and featured products
- 🛍️ Shop with category filtering, search, and sorting
- 🌹 Product detail page with related products
- 🛒 Shopping cart with session persistence
- 📦 Checkout with shipping address
- 📋 Order history with status tracking

### Admin Side
- 📊 Dashboard with stats (revenue, orders, customers, low stock alerts)
- 💐 Product CRUD (add/edit/delete products with images)
- 📦 Order management with status updates
- 👥 User list

### Auth
- 🔐 Register/Login with bcrypt password hashing
- 🛡️ Session-based authentication
- ⚙️ Role-based access control (user / admin)

---

## Project Structure

```
flower_shop/
├── app.js              # Main Express app
├── .env                # Environment variables
├── database.sql        # MySQL schema + seed data
├── middleware/
│   ├── auth.js         # requireLogin, requireAdmin
│   └── cart.js         # Cart session middleware
├── routes/
│   ├── index.js        # Homepage
│   ├── auth.js         # Login/register/logout
│   ├── shop.js         # Product listing & detail
│   ├── cart.js         # Cart CRUD
│   ├── orders.js       # Checkout & order history
│   └── admin.js        # Admin panel
├── views/
│   ├── layout/         # Header & footer partials
│   ├── admin/          # Admin views
│   └── *.ejs           # Customer views
└── public/
    └── css/style.css   # Custom CSS
```
