# Pro-Talent-Connect — Backend API Documentation

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Role-Based Access Control](#role-based-access-control)
- [Authentication](#authentication)
- [Auth API](#auth-api)
  - [Login](#1-login)
  - [Register Admin](#2-register-admin)
  - [Get Profile](#3-get-profile)
  - [Change Password](#4-change-password)
- [Dashboard API](#dashboard-api)
  - [Get Stats](#1-get-stats)
- [Players API](#players-api)
  - [Create Player](#1-create-player)
  - [Get All Players](#2-get-all-players)
  - [Get Player by ID](#3-get-player-by-id)
  - [Update Player](#4-update-player)
  - [Delete Player](#5-delete-player)
- [Data Models](#data-models)
- [Error Responses](#error-responses)

---

## Getting Started

### 1. Install dependencies

```bash
cd Backend
npm install
```

### 2. Configure `.env`

Create a `.env` file in the `Backend/` folder (see [Environment Variables](#environment-variables)).

### 3. Seed the first Super Admin

```bash
node services/seedSuperAdmin.js
```

This creates a Super Admin with:

| Field    | Value                      |
| -------- | -------------------------- |
| Email    | `superadmin@protalent.com` |
| Password | `SuperAdmin@123`           |
| Role     | `Super Admin`              |

> Change the password after first login.

### 4. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000` by default.

---

## Environment Variables

| Variable     | Description                 | Example                              |
| ------------ | --------------------------- | ------------------------------------ |
| `MONGO_URI`  | MongoDB connection string   | `mongodb+srv://user:pass@cluster...` |
| `PORT`       | Server port                 | `5000`                               |
| `JWT_SECRET` | Secret key for signing JWTs | (64-byte hex string)                 |

---

## Role-Based Access Control

There are **two roles**:

| Role            | Create Player | Read Player | Update Player | Delete Player | Register Admin |
| --------------- | :-----------: | :---------: | :-----------: | :-----------: | :------------: |
| **Super Admin** |      ✅       |     ✅      |      ✅       |      ✅       |       ✅       |
| **Admin**       |      ❌       |     ✅      |      ✅       |      ✅       |       ❌       |

- **Super Admin** has complete access to everything (create, read, update, delete players + register new admins).
- **Admin** can read, update, and delete players only. Cannot create players or register new admins.

---

## Authentication

All protected endpoints require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

You get the token from the [Login](#1-login) endpoint. The token is valid for **7 days**.

---

## Auth API

Base URL: `/api/auth`

---

### 1. Login

Authenticate an admin and receive a JWT token.

- **URL:** `POST /api/auth/login`
- **Access:** Public

**Request Body:**

```json
{
  "email": "charannaikcharan734@gmail.com",
  "password": "123456"
}
```

| Field      | Type   | Required | Description    |
| ---------- | ------ | :------: | -------------- |
| `email`    | String |   Yes    | Admin email    |
| `password` | String |   Yes    | Admin password |

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

| Status | Message                           |
| ------ | --------------------------------- |
| 400    | Please provide email and password |
| 401    | Invalid email or password         |

---

### 2. Register Admin

Create a new Admin or Super Admin account.

- **URL:** `POST /api/auth/register`
- **Access:** **Super Admin only** (requires Bearer token)

**Headers:**

```
Authorization: Bearer <super_admin_token>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@protalent.com",
  "password": "John@1234",
  "role": "Admin"
}
```

| Field      | Type   | Required | Description                                       |
| ---------- | ------ | :------: | ------------------------------------------------- |
| `name`     | String |   Yes    | Admin name                                        |
| `email`    | String |   Yes    | Admin email (must be unique)                      |
| `password` | String |   Yes    | Admin password                                    |
| `role`     | String |    No    | `"Admin"` or `"Super Admin"` (default: `"Admin"`) |

**Success Response:** `201 Created`

```json
{
  "_id": "65a1b2c3d4e5f6a7b8c9d0e2",
  "name": "John Doe",
  "email": "john@protalent.com",
  "role": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Message                                  |
| ------ | ---------------------------------------- |
| 400    | Please provide name, email, and password |
| 400    | Admin with this email already exists     |
| 401    | Not authorized, no token                 |
| 403    | Role 'Admin' is not authorized...        |

---

### 3. Get Profile

Get the currently logged-in admin's profile.

- **URL:** `GET /api/auth/profile`
- **Access:** Any authenticated admin

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
  "createdAt": "2026-02-14T10:00:00.000Z",
  "updatedAt": "2026-02-14T10:00:00.000Z"
}
```

---

### 4. Change Password

Update the password for the current admin.

- **URL:** `PUT /api/auth/change-password`
- **Access:** Any authenticated admin

**Request Body:**

```json
{
  "oldPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**Success Response:** `200 OK`

```json
{
  "message": "Password changed successfully"
}
```

---

## Dashboard API

Base URL: `/api/dashboard`

---

### 1. Get Stats

Retrieve summary statistics for the dashboard.

- **URL:** `GET /api/dashboard/stats`
- **Access:** Admin & Super Admin

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response:** `200 OK`

```json
{
  "totalPlayers": 50,
  "totalAdmins": 5,
  "activePlayers": 45,
  "deletedPlayers": 5
}
```

---

## Players API

Base URL: `/api/players`

> All player endpoints require authentication (Bearer token).

---

### 1. Create Player

Add a new player to the database.

- **URL:** `POST /api/players`
- **Access:** **Super Admin only**

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

| Field                    | Type   | Required | Description                                  |
| ------------------------ | ------ | :------: | -------------------------------------------- |
| `name`                   | String |   Yes    | Player's full name                           |
| `playingPosition`        | String |   Yes    | Primary position (e.g., Forward, Midfielder) |
| `alternativePosition`    | String |    No    | Secondary position                           |
| `preferredFoot`          | String |    No    | `"Left"`, `"Right"`, or `"Both"`             |
| `transferMarketLink`     | String |    No    | Link to TransferMarkt profile                |
| `playerId`               | String |   Yes    | Unique player identifier (e.g., PLR-001)     |
| `dateOfBirth`            | Date   |   Yes    | Format: `YYYY-MM-DD`                         |
| `weight`                 | Number |    No    | Weight in kilograms                          |
| `height`                 | Number |    No    | Height in centimeters                        |
| `gender`                 | String |   Yes    | `"Male"`, `"Female"`, or `"Other"`           |
| `mobileNumber`           | String |   Yes    | Contact number                               |
| `email`                  | String |   Yes    | Player email (must be unique)                |
| `clubsPlayed`            | Array  |    No    | Array of club objects                        |
| `clubsPlayed[].clubName` | String |    No    | Name of the club                             |
| `clubsPlayed[].duration` | String |    No    | Duration played (e.g., "2020-2023")          |

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
  "createdAt": "2026-02-14T10:30:00.000Z",
  "updatedAt": "2026-02-14T10:30:00.000Z"
}
```

**Error Responses:**

| Status | Message                                           |
| ------ | ------------------------------------------------- |
| 400    | Please provide all required fields                |
| 400    | Player with this playerId or email already exists |
| 401    | Not authorized, no token                          |
| 403    | Role 'Admin' is not authorized...                 |

---

### 2. Get All Players

Retrieve a paginated list of players with optional search filters.

- **URL:** `GET /api/players`
- **Access:** Admin & Super Admin

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter         | Type   | Default | Description                                |
| ----------------- | ------ | ------- | ------------------------------------------ |
| `page`            | Number | 1       | Page number                                |
| `limit`           | Number | 10      | Results per page                           |
| `name`            | String | —       | Filter by name (case-insensitive search)   |
| `playingPosition` | String | —       | Filter by position (case-insensitive)      |
| `gender`          | String | —       | Filter by gender (`Male`/`Female`/`Other`) |
| `preferredFoot`   | String | —       | Filter by foot (`Left`/`Right`/`Both`)     |

**Example Requests:**

```
GET /api/players
GET /api/players?page=2&limit=5
GET /api/players?name=messi
GET /api/players?playingPosition=Forward&gender=Male
GET /api/players?preferredFoot=Left&page=1&limit=20
```

**Success Response:** `200 OK`

```json
{
  "players": [...],
  "currentPage": 1,
  "totalPages": 1,
  "totalResults": 1,
  "hasNextPage": false,
  "hasPrevPage": false
}
```

---

### 3. Get Player by ID

Retrieve a single player by their MongoDB `_id`.

- **URL:** `GET /api/players/:id`
- **Access:** Admin & Super Admin

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
  "clubsPlayed": [
    { "clubName": "FC Barcelona", "duration": "2004-2021" },
    { "clubName": "Paris Saint-Germain", "duration": "2021-2023" },
    { "clubName": "Inter Miami", "duration": "2023-Present" }
  ],
  "createdAt": "2026-02-14T10:30:00.000Z",
  "updatedAt": "2026-02-14T10:30:00.000Z"
}
```

**Error Response:**

| Status | Message          |
| ------ | ---------------- |
| 404    | Player not found |

---

### 4. Update Player

Update an existing player's details. Only send the fields you want to change.

- **URL:** `PUT /api/players/:id`
- **Access:** Admin & Super Admin

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Example — Update weight and add a new club:**

```
PUT /api/players/65a1b2c3d4e5f6a7b8c9d0e3
```

```json
{
  "weight": 73,
  "clubsPlayed": [
    { "clubName": "FC Barcelona", "duration": "2004-2021" },
    { "clubName": "Paris Saint-Germain", "duration": "2021-2023" },
    { "clubName": "Inter Miami", "duration": "2023-2026" },
    { "clubName": "New Club FC", "duration": "2026-Present" }
  ]
}
```

**Example — Update position:**

```json
{
  "playingPosition": "Attacking Midfielder",
  "alternativePosition": "Right Winger"
}
```

**Success Response:** `200 OK` — Returns the full updated player object.

**Error Responses:**

| Status | Message                     |
| ------ | --------------------------- |
| 400    | Duplicate playerId or email |
| 404    | Player not found            |

---

### 5. Delete Player

Remove a player from the database.

- **URL:** `DELETE /api/players/:id`
- **Access:** Admin & Super Admin

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

| Status | Message          |
| ------ | ---------------- |
| 404    | Player not found |

---

## Data Models

### Admin Model

```
{
  name:       String   (required)
  email:      String   (required, unique, lowercase)
  password:   String   (required, auto-hashed with bcrypt)
  role:       String   (enum: "Admin" | "Super Admin", default: "Admin")
  createdAt:  Date     (auto)
  updatedAt:  Date     (auto)
}
```

### Player Model

```
{
  name:               String   (required)
  playingPosition:    String   (required)
  alternativePosition:String
  preferredFoot:      String   (enum: "Left" | "Right" | "Both")
  transferMarketLink: String
  playerId:           String   (required, unique)
  dateOfBirth:        Date     (required)
  weight:             Number   (in kg)
  height:             Number   (in cm)
  gender:             String   (required, enum: "Male" | "Female" | "Other")
  mobileNumber:       String   (required)
  email:              String   (required, unique, lowercase)
  clubsPlayed:        Array    [{ clubName: String, duration: String }]
  createdBy:          ObjectId (ref: "Admin")
  updatedBy:          ObjectId (ref: "Admin")
  isDeleted:          Boolean  (default: false)
  createdAt:          Date     (auto)
  updatedAt:          Date     (auto)
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description here"
}
```

### Common HTTP Status Codes

| Status | Meaning                                      |
| ------ | -------------------------------------------- |
| 200    | Success                                      |
| 201    | Created successfully                         |
| 400    | Bad request (missing fields, duplicates)     |
| 401    | Unauthorized (no token or invalid token)     |
| 403    | Forbidden (role not allowed for this action) |
| 404    | Resource not found                           |
| 500    | Internal server error                        |

---

## Quick Start — Step-by-Step

### Step 1: Seed Super Admin

```bash
cd Backend
node services/seedSuperAdmin.js
```

### Step 2: Start Server

```bash
npm run dev
```

### Step 3: Login as Super Admin

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "superadmin@protalent.com",
  "password": "SuperAdmin@123"
}
```

Copy the `token` from the response.

### Step 4: Register a new Admin (Super Admin only)

```
POST http://localhost:5000/api/auth/register
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
  "name": "Manager One",
  "email": "manager@protalent.com",
  "password": "Manager@123",
  "role": "Admin"
}
```

### Step 5: Add a Player (Super Admin only)

```
POST http://localhost:5000/api/players
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
  "name": "Cristiano Ronaldo",
  "playingPosition": "Forward",
  "alternativePosition": "Left Winger",
  "preferredFoot": "Right",
  "playerId": "PLR-002",
  "dateOfBirth": "1985-02-05",
  "weight": 85,
  "height": 187,
  "gender": "Male",
  "mobileNumber": "+9876543210",
  "email": "ronaldo@example.com",
  "clubsPlayed": [
    { "clubName": "Manchester United", "duration": "2003-2009" },
    { "clubName": "Real Madrid", "duration": "2009-2018" },
    { "clubName": "Juventus", "duration": "2018-2021" }
  ]
}
```

### Step 6: View All Players (Admin or Super Admin)

```
GET http://localhost:5000/api/players
Authorization: Bearer <token>
```

### Step 7: Update a Player (Admin or Super Admin)

```
PUT http://localhost:5000/api/players/<player_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "weight": 83,
  "playingPosition": "Striker"
}
```

### Step 8: Delete a Player (Admin or Super Admin)

```
DELETE http://localhost:5000/api/players/<player_id>
Authorization: Bearer <token>
```

---

## Project Structure

```
Backend/
├── config/
│   └── DB.js                  # MongoDB connection
├── Middleware/
│   └── authMiddleware.js      # JWT verify + role authorization
├── Models/
│   ├── Admin.js               # Admin schema (with bcrypt)
│   └── Players.js             # Player schema
├── Routes/
│   ├── authRoutes.js          # /api/auth endpoints
│   ├── playerRoutes.js        # /api/players endpoints
│   └── dashboardRoutes.js     # /api/dashboard endpoints
├── services/
│   ├── authController.js      # Login, Register, Profile logic
│   ├── playerController.js    # CRUD for Players
│   ├── dashboardController.js # Dashboard stats logic
│   ├── generateToken.js       # JWT token generator
│   └── seedSuperAdmin.js      # One-time Super Admin seed script
├── .env                       # Environment variables
├── package.json
├── server.js                  # Express app entry point
└── README.md                  # This file
```
