# 🔐 Mini User Management System

A full-stack web application with secure authentication, role-based authorization (RBAC), and user lifecycle management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Mini User Management System demonstrates enterprise-level authentication and authorization patterns with a clean architecture. It supports admin and user roles, enabling administrators to manage users while allowing users to manage their own profiles securely.

**Live Demo: **https://drive.google.com/file/d/1pO3CwwrZorliQUbYU53ONnaZ9V4uX-2G/view?usp=sharing**

**Deployed Link: https://miniusermanager.netlify.app/**

### Key Highlights

- 🔐 Secure JWT-based authentication
- 👥 Role-based access control (Admin/User)
- 🛡️ Password hashing with bcrypt
- 📱 Responsive React frontend
- ☁️ Cloud-ready MongoDB integration
- 🚀 Production-ready deployment setup

## ✨ Features

### Authentication & Security
- User signup and login with JWT tokens
- Secure password hashing using bcrypt
- Token-based protected routes
- Role-based access control (RBAC)
- Input validation on all endpoints
- Environment-based configuration

### User Features
- View and edit personal profile
- Update full name and email
- Change password securely
- Session management and logout

### Admin Features
- View all users with pagination
- Activate/deactivate user accounts
- Change user roles (user ↔ admin)
- Admin-only protected dashboard
- Confirmation dialogs for critical actions

### Frontend
- Clean, responsive UI
- Protected routes based on authentication
- Toast notifications for user feedback
- Context API for state management
- Loading states and error handling

## 🛠 Tech Stack

### Backend
- **Python 3.8+** - Programming language
- **Flask** - Web framework
- **Flask-JWT-Extended** - JWT authentication
- **Flask-PyMongo** - MongoDB integration
- **bcrypt** - Password hashing
- **MongoDB Atlas** - Cloud database

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### DevOps & Deployment
- **Render/Railway** - Backend hosting
- **Vercel/Netlify** - Frontend hosting
- **MongoDB Atlas** - Database hosting
- **GitHub Actions** - CI/CD (optional)

## 🏗 System Architecture

```
┌─────────────────┐
│  React Frontend │
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP/HTTPS
         │ JWT Token
         ▼
┌─────────────────┐
│   Flask API     │
│   (Port 5000)   │
└────────┬────────┘
         │ PyMongo
         ▼
┌─────────────────┐
│  MongoDB Atlas  │
│   (Cloud DB)    │
└─────────────────┘
```

### Architecture Principles
- **Stateless Backend:** JWT tokens for authentication
- **Separation of Concerns:** Routes, utilities, and extensions
- **RESTful API Design:** Standard HTTP methods and status codes
- **Scalable:** Horizontal scaling ready
- **Secure:** Environment variables, password hashing, CORS

## 📁 Project Structure

```
mini-user-management/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── extensions.py          # Flask extensions (JWT, PyMongo)
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py           # Authentication routes
│   │   ├── user.py           # User management routes
│   │   └── admin.py          # Admin-only routes
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── validators.py     # Input validation helpers
│   │   └── decorators.py     # Custom decorators (admin_required)
│   └── tests/
│       ├── __init__.py
│       ├── test_auth.py
│       ├── test_user.py
│       └── test_admin.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── main.jsx          # Application entry point
│   │   ├── App.jsx           # Root component
│   │   ├── api/
│   │   │   └── axios.js      # Axios configuration
│   │   ├── auth/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminPanel.jsx
│   │   └── styles/
│   │       └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── .gitignore
├── README.md
└── LICENSE
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** and npm ([Download](https://nodejs.org/))
- **MongoDB Atlas Account** ([Sign up](https://www.mongodb.com/cloud/atlas/register))
- **Git** ([Download](https://git-scm.com/downloads))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shilwantharshal/mini-user-management.git
cd mini-user-management
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/user_management?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# CORS (optional - for production)
CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

**Important:** 
- Replace `<username>` and `<password>` with your MongoDB Atlas credentials
- Generate a strong JWT secret key (you can use: `python -c "import secrets; print(secrets.token_hex(32))"`)

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://127.0.0.1:5000
```

For production:
```env
VITE_API_URL=https://your-backend-api.onrender.com
```

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string from "Connect" → "Connect your application"
6. Replace `<password>` in the connection string with your database user password

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python app.py
```

Backend will run on: **https://render.com/docs/web-services#port-binding**

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on: **https://miniusermanager.netlify.app/**

### Create First Admin User

You can create an admin user in two ways:

**Option 1: Using Python Shell**
```python
from app import mongo
from werkzeug.security import generate_password_hash

mongo.db.users.insert_one({
    "email": "admin@example.com",
    "password": generate_password_hash("Admin@123"),
    "full_name": "Admin User",
    "role": "admin",
    "is_active": True
})
```

**Option 2: Sign up normally, then promote via MongoDB Atlas**
1. Sign up through the UI
2. Go to MongoDB Atlas → Browse Collections
3. Find your user document and change `"role": "user"` to `"role": "admin"`

## 📡 API Documentation

### Base URL
```
Development: http://127.0.0.1:5000
Production: https://your-api-url.com
```

### Authentication Endpoints

#### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}

Response: 201 Created
{
  "message": "Signup successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "full_name": "John Doe",
  "role": "user",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### User Endpoints (Authenticated)

#### Get Own Profile
```http
GET /users/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Updated",
  "email": "john.new@example.com"
}
```

#### Change Password
```http
PUT /users/me/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "OldPass@123",
  "new_password": "NewPass@123"
}
```

### Admin Endpoints (Admin Role Required)

#### List All Users
```http
GET /admin/users?page=1&limit=10
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "users": [...],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

#### Activate User
```http
PUT /admin/users/:id/activate
Authorization: Bearer <admin-token>
```

#### Deactivate User
```http
PUT /admin/users/:id/deactivate
Authorization: Bearer <admin-token>
```

#### Change User Role
```http
PUT /admin/users/:id/role
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin"  // or "user"
}
```

### Error Responses

```json
{
  "error": "Invalid credentials"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🌐 Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render](https://render.com/) and create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
5. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET_KEY`
   - `FLASK_ENV=production`
6. Deploy!



### MongoDB Atlas (Production)

1. Update Network Access to allow connections from anywhere (0.0.0.0/0) or specific IPs
2. Use strong passwords
3. Enable backup (paid tier)
4. Monitor usage in Atlas dashboard

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest -v

# With coverage
pytest --cov=. --cov-report=html
```

### Test Structure
- `test_auth.py` - Authentication endpoints
- `test_user.py` - User management
- `test_admin.py` - Admin operations and RBAC

### Frontend Tests (Optional)

```bash
cd frontend
npm test
```

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for stateless auth
- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints
- ✅ CORS configured properly
- ✅ SQL injection prevention (NoSQL)
- ✅ Rate limiting (implement in production)
- ✅ HTTPS in production

