# Pro-Talent-Connect Backend API

A comprehensive backend API for managing football/soccer players and administrative users with role-based access control.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication APIs](#authentication-apis)
  - [Player Management APIs](#player-management-apis)
  - [Dashboard APIs](#dashboard-apis)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## ✨ Features

- **Role-Based Access Control (RBAC)** - Super Admin and Admin roles
- **JWT Authentication** - Secure token-based authentication
- **Player Management** - Complete CRUD operations for player profiles
- **Admin Management** - User registration and profile management
- **Dashboard Analytics** - Statistical overview
- **Password Management** - Secure password hashing and change functionality
- **Comprehensive Testing** - Jest-based unit and integration tests

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Jest with Supertest
- **Development**: Nodemon for hot-reloading

---

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (optional, for version control)

---

## 🚀 Installation

### Step 1: Clone the Repository (if applicable)

```bash
git clone <repository-url>
cd Pro-Talent-Connect/Backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- And all dev dependencies (jest, nodemon, supertest, etc.)

---

## 🔐 Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/pro-talent-connect
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pro-talent-connect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d

# Super Admin Credentials (for initial seeding)
SUPER_ADMIN_EMAIL=superadmin@protalent.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123
SUPER_ADMIN_NAME=Super Admin
```

### Environment Variables Explanation:

| Variable               | Description                          | Default              |
| ---------------------- | ------------------------------------ | -------------------- |
| `PORT`                 | Server port number                   | 5000                 |
| `NODE_ENV`             | Environment (development/production) | development          |
| `MONGO_URI`            | MongoDB connection string            | Required             |
| `JWT_SECRET`           | Secret key for JWT token generation  | Required             |
| `JWT_EXPIRE`           | JWT token expiration time            | 30d                  |
| `SUPER_ADMIN_EMAIL`    | Initial super admin email            | Required for seeding |
| `SUPER_ADMIN_PASSWORD` | Initial super admin password         | Required for seeding |
| `SUPER_ADMIN_NAME`     | Initial super admin name             | Required for seeding |

---

## 🏃 Running the Application

### Development Mode (with hot-reload)

```bash
npm run dev
```

This starts the server using nodemon, which automatically restarts on file changes.

### Production Mode

```bash
npm start
```

### Seed Super Admin (First Time Setup)

After setting up your `.env` file, you may need to seed the super admin user for initial access:

```bash
node services/seedSuperAdmin.js
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

You should see:

```
✅ MongoDB Connected: <your-mongodb-host>
Server running on port 5000
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Root Endpoint

```http
GET /
```

Returns: `Pro-Talent-Connect API is running...`

---

## 🔑 Authentication APIs

All authentication endpoints are prefixed with `/api/auth`

### 1. Login Admin

**Endpoint**: `POST /api/auth/login`

**Access**: Public

**Description**: Authenticate an admin user and receive a JWT token

**Request Body**:

```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "Admin"
  }
}
```

**Error Response** (401):

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 2. Register Admin

**Endpoint**: `POST /api/auth/register`

**Access**: Super Admin Only (Protected)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Description**: Register a new admin user (only Super Admin can create new admins)

**Request Body**:

```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "SecurePassword123",
  "role": "Admin"
}
```

**Success Response** (201):

```json
{
  "success": true,
  "message": "Admin registered successfully",
  "admin": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "New Admin",
    "email": "newadmin@example.com",
    "role": "Admin"
  }
}
```

**Error Response** (403):

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

### 3. Get Profile

**Endpoint**: `GET /api/auth/profile`

**Access**: Protected (Any authenticated admin)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Description**: Get current authenticated admin's profile

**Success Response** (200):

```json
{
  "success": true,
  "admin": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "Admin",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Change Password

**Endpoint**: `PUT /api/auth/change-password`

**Access**: Protected (Any authenticated admin)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Description**: Change password for the authenticated admin

**Request Body**:

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response** (401):

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## ⚽ Player Management APIs

All player endpoints are prefixed with `/api/players` and require authentication.

### 1. Create Player

**Endpoint**: `POST /api/players`

**Access**: Super Admin Only (Protected)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Description**: Create a new player profile

**Request Body**:

```json
{
  "name": "Cristiano Ronaldo",
  "playingPosition": "Forward",
  "alternativePosition": "Winger",
  "preferredFoot": "Right",
  "transferMarketLink": "https://www.transfermarkt.com/cristiano-ronaldo/profil/spieler/8198",
  "playerId": "CR7-2024",
  "dateOfBirth": "1985-02-05",
  "weight": 84,
  "height": 187,
  "gender": "Male",
  "mobileNumber": "+351912345678",
  "email": "cr7@example.com",
  "profileImage": "https://example.com/images/cr7.jpg",
  "clubsPlayed": [
    {
      "clubName": "Manchester United",
      "duration": "2003-2009"
    },
    {
      "clubName": "Real Madrid",
      "duration": "2009-2018"
    }
  ]
}
```

**Success Response** (201):

```json
{
  "success": true,
  "message": "Player created successfully",
  "player": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Cristiano Ronaldo",
    "playingPosition": "Forward",
    "alternativePosition": "Winger",
    "preferredFoot": "Right",
    "playerId": "CR7-2024",
    "email": "cr7@example.com",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response** (400):

```json
{
  "success": false,
  "message": "Player with this ID already exists"
}
```

---

### 2. Get All Players

**Endpoint**: `GET /api/players`

**Access**: Admin & Super Admin (Protected)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Query Parameters** (optional):

- `page` - Page number for pagination (default: 1)
- `limit` - Number of results per page (default: 10)
- `search` - Search by name or player ID
- `position` - Filter by playing position
- `gender` - Filter by gender

**Example Request**:

```
GET /api/players?page=1&limit=10&search=Ronaldo&position=Forward
```

**Success Response** (200):

```json
{
  "success": true,
  "count": 25,
  "totalPages": 3,
  "currentPage": 1,
  "players": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Cristiano Ronaldo",
      "playingPosition": "Forward",
      "playerId": "CR7-2024",
      "email": "cr7@example.com",
      "mobileNumber": "+351912345678",
      "dateOfBirth": "1985-02-05",
      "gender": "Male",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Get Player by ID

**Endpoint**: `GET /api/players/:id`

**Access**: Admin & Super Admin (Protected)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Description**: Get detailed information about a specific player

**Success Response** (200):

```json
{
  "success": true,
  "player": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Cristiano Ronaldo",
    "playingPosition": "Forward",
    "alternativePosition": "Winger",
    "preferredFoot": "Right",
    "transferMarketLink": "https://www.transfermarkt.com/...",
    "playerId": "CR7-2024",
    "dateOfBirth": "1985-02-05",
    "weight": 84,
    "height": 187,
    "gender": "Male",
    "mobileNumber": "+351912345678",
    "email": "cr7@example.com",
    "profileImage": "https://example.com/images/cr7.jpg",
    "clubsPlayed": [
      {
        "clubName": "Manchester United",
        "duration": "2003-2009"
      }
    ],
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Super Admin",
      "email": "admin@example.com"
    },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response** (404):

```json
{
  "success": false,
  "message": "Player not found"
}
```

---

### 4. Update Player

**Endpoint**: `PUT /api/players/:id`

**Access**: Admin & Super Admin (Protected)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Description**: Update player information

**Request Body** (partial update supported):

```json
{
  "name": "Cristiano Ronaldo",
  "playingPosition": "Forward",
  "mobileNumber": "+351999999999",
  "weight": 85
}
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Player updated successfully",
  "player": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Cristiano Ronaldo",
    "playingPosition": "Forward",
    "weight": 85,
    "updatedBy": "507f1f77bcf86cd799439011",
    "updatedAt": "2025-01-16T11:00:00.000Z"
  }
}
```

---

### 5. Delete Player

**Endpoint**: `DELETE /api/players/:id`

**Access**: Admin & Super Admin (Protected)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Description**: Soft delete a player (marks as deleted rather than removing from database)

**Success Response** (200):

```json
{
  "success": true,
  "message": "Player deleted successfully"
}
```

**Error Response** (404):

```json
{
  "success": false,
  "message": "Player not found"
}
```

---

## 📊 Dashboard APIs

All dashboard endpoints are prefixed with `/api/dashboard`

### 1. Get Dashboard Statistics

**Endpoint**: `GET /api/dashboard/stats`

**Access**: Admin & Super Admin (Protected)

**Headers**:

```
Authorization: Bearer <jwt_token>
```

**Description**: Get statistical overview for the dashboard

**Success Response** (200):

```json
{
  "success": true,
  "stats": {
    "totalPlayers": 150,
    "totalAdmins": 5,
    "totalSuperAdmins": 1,
    "recentPlayers": 23,
    "playersByPosition": {
      "Forward": 45,
      "Midfielder": 50,
      "Defender": 40,
      "Goalkeeper": 15
    },
    "playersByGender": {
      "Male": 120,
      "Female": 30
    }
  }
}
```

---

## 🔒 Authentication & Authorization

### JWT Token Format

After successful login, you'll receive a JWT token. Include it in all protected requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access

- **Public Routes**:
  - `POST /api/auth/login`

- **Super Admin Only**:
  - `POST /api/auth/register`
  - `POST /api/players`

- **Admin & Super Admin**:
  - `GET /api/auth/profile`
  - `PUT /api/auth/change-password`
  - `GET /api/players`
  - `GET /api/players/:id`
  - `PUT /api/players/:id`
  - `DELETE /api/players/:id`
  - `GET /api/dashboard/stats`

---

## 🧪 Testing

The project includes comprehensive test suites using Jest and Supertest.

### Run All Tests

```bash
npm test
```

### Run Tests with JSON Output

```bash
npm run test:json
```

### Generate HTML Test Report

```bash
npm run report
```

This will generate:

- `test-results.json` - JSON format test results
- `test-report.html` - HTML formatted test report

### Test Coverage

Tests cover:

- **Authentication**: Login, registration, profile management, password change
- **Player Management**: CRUD operations, validation, authorization
- **Dashboard**: Statistics and analytics
- **Middleware**: JWT verification, role-based access control

---

## 📁 Project Structure

```
Backend/
├── app.js                  # Express app configuration
├── server.js              # Server entry point
├── package.json           # Dependencies and scripts
├── jest.config.js         # Jest configuration
├── generate-report.js     # Test report generator
│
├── config/
│   └── DB.js             # MongoDB connection setup
│
├── Middleware/
│   └── authMiddleware.js  # JWT & RBAC middleware
│
├── Models/
│   ├── Admin.js          # Admin user schema
│   └── Players.js        # Player schema
│
├── Routes/
│   ├── authRoutes.js     # Authentication routes
│   ├── dashboardRoutes.js # Dashboard routes
│   └── playerRoutes.js   # Player management routes
│
├── services/
│   ├── authController.js      # Auth business logic
│   ├── dashboardController.js # Dashboard logic
│   ├── playerController.js    # Player CRUD logic
│   ├── generateToken.js       # JWT token generation
│   └── seedSuperAdmin.js      # Database seeding script
│
└── tests/
    ├── setup.js          # Test setup and configuration
    ├── auth.test.js      # Authentication tests
    ├── dashboard.test.js # Dashboard tests
    └── players.test.js   # Player management tests
```

---

## 🐛 Common Issues & Troubleshooting

### Issue: MongoDB Connection Failed

**Solution**:

- Verify `MONGO_URI` in `.env` file
- Ensure MongoDB is running (for local setup)
- Check network connectivity (for MongoDB Atlas)

### Issue: JWT Token Invalid

**Solution**:

- Ensure `JWT_SECRET` is set in `.env`
- Check if token is properly formatted in Authorization header
- Token may have expired (check `JWT_EXPIRE` setting)

### Issue: Port Already in Use

**Solution**:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change PORT in .env file to use a different port
```

### Issue: Cannot Register Admin

**Solution**:

- Only Super Admin can register new admins
- Ensure you're logged in as Super Admin
- Verify the JWT token is valid and role is "Super Admin"

---

## 🚀 Deployment

### Environment Variables for Production

Ensure these are set securely:

- Use strong `JWT_SECRET`
- Use production MongoDB URI
- Set `NODE_ENV=production`
- Use strong passwords for Super Admin

### Recommended Platforms

- **Heroku**
- **AWS EC2 / Elastic Beanstalk**
- **DigitalOcean**
- **Render**
- **Railway**

---

## 📝 API Testing with Postman/Thunder Client

### Import Collection

You can test APIs using tools like Postman or Thunder Client VSCode extension.

1. **Login** first to get the JWT token
2. **Save the token** as an environment variable
3. **Add token** to Authorization header for protected routes

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential.

---

## 📞 Support

For support, email: support@protalent.com

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js and MongoDB
- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Create `.env` file with required variables
- [ ] Ensure MongoDB is running
- [ ] Run `node services/seedSuperAdmin.js` (first time only)
- [ ] Run `npm run dev`
- [ ] Test with `POST /api/auth/login` using Super Admin credentials
- [ ] Start building features!

---

**Happy Coding! ⚽🚀**
