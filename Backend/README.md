# Pro-Talent-Connect — Backend API

A comprehensive RESTful API for managing players and administrators in a professional talent management system. Built with Node.js, Express, MongoDB, and JWT authentication with role-based access control.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Role-Based Access Control](#role-based-access-control)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth API](#auth-api)
  - [Dashboard API](#dashboard-api)
  - [Players API](#players-api)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Development Guide](#development-guide)

---

## Overview

The Pro-Talent-Connect Backend API is a secure, scalable system designed for managing player profiles in the sports talent industry. It provides robust authentication, role-based authorization, and complete CRUD operations with advanced features like pagination, filtering, and soft deletes.

## Features

✅ **JWT Authentication** - Secure token-based authentication with 7-day expiry  
✅ **Role-Based Access Control (RBAC)** - Super Admin and Admin roles with granular permissions  
✅ **Player Management** - Complete CRUD operations with advanced search and filtering  
✅ **Password Security** - bcrypt hashing with salt rounds for secure password storage  
✅ **Dashboard Analytics** - Real-time statistics for monitoring system usage  
✅ **Soft Deletes** - Players are marked as deleted rather than permanently removed  
✅ **Data Validation** - Mongoose schema validation ensures data integrity  
✅ **Error Handling** - Consistent error responses across all endpoints  
✅ **CORS Enabled** - Ready for frontend integration  
✅ **Auto-Timestamps** - Automatic createdAt/updatedAt tracking

## Tech Stack

| Technology     | Version | Purpose                       |
| -------------- | ------- | ----------------------------- |
| **Node.js**    | Latest  | JavaScript runtime            |
| **Express.js** | 5.2.1   | Web framework                 |
| **MongoDB**    | 7.1.0   | NoSQL database                |
| **Mongoose**   | 9.2.1   | ODM for MongoDB               |
| **JWT**        | 9.0.3   | Authentication tokens         |
| **bcryptjs**   | 3.0.3   | Password hashing              |
| **dotenv**     | 17.3.1  | Environment variables         |
| **CORS**       | 2.8.6   | Cross-origin resource sharing |
| **nodemon**    | 3.1.11  | Development auto-reload       |

## How It Works

### Architecture Overview

```
┌─────────────┐
│   Client    │
│ (Frontend)  │
└──────┬──────┘
       │ HTTP Requests
       │ (JSON + JWT Token)
       ▼
┌─────────────────────────────────────────┐
│          Express.js Server              │
│  ┌───────────────────────────────────┐  │
│  │  Middleware Layer                 │  │
│  │  • CORS                           │  │
│  │  • JSON Parser                    │  │
│  │  • JWT Verification (protect)     │  │
│  │  • Role Authorization (authorize) │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Routes Layer                     │  │
│  │  • /api/auth                      │  │
│  │  • /api/players                   │  │
│  │  • /api/dashboard                 │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Controllers (Business Logic)     │  │
│  │  • authController.js              │  │
│  │  • playerController.js            │  │
│  │  • dashboardController.js         │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Models (Data Layer)              │  │
│  │  • Admin.js                       │  │
│  │  • Players.js                     │  │
│  └───────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │ Mongoose ODM
               ▼
        ┌─────────────┐
        │   MongoDB   │
        │  Database   │
        └─────────────┘
```

### Request Flow

1. **Client Request** → Client sends HTTP request with JWT token in Authorization header
2. **CORS Middleware** → Validates cross-origin requests
3. **JSON Parser** → Parses incoming JSON payloads
4. **Route Matching** → Express routes the request to appropriate handler
5. **Authentication** → `protect` middleware verifies JWT token
6. **Authorization** → `authorize` middleware checks user role permissions
7. **Controller** → Business logic processes the request
8. **Model** → Mongoose interacts with MongoDB
9. **Response** → JSON response sent back to client

### Authentication Flow

```
Login Request
     ↓
Validate Credentials
     ↓
Generate JWT Token (7-day expiry)
     ↓
Return Token + User Data
     ↓
Client Stores Token
     ↓
Subsequent Requests Include Token
     ↓
Middleware Verifies Token
     ↓
Request Processed
```

### Password Security

1. User provides password during registration/login
2. bcrypt generates salt (10 rounds)
3. Password is hashed with salt
4. Only hash is stored in database
5. On login: entered password is hashed and compared with stored hash
6. Passwords never stored or transmitted in plain text

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** (optional) - [Download](https://git-scm.com/)

### Installation Steps

#### 1. Clone or Download the Project

```bash
cd Backend
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:

- express
- mongoose
- jsonwebtoken
- bcryptjs
- dotenv
- cors

#### 3. Configure Environment Variables

Create a `.env` file in the `Backend/` folder:

```env
# Server Configuration
PORT=5000

# Database Connection
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/protalent

# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/protalent?retryWrites=true&w=majority

# JWT Secret Key (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# JWT Expiry (optional, defaults to 7d)
JWT_EXPIRE=7d
```

⚠️ **Security Note**:

- Use a strong, random JWT_SECRET in production
- Never commit `.env` file to version control
- Keep your MongoDB credentials secure

#### 4. Start MongoDB

If using local MongoDB:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

If using MongoDB Atlas, ensure your IP is whitelisted in the Atlas dashboard.

#### 5. Seed the Super Admin

This creates the initial Super Admin account needed to manage the system:

```bash
node services/seedSuperAdmin.js
```

**Output:**

```
✅ MongoDB Connected: localhost
Super Admin created successfully!
  Email:    superadmin@protalent.com
  Password: SuperAdmin@123
  (change the password after first login)
```

**Default Credentials:**

| Field    | Value                      |
| -------- | -------------------------- |
| Email    | `superadmin@protalent.com` |
| Password | `SuperAdmin@123`           |
| Role     | `Super Admin`              |

⚠️ **Important**: Change this password immediately after first login!

#### 6. Start the Server

**Development Mode** (with auto-reload):

```bash
npm run dev
```

**Production Mode**:

```bash
npm start
```

**Success Output:**

```
Server running on port 5000
✅ MongoDB Connected: localhost
```

The API is now running at: `http://localhost:5000`

#### 7. Test the API

Open your browser or API client (Postman, Thunder Client, cURL) and visit:

```
http://localhost:5000
```

You should see:

```
Pro-Talent-Connect API is running...
```

---

## Environment Variables

| Variable     | Description                       | Example                                          | Required |
| ------------ | --------------------------------- | ------------------------------------------------ | -------- |
| `PORT`       | Server port number                | `5000`                                           | No       |
| `MONGO_URI`  | MongoDB connection string         | `mongodb://localhost:27017/protalent`            | Yes      |
| `JWT_SECRET` | Secret key for signing JWT tokens | `my_super_secret_key_32_chars_min`               | Yes      |
| `JWT_EXPIRE` | JWT token expiration time         | `7d` (7 days), `24h` (24 hours), `30m` (30 mins) | No       |

### MongoDB Connection Strings

**Local MongoDB:**

```
MONGO_URI=mongodb://localhost:27017/protalent
```

**MongoDB Atlas (Cloud):**

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/protalent?retryWrites=true&w=majority
```

**MongoDB with Authentication:**

```
MONGO_URI=mongodb://username:password@localhost:27017/protalent?authSource=admin
```

---

## Project Structure

```
Backend/
├── config/
│   └── DB.js                    # MongoDB connection with error handling
│
├── Middleware/
│   └── authMiddleware.js        # JWT verification & role authorization
│       ├── protect()            # Verifies JWT token
│       └── authorize(roles)     # Checks user role permissions
│
├── Models/
│   ├── Admin.js                 # Admin schema with password hashing
│   │   ├── Pre-save hook        # Auto-hash password before saving
│   │   └── matchPassword()      # Method to verify password
│   └── Players.js               # Player schema with validations
│
├── Routes/
│   ├── authRoutes.js            # Authentication routes
│   │   ├── POST /login          # Public
│   │   ├── POST /register       # Super Admin only
│   │   ├── GET  /profile        # Authenticated
│   │   └── PUT  /change-password# Authenticated
│   │
│   ├── playerRoutes.js          # Player management routes
│   │   ├── POST   /             # Super Admin only
│   │   ├── GET    /             # Admin & Super Admin
│   │   ├── GET    /:id          # Admin & Super Admin
│   │   ├── PUT    /:id          # Admin & Super Admin
│   │   └── DELETE /:id          # Admin & Super Admin
│   │
│   └── dashboardRoutes.js       # Dashboard routes
│       └── GET /stats           # Admin & Super Admin
│
├── services/
│   ├── authController.js        # Authentication business logic
│   │   ├── loginAdmin()         # Login with JWT token generation
│   │   ├── registerAdmin()      # Create new admin
│   │   ├── getProfile()         # Get current admin profile
│   │   └── changePassword()     # Update password
│   │
│   ├── playerController.js      # Player CRUD operations
│   │   ├── createPlayer()       # Create new player
│   │   ├── getAllPlayers()      # List with pagination & filters
│   │   ├── getPlayerById()      # Get single player
│   │   ├── updatePlayer()       # Update player data
│   │   └── deletePlayer()       # Soft delete player
│   │
│   ├── dashboardController.js   # Dashboard analytics
│   │   └── getDashboardStats()  # Get system statistics
│   │
│   ├── generateToken.js         # JWT token generation utility
│   └── seedSuperAdmin.js        # One-time Super Admin setup
│
├── .env                         # Environment variables (NOT in git)
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies and scripts
├── server.js                    # Express app entry point
└── README.md                    # This documentation
```

### File Responsibilities

#### `server.js`

- Express application setup
- Middleware configuration (CORS, JSON parser)
- Route mounting
- Database connection initialization
- Server startup

#### `config/DB.js`

- MongoDB connection via Mongoose
- Connection error handling
- Connection event listeners
- Graceful failure (server starts even if DB is down)

#### `Middleware/authMiddleware.js`

**`protect` middleware:**

- Extracts JWT token from Authorization header
- Verifies token with JWT_SECRET
- Decodes user ID from token payload
- Fetches admin from database
- Attaches admin to `req.admin` and `req.user`
- Returns 401 if token is invalid or missing

**`authorize(...roles)` middleware:**

- Checks if authenticated admin's role is in allowed roles
- Returns 403 if role is not authorized
- Must be used after `protect` middleware

#### Models

**`Admin.js`:**

- Defines admin schema
- Auto-hashes password on save using bcrypt
- Provides `matchPassword()` method for login verification
- Enum validation for roles: "Admin" or "Super Admin"

**`Players.js`:**

- Defines player schema with comprehensive fields
- Validates enum fields (gender, preferredFoot)
- Unique constraints on playerId and email
- Tracks creating/updating admin via references
- Soft delete flag (`isDeleted`)

#### Controllers (Services)

Controllers contain the business logic for each feature:

- Input validation
- Database operations
- Response formatting
- Error handling

---

## Role-Based Access Control

The API implements two distinct roles with different permission levels:

| Feature               | Super Admin | Admin |
| --------------------- | :---------: | :---: |
| **Authentication**    |             |       |
| Login                 |     ✅      |  ✅   |
| View own profile      |     ✅      |  ✅   |
| Change own password   |     ✅      |  ✅   |
| **Admin Management**  |             |       |
| Register new admins   |     ✅      |  ❌   |
| **Player Management** |             |       |
| Create players        |     ✅      |  ❌   |
| View all players      |     ✅      |  ✅   |
| View player details   |     ✅      |  ✅   |
| Update players        |     ✅      |  ✅   |
| Delete players        |     ✅      |  ✅   |
| **Dashboard**         |             |       |
| View statistics       |     ✅      |  ✅   |

### Role Definitions

**Super Admin:**

- Complete system access
- Can create new players
- Can register new admins (both Admin and Super Admin)
- Full CRUD on all resources

**Admin:**

- Limited system access
- Cannot create new players
- Cannot register new admins
- Can view, update, and delete existing players
- Can view dashboard statistics

---

## Authentication

This API uses **JWT (JSON Web Tokens)** for stateless authentication.

### How JWT Works

1. User logs in with email and password
2. Server validates credentials
3. Server generates JWT token containing user ID and role
4. Token is signed with `JWT_SECRET`
5. Token is returned to client
6. Client stores token (localStorage, sessionStorage, etc.)
7. Client includes token in `Authorization` header for subsequent requests
8. Server verifies token on each protected request

### Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTFiMmMzZDRlNWY2YTdiOGM5ZDBlMSIsImlhdCI6MTcwODYxMjM0NSwiZXhwIjoxNzA5MjE3MTQ1fQ.Kx7Tz9Qh3yY5nR8mW2jP4vL6sN8gT1kD3fH9bJ7eO0u
```

### Token Payload

```json
{
  "id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "iat": 1708612345,
  "exp": 1709217145
}
```

- `id`: Admin's MongoDB ObjectId
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (7 days from issue)

### Using Authentication

**Without Authentication (Public):**

```http
POST /api/auth/login
```

**With Authentication (Protected):**

```http
GET /api/auth/profile
Authorization: Bearer <your-token>
```

### Token Expiration

- Default expiry: **7 days**
- Customizable via `JWT_EXPIRE` environment variable
- After expiration, user must login again
- No refresh token mechanism (stateless design)

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth API

Base: `/api/auth`

#### 1. Login

Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`  
**Access:** Public (no token required)

**Request:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "superadmin@protalent.com",
  "password": "SuperAdmin@123"
}
```

**Request Body:**

| Field      | Type   | Required | Description    |
| ---------- | ------ | :------: | -------------- |
| `email`    | String |    ✅    | Admin email    |
| `password` | String |    ✅    | Admin password |

**Success Response:** `200 OK`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "name": "Super Admin",
  "email": "superadmin@protalent.com",
  "role": "Super Admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Message                           | Cause                     |
| ------ | --------------------------------- | ------------------------- |
| 400    | Please provide email and password | Missing email or password |
| 401    | Invalid email or password         | Wrong credentials         |
| 500    | Internal server error             | Database connection issue |

---

#### 2. Register Admin

Create a new admin account (Super Admin only).

**Endpoint:** `POST /api/auth/register`  
**Access:** Super Admin only

**Headers:**

```
Authorization: Bearer <super_admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Manager",
  "email": "john@protalent.com",
  "password": "SecurePass123!",
  "role": "Admin"
}
```

| Field      | Type   | Required | Default   | Description                       |
| ---------- | ------ | :------: | --------- | --------------------------------- |
| `name`     | String |    ✅    | -         | Admin's full name                 |
| `email`    | String |    ✅    | -         | Admin email (must be unique)      |
| `password` | String |    ✅    | -         | Admin password (min 6 characters) |
| `role`     | String |    ❌    | `"Admin"` | `"Admin"` or `"Super Admin"`      |

**Success Response:** `201 Created`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e2",
  "name": "John Manager",
  "email": "john@protalent.com",
  "role": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Message                                  | Cause                           |
| ------ | ---------------------------------------- | ------------------------------- |
| 400    | Please provide name, email, and password | Missing required fields         |
| 400    | Admin with this email already exists     | Duplicate email                 |
| 401    | Not authorized, no token                 | Missing JWT token               |
| 403    | Role 'Admin' is not authorized...        | Non-Super Admin tried to access |
| 500    | Internal server error                    | Database issue                  |

---

#### 3. Get Profile

Retrieve current admin's profile.

**Endpoint:** `GET /api/auth/profile`  
**Access:** Any authenticated admin

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response:** `200 OK`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
  "name": "Super Admin",
  "email": "superadmin@protalent.com",
  "role": "Super Admin",
  "createdAt": "2026-01-14T10:00:00.000Z",
  "updatedAt": "2026-02-14T10:00:00.000Z"
}
```

**Error Responses:**

| Status | Message                      | Cause                 |
| ------ | ---------------------------- | --------------------- |
| 401    | Not authorized, no token     | Missing token         |
| 401    | Not authorized, token failed | Invalid/expired token |
| 401    | Admin not found              | Admin deleted         |

---

#### 4. Change Password

Update current admin's password.

**Endpoint:** `PUT /api/auth/change-password`  
**Access:** Any authenticated admin

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "oldPassword": "OldPassword123",
  "newPassword": "NewSecurePass456!"
}
```

| Field         | Type   | Required | Description                |
| ------------- | ------ | :------: | -------------------------- |
| `oldPassword` | String |    ✅    | Current password           |
| `newPassword` | String |    ✅    | New password (min 6 chars) |

**Success Response:** `200 OK`

```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**

| Status | Message                             | Cause              |
| ------ | ----------------------------------- | ------------------ |
| 400    | Please provide old and new password | Missing fields     |
| 400    | Old password is incorrect           | Wrong old password |
| 401    | Not authorized                      | No/invalid token   |

---

### Dashboard API

Base: `/api/dashboard`

#### 1. Get Stats

Retrieve dashboard statistics.

**Endpoint:** `GET /api/dashboard/stats`  
**Access:** Admin & Super Admin

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response:** `200 OK`

```json
{
  "totalPlayers": 150,
  "totalAdmins": 8,
  "activePlayers": 142,
  "deletedPlayers": 8
}
```

**Response Fields:**

| Field            | Type   | Description                       |
| ---------------- | ------ | --------------------------------- |
| `totalPlayers`   | Number | Total players (including deleted) |
| `totalAdmins`    | Number | Total admins in system            |
| `activePlayers`  | Number | Players not marked as deleted     |
| `deletedPlayers` | Number | Soft-deleted players              |

---

### Players API

Base: `/api/players`

> All player endpoints require authentication

#### 1. Create Player

Add a new player to the database.

**Endpoint:** `POST /api/players`  
**Access:** Super Admin only

**Headers:**

```
Authorization: Bearer <super_admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Lionel Messi",
  "playingPosition": "Forward",
  "alternativePosition": "Attacking Midfielder",
  "preferredFoot": "Left",
  "transferMarketLink": "https://www.transfermarkt.com/lionel-messi/profil/spieler/28003",
  "playerId": "PLR-001",
  "dateOfBirth": "1987-06-24",
  "weight": 72,
  "height": 170,
  "gender": "Male",
  "mobileNumber": "+1234567890",
  "email": "messi@example.com",
  "clubsPlayed": [
    {
      "clubName": "FC Barcelona",
      "duration": "2004-2021"
    },
    {
      "clubName": "Paris Saint-Germain",
      "duration": "2021-2023"
    },
    {
      "clubName": "Inter Miami",
      "duration": "2023-Present"
    }
  ]
}
```

**Field Reference:**

| Field                    | Type   | Required | Validation                      | Description                       |
| ------------------------ | ------ | :------: | ------------------------------- | --------------------------------- |
| `name`                   | String |    ✅    | -                               | Player's full name                |
| `playingPosition`        | String |    ✅    | -                               | Primary position                  |
| `alternativePosition`    | String |    ❌    | -                               | Secondary position                |
| `preferredFoot`          | String |    ❌    | `"Left"`, `"Right"`, `"Both"`   | Preferred foot                    |
| `transferMarketLink`     | String |    ❌    | -                               | TransferMarkt profile URL         |
| `playerId`               | String |    ✅    | Unique                          | Player identifier (e.g., PLR-001) |
| `dateOfBirth`            | Date   |    ✅    | Format: `YYYY-MM-DD`            | Player's birth date               |
| `weight`                 | Number |    ❌    | -                               | Weight in kilograms               |
| `height`                 | Number |    ❌    | -                               | Height in centimeters             |
| `gender`                 | String |    ✅    | `"Male"`, `"Female"`, `"Other"` | Player's gender                   |
| `mobileNumber`           | String |    ✅    | -                               | Contact number                    |
| `email`                  | String |    ✅    | Unique, valid email             | Player's email                    |
| `clubsPlayed`            | Array  |    ❌    | -                               | Array of club history             |
| `clubsPlayed[].clubName` | String |    ❌    | -                               | Club name                         |
| `clubsPlayed[].duration` | String |    ❌    | -                               | Duration (e.g., "2020-2023")      |

**Success Response:** `201 Created`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e3",
  "name": "Lionel Messi",
  "playingPosition": "Forward",
  "alternativePosition": "Attacking Midfielder",
  "preferredFoot": "Left",
  "transferMarketLink": "https://www.transfermarkt.com/lionel-messi/profil/spieler/28003",
  "playerId": "PLR-001",
  "dateOfBirth": "1987-06-24T00:00:00.000Z",
  "weight": 72,
  "height": 170,
  "gender": "Male",
  "mobileNumber": "+1234567890",
  "email": "messi@example.com",
  "clubsPlayed": [
    { "clubName": "FC Barcelona", "duration": "2004-2021" },
    { "clubName": "Paris Saint-Germain", "duration": "2021-2023" },
    { "clubName": "Inter Miami", "duration": "2023-Present" }
  ],
  "createdBy": "65a1b2c3d4e5f6a7b8c9d0e1",
  "isDeleted": false,
  "createdAt": "2026-02-14T10:30:00.000Z",
  "updatedAt": "2026-02-14T10:30:00.000Z"
}
```

**Error Responses:**

| Status | Message                                           | Cause                    |
| ------ | ------------------------------------------------- | ------------------------ |
| 400    | Please provide all required fields                | Missing required fields  |
| 400    | Player with this playerId or email already exists | Duplicate playerId/email |
| 401    | Not authorized                                    | No/invalid token         |
| 403    | Role 'Admin' is not authorized...                 | Non-Super Admin tried    |

---

#### 2. Get All Players

Retrieve paginated list of players with optional filters.

**Endpoint:** `GET /api/players`  
**Access:** Admin & Super Admin

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter         | Type   | Default | Description                           |
| ----------------- | ------ | ------- | ------------------------------------- |
| `page`            | Number | 1       | Page number                           |
| `limit`           | Number | 10      | Results per page                      |
| `name`            | String | -       | Search by name (case-insensitive)     |
| `playingPosition` | String | -       | Filter by position (case-insensitive) |
| `gender`          | String | -       | Filter by gender                      |
| `preferredFoot`   | String | -       | Filter by foot                        |

**Example Requests:**

```
GET /api/players
GET /api/players?page=2&limit=20
GET /api/players?name=messi
GET /api/players?playingPosition=Forward
GET /api/players?playingPosition=Forward&gender=Male
GET /api/players?preferredFoot=Left&page=1
```

**Success Response:** `200 OK`

```json
{
  "players": [
    {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e3",
      "name": "Lionel Messi",
      "playingPosition": "Forward",
      "playerId": "PLR-001",
      "email": "messi@example.com"
      // ... all other fields
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalResults": 50,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

**Response Fields:**

| Field          | Type    | Description                  |
| -------------- | ------- | ---------------------------- |
| `players`      | Array   | Array of player objects      |
| `currentPage`  | Number  | Current page number          |
| `totalPages`   | Number  | Total number of pages        |
| `totalResults` | Number  | Total matching players       |
| `hasNextPage`  | Boolean | Whether next page exists     |
| `hasPrevPage`  | Boolean | Whether previous page exists |

---

#### 3. Get Player by ID

Retrieve a single player by MongoDB ObjectId.

**Endpoint:** `GET /api/players/:id`  
**Access:** Admin & Super Admin

**Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
GET /api/players/65a1b2c3d4e5f6a7b8c9d0e3
```

**Success Response:** `200 OK`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e3",
  "name": "Lionel Messi",
  "playingPosition": "Forward",
  "alternativePosition": "Attacking Midfielder",
  "preferredFoot": "Left",
  "transferMarketLink": "https://www.transfermarkt.com/lionel-messi/profil/spieler/28003",
  "playerId": "PLR-001",
  "dateOfBirth": "1987-06-24T00:00:00.000Z",
  "weight": 72,
  "height": 170,
  "gender": "Male",
  "mobileNumber": "+1234567890",
  "email": "messi@example.com",
  "clubsPlayed": [...],
  "createdBy": "65a1b2c3d4e5f6a7b8c9d0e1",
  "updatedBy": null,
  "isDeleted": false,
  "createdAt": "2026-02-14T10:30:00.000Z",
  "updatedAt": "2026-02-14T10:30:00.000Z"
}
```

**Error Response:**

| Status | Message          | Cause                 |
| ------ | ---------------- | --------------------- |
| 404    | Player not found | Invalid ID or deleted |
| 401    | Not authorized   | No/invalid token      |

---

#### 4. Update Player

Update player information. Only send fields you want to change.

**Endpoint:** `PUT /api/players/:id`  
**Access:** Admin & Super Admin

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (Partial Update):**

```json
{
  "weight": 73,
  "playingPosition": "Attacking Midfielder"
}
```

OR

```json
{
  "clubsPlayed": [
    { "clubName": "FC Barcelona", "duration": "2004-2021" },
    { "clubName": "Paris Saint-Germain", "duration": "2021-2023" },
    { "clubName": "Inter Miami", "duration": "2023-2026" },
    { "clubName": "New Club FC", "duration": "2026-Present" }
  ]
}
```

**Success Response:** `200 OK`

Returns the complete updated player object.

**Error Responses:**

| Status | Message                     | Cause                              |
| ------ | --------------------------- | ---------------------------------- |
| 400    | Duplicate playerId or email | Trying to update to existing value |
| 404    | Player not found            | Invalid ID                         |
| 401    | Not authorized              | No/invalid token                   |

---

#### 5. Delete Player

Soft delete a player (sets `isDeleted` to `true`).

**Endpoint:** `DELETE /api/players/:id`  
**Access:** Admin & Super Admin

**Headers:**

```
Authorization: Bearer <token>
```

**Example:**

```
DELETE /api/players/65a1b2c3d4e5f6a7b8c9d0e3
```

**Success Response:** `200 OK`

```json
{
  "message": "Player deleted successfully"
}
```

**Error Response:**

| Status | Message          | Cause            |
| ------ | ---------------- | ---------------- |
| 404    | Player not found | Invalid ID       |
| 401    | Not authorized   | No/invalid token |

**Note:** This is a soft delete. The player record remains in the database with `isDeleted: true`. To permanently delete, you would need to manually remove from MongoDB.

---

## Data Models

### Admin Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
    // Auto-hashed with bcrypt before saving
  },
  role: {
    type: String,
    enum: ["Admin", "Super Admin"],
    default: "Admin"
  },
  createdAt: Date,  // Auto-generated
  updatedAt: Date   // Auto-generated
}
```

**Methods:**

- `matchPassword(enteredPassword)` - Compares plain password with hashed password

**Middleware:**

- Pre-save hook to hash password before saving

---

### Player Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  playingPosition: {
    type: String,
    required: true
  },
  alternativePosition: String,
  preferredFoot: {
    type: String,
    enum: ["Left", "Right", "Both"]
  },
  transferMarketLink: String,
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  weight: Number,  // in kg
  height: Number,  // in cm
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  clubsPlayed: [
    {
      clubName: String,
      duration: String
    }
  ],
  createdBy: {
    type: ObjectId,
    ref: "Admin"
  },
  updatedBy: {
    type: ObjectId,
    ref: "Admin"
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: Date,  // Auto-generated
  updatedAt: Date   // Auto-generated
}
```

---

## Error Handling

### Error Response Format

All errors follow this consistent format:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Status Code | Meaning               | Common Causes                                 |
| ----------- | --------------------- | --------------------------------------------- |
| **200**     | OK                    | Successful GET, PUT, DELETE                   |
| **201**     | Created               | Successful POST (resource created)            |
| **400**     | Bad Request           | Missing fields, validation errors, duplicates |
| **401**     | Unauthorized          | Missing token, invalid token, wrong password  |
| **403**     | Forbidden             | Insufficient role permissions                 |
| **404**     | Not Found             | Resource doesn't exist                        |
| **500**     | Internal Server Error | Database errors, unexpected errors            |

### Common Error Scenarios

#### Authentication Errors (401)

```json
{ "message": "Not authorized, no token" }
{ "message": "Not authorized, token failed" }
{ "message": "Admin not found" }
{ "message": "Invalid email or password" }
```

#### Authorization Errors (403)

```json
{ "message": "Role 'Admin' is not authorized to access this resource" }
```

#### Validation Errors (400)

```json
{ "message": "Please provide all required fields" }
{ "message": "Please provide email and password" }
{ "message": "Admin with this email already exists" }
{ "message": "Player with this playerId or email already exists" }
```

#### Not Found Errors (404)

```json
{ "message": "Player not found" }
{ "message": "Admin not found" }
```

---

## Development Guide

### Running in Development

```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Running in Production

```bash
npm start
```

### Testing the API

You can test the API using:

1. **Postman** - [Download](https://www.postman.com/downloads/)
2. **Thunder Client** - VS Code extension
3. **cURL** - Command line
4. **Insomnia** - [Download](https://insomnia.rest/download)

### Example cURL Commands

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@protalent.com","password":"SuperAdmin@123"}'
```

**Get All Players:**

```bash
curl -X GET http://localhost:5000/api/players \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Player:**

```bash
curl -X POST http://localhost:5000/api/players \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Player",
    "playingPosition": "Forward",
    "playerId": "PLR-999",
    "dateOfBirth": "2000-01-01",
    "gender": "Male",
    "mobileNumber": "+1234567890",
    "email": "test@example.com"
  }'
```

### Database Management

**View all admins:**

```bash
mongosh
use protalent
db.admins.find().pretty()
```

**View all players:**

```bash
db.players.find().pretty()
```

**Reset database:**

```bash
db.dropDatabase()
```

Then re-run the seed script:

```bash
node services/seedSuperAdmin.js
```

### Adding New Features

1. **Create Model** (if needed) in `Models/`
2. **Create Controller** in `services/`
3. **Create Routes** in `Routes/`
4. **Mount Routes** in `server.js`
5. **Test** with Postman or cURL

### Security Best Practices

✅ Always use HTTPS in production  
✅ Keep `JWT_SECRET` secure and random (min 32 characters)  
✅ Never commit `.env` file to git  
✅ Use strong passwords for Super Admin  
✅ Regularly update dependencies (`npm audit fix`)  
✅ Validate all user inputs  
✅ Use rate limiting for production  
✅ Enable MongoDB authentication  
✅ Whitelist IP addresses in MongoDB Atlas

### Performance Tips

- Use indexes on frequently queried fields (email, playerId)
- Implement caching for dashboard stats
- Use pagination for large datasets
- Optimize MongoDB queries with projections
- Enable compression in production

---

## Quick Reference

### Start Server

```bash
npm run dev        # Development with auto-reload
npm start          # Production
```

### Seed Super Admin

```bash
node services/seedSuperAdmin.js
```

### Default Super Admin

- **Email:** `superadmin@protalent.com`
- **Password:** `SuperAdmin@123`

### Base URL

```
http://localhost:5000/api
```

### Routes

```
POST   /api/auth/login              # Public
POST   /api/auth/register           # Super Admin
GET    /api/auth/profile            # Auth
PUT    /api/auth/change-password    # Auth

GET    /api/dashboard/stats         # Admin+

POST   /api/players                 # Super Admin
GET    /api/players                 # Admin+
GET    /api/players/:id             # Admin+
PUT    /api/players/:id             # Admin+
DELETE /api/players/:id             # Admin+
```

Auth: Authenticated users  
Admin+: Admin and Super Admin  
Super Admin: Super Admin only

---

## Support & Contributing

### Issues

If you encounter any issues, please check:

1. MongoDB connection string is correct
2. `.env` file exists with all required variables
3. Dependencies are installed (`npm install`)
4. Super Admin is seeded
5. Port 5000 is not in use

### Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

This project is part of Pro-Talent-Connect platform.

---

**Built with ❤️ using Node.js, Express, and MongoDB**

For questions or support, please contact the development team.
