# Pro-Talent-Connect Backend API

<div align="center">

**Professional Football Talent Management API**  
RESTful Backend • JWT Authentication • Role-Based Access Control • Comprehensive Audit Logging

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)](https://jwt.io/)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Security & Non-Functional Requirements](#security--non-functional-requirements)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## About

**Pro-Talent-Connect Backend API** is a comprehensive RESTful API for managing football/soccer talent, providing secure authentication, role-based access control, player management, blog/article publishing, and comprehensive audit logging for compliance and security.

### Key Highlights

- JWT-based authentication with bcrypt password hashing
- Role-based access control (Super Admin / Admin)
- Complete CRUD operations for players, blogs, and admin accounts
- Comprehensive audit logging for all critical operations
- RESTful API design with extensive documentation
- Cloud database with MongoDB Atlas
- CORS security with environment-based origin restrictions
- Singleton pattern for organization profile management

---

## Features

### Authentication & Authorization System

- **JWT Authentication** - Token-based auth with 7-day expiry
- **Two Roles** - Super Admin (full access) and Admin (restricted access)
- **Password Security** - bcrypt hashing with 10 salt rounds
- **Protected Routes** - Middleware verification on all sensitive endpoints
- **Token Refresh** - Extended sessions with token refresh mechanism
- **Account Management** - Active/inactive status, last login tracking

### Player Management

- Complete CRUD operations for player profiles
- Soft delete functionality (isDeleted flag)
- Advanced filtering (name, position, gender, age group, city)
- Multi-criteria search functionality
- Pagination support for large datasets
- Profile images and detailed attributes
- Career history and scouting notes

### Blog & Articles Management

- Create, update, and publish blog posts
- Draft/Published/Archived status workflow
- Slug-based URL friendly identifiers
- Rich text content support (HTML)
- Cover images and tagging system
- Author tracking and attribution
- Public access for published content

### About / Organisation Profile

- Singleton document pattern
- Mission, history, credentials management
- Contact information and social links
- Image gallery for organization
- Public access endpoint

### Admin Management (Super Admin Only)

- Create and manage admin accounts
- Role promotion/demotion
- Account activation/deactivation
- Password reset functionality
- Self-protection (cannot modify own account)
- Last Super Admin protection

### Audit Logging System

- Automatic logging of all CUD operations
- Login/logout tracking with IP and user agent
- Password change and role change audit trail
- Failed login attempts recorded
- Comprehensive filtering and search
- Super Admin only access

### Security Features

- CORS with environment-based origin restrictions
- JWT token validation on protected routes
- Password complexity requirements
- Non-blocking audit logging
- Appropriate HTTP status codes

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 5.x | Web framework |
| MongoDB Atlas | Latest | Cloud database |
| Mongoose | 9.x | MongoDB ODM |
| JWT | 9.x | Authentication |
| Bcrypt | 6.x | Password hashing |
| CORS | 2.x | Cross-origin requests |
| Dotenv | 17.x | Environment variables |
| Nodemon | 3.x | Development auto-reload |
| Jest | Latest | Testing framework |
| Supertest | Latest | API testing |

---

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm 7.x or higher
- MongoDB Atlas account
- Git

### Setup Instructions

**1. Clone Repository**

```bash
git clone <repository-url>
cd Pro-Talent-Connect/Backend
```

**2. Install Dependencies**

```bash
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the `Backend` folder:

```env
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/protalent?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS Configuration (comma-separated list of allowed origins)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Default Super Admin (used by seedSuperAdmin.js)
SUPER_ADMIN_EMAIL=charannaikcharan734@gmail.com
SUPER_ADMIN_PASSWORD=YourSecurePassword@123
```

**MongoDB Atlas Setup:**

1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Database Access → Create user with read/write permissions
3. Network Access → Add IP (0.0.0.0/0 for development)
4. Connect → Connect your application → Copy connection string
5. Replace `<username>`, `<password>`, and database name in MONGO_URI

**Generate JWT Secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
```

**4. Seed Super Admin (First Time Only)**

```bash
cd services
node seedSuperAdmin.js
```

**5. Start Development Server**

```bash
npm run dev
```

Server runs at `http://localhost:5001`

**6. Verify Installation**

```bash
curl http://localhost:5001/
```

Expected response:

```json
{
  "message": "Pro-Talent-Connect API is running!",
  "status": "ok"
}
```

---

## API Documentation

### Base URL

```
http://localhost:5001/api
```

### User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **Super Admin** | Full system access | Full CRUD on all resources, admin management, delete access |
| **Admin** | Operational access | Create, Read, Update only (no delete, no admin management) |

### Quick Reference

| Module | Endpoints | Super Admin | Admin | Public |
|--------|-----------|-------------|-------|--------|
| Authentication | 7 endpoints | ✅ | ✅ | login only |
| Admin Management | 6 endpoints | ✅ | ❌ | ❌ |
| Player Management | 6 endpoints | ✅ Full | ✅ CRU only | ❌ |
| Blog Management | 7 endpoints | ✅ Full | ✅ CRU only | published only |
| About/Organisation | 3 endpoints | ✅ | ❌ | view only |
| Dashboard | 1 endpoint | ✅ | ✅ | ❌ |
| Audit Logs | 1 endpoint | ✅ | ❌ | ❌ |

---

### Authentication APIs

All authentication endpoints are prefixed with `/api/auth`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | Admin login | Public |
| POST | `/api/auth/logout` | Admin logout | Protected |
| POST | `/api/auth/register` | Register new admin | Super Admin |
| POST | `/api/auth/refresh` | Refresh JWT token | Protected |
| GET | `/api/auth/profile` | Get current admin profile | Protected |
| PUT | `/api/auth/change-password` | Change password | Protected |
| PUT | `/api/auth/admin/:id/role` | Update admin role | Super Admin |

#### Example: Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "charannaikcharan734@gmail.com",
  "password": "YourPassword@123"
}
```

**Response (200):**

```json
{
  "_id": "65f9abc1234567890abcdef1",
  "name": "Admin Name",
  "email": "charannaikcharan734@gmail.com",
  "role": "Super Admin",
  "profile_image": "",
  "is_active": true,
  "last_login": "2026-02-17T10:30:00.000Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Authentication Headers

For all protected endpoints:

```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

### Admin Management APIs

All admin management endpoints are prefixed with `/api/admins` and require **Super Admin** access.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admins` | List all admins (with pagination & filters) |
| POST | `/api/admins` | Create new admin account |
| GET | `/api/admins/:id` | Get admin by ID |
| PUT | `/api/admins/:id` | Update admin details |
| PATCH | `/api/admins/:id/demote` | Demote admin / deactivate |
| DELETE | `/api/admins/:id` | Delete admin account |

**Key Features:**
- Self-protection: Cannot modify your own account
- Last Super Admin protection: Cannot demote/delete last Super Admin
- Role management: Promote/demote between Admin and Super Admin
- Account deactivation: `is_active` flag prevents login

---

### Player Management APIs

All player endpoints are prefixed with `/api/players`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/players` | List all players (with pagination & filters) | Admin + Super Admin |
| POST | `/api/players` | Create new player | Admin + Super Admin |
| GET | `/api/players/search` | Search players by multiple criteria | Admin + Super Admin |
| GET | `/api/players/:id` | Get player by ID | Admin + Super Admin |
| PUT | `/api/players/:id` | Update player | Admin + Super Admin |
| DELETE | `/api/players/:id` | Delete player (soft delete) | Super Admin Only |

**Player Schema Fields:**
- name, age, age_group, playingPosition, alternativePosition
- preferredFoot, transferMarketLink, playerId, dateOfBirth
- nationality, weight, height, gender, jersey_no, size
- city, address, mobileNumber, email, profileImage
- scouting_notes, career_history, media_links, clubsPlayed

**Query Parameters:**
- `page`, `limit` - Pagination
- `name`, `city`, `position`, `age_group`, `gender` - Filters

---

### Blog Management APIs

All blog endpoints are prefixed with `/api/blogs`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/blogs` | List published blogs | Public |
| GET | `/api/blogs/all` | List all blogs (including drafts) | Admin + Super Admin |
| POST | `/api/blogs` | Create new blog | Admin + Super Admin |
| GET | `/api/blogs/:id` | Get blog by ID or slug | Public |
| PUT | `/api/blogs/:id` | Update blog | Admin + Super Admin |
| PATCH | `/api/blogs/:id/publish` | Publish blog | Admin + Super Admin |
| DELETE | `/api/blogs/:id` | Delete blog (soft delete) | Super Admin Only |

**Blog Schema:**
- title, slug, content, excerpt, cover_image
- tags (array), status (DRAFT/PUBLISHED/ARCHIVED)
- author_id, published_at, createdAt, updatedAt

---

### About / Organisation APIs

All about endpoints are prefixed with `/api/about`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/about` | Get organisation profile | Public |
| PUT | `/api/about` | Update organisation profile | Super Admin |
| POST | `/api/about/images` | Add images to gallery | Super Admin |

**Singleton Pattern:** Only one organization profile document exists.

---

### Dashboard APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Admin + Super Admin |

**Returns:**
- Total players, admins, super admins count
- Recent players (last 30 days)
- Players by position and gender distribution

---

### Audit Log APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/audit-logs` | Get audit logs with filtering | Super Admin Only |

**Query Parameters:**
- `page`, `limit` - Pagination (default: 50 per page)
- `user_id` - Filter by user
- `action` - Filter by action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
- `resource_type` - Filter by resource (Admin, Player, Blog, About, Auth)
- `resource_id` - Filter by specific resource
- `start_date`, `end_date` - Date range filter

**Audit Log Fields:**
- user details (ID, name, email, role)
- action, resource_type, resource_id
- description, ip_address, user_agent
- changes (object), status (SUCCESS/FAILURE)
- createdAt (timestamp)

---

## Security & Non-Functional Requirements

### 1. Authentication & Authorization

#### JWT Token-Based Authentication
- **Token Generation**: JWT tokens generated upon successful login
- **Token Expiry**: Default 7 days (configurable via `JWT_EXPIRE`)
- **Token Structure**: Contains user ID and role for authorization
- **Token Storage**: Client-side storage (localStorage/sessionStorage)

#### Role-Based Access Control (RBAC)
- **Middleware**: `protect` middleware verifies JWT on protected routes
- **Authorization**: `authorize(...roles)` middleware restricts by role
- **Granular Permissions**:
  - Super Admin: Full CRUD + delete access on all resources
  - Admin: Create, Read, Update only (no delete, no admin management)

### 2. Password Security

- **Hashing Algorithm**: bcryptjs with 10 salt rounds
- **Pre-Save Hook**: Passwords automatically hashed before saving
- **Password Validation**: Custom `matchPassword()` method compares hashed passwords
- **Password Change**: Requires current password verification
- **Secure Storage**: Plain-text passwords never stored

### 3. CORS (Cross-Origin Resource Sharing)

**Configuration**: Environment-based origin restrictions

```javascript
// app.js
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
corsOptions: {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}
```

**Environment Variable:**
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourfrontend.com
```

### 4. Data Validation & Sanitization

- Required field validation
- Unique constraints on emails, player IDs, blog slugs
- Mongoose schema-level validation
- Comprehensive error responses

### 5. Audit Logging & Compliance

**Comprehensive Action Tracking:**
- All CREATE, UPDATE, DELETE operations logged automatically
- User authentication events (LOGIN, LOGOUT) tracked
- Sensitive operations (PASSWORD_CHANGE, ROLE_CHANGE) audited
- Failed login attempts recorded for security monitoring

**Log Details:**
- User identification (ID, name, email, role)
- Timestamp (ISO-8601 format)
- IP address and user agent
- Resource affected (type and ID)
- Changes made (before/after values)
- Operation status (SUCCESS/FAILURE)

**Access**: Super Admin only via `GET /api/audit-logs`

### 6. HTTPS/TLS Requirements

**Production Deployment:**
- ✅ **HTTPS Required**: All production traffic must use TLS encryption
- ✅ **Certificate Management**: Use Let's Encrypt, AWS Certificate Manager, or platform SSL
- ✅ **HSTS Recommended**: HTTP Strict Transport Security header
- ⚠️ **Development**: HTTP acceptable for localhost only

### 7. Performance & Scalability

**Database Optimization:**
- Indexed fields: `email`, `playerId`, `slug`, `user_id`, `createdAt`
- Pagination on all list endpoints
- Soft deletes with `isDeleted` flag
- Lean queries exclude unnecessary fields

**Capacity:**
- Target: 60-100 concurrent users
- Recommended: Horizontal scaling with load balancing for >100 users
- Database: MongoDB Atlas M10+ cluster for production

### 8. Backup & Recovery

**Recommended Strategy:**
- **MongoDB Atlas**: Automated daily backups with point-in-time recovery
- **Self-Hosted**: `mongodump` scheduled via cron jobs
- **Retention**: Minimum 7-day backup retention
- **Disaster Recovery**: Test restore procedures quarterly

**Backup Command:**
```bash
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

### 9. Error Handling & Logging

- Console logging of all errors with context
- User-friendly error messages
- Appropriate HTTP status codes (400, 401, 403, 404, 500)
- Non-blocking audit logging

### 10. Environment Configuration

**Required Variables** (see `.env.example`):
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing (use strong random string)
- `JWT_EXPIRE` - Token expiry duration
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `SUPER_ADMIN_EMAIL` - Default super admin email
- `SUPER_ADMIN_PASSWORD` - Default super admin password

**Security Best Practices:**
- Never commit `.env` to version control
- Use environment-specific `.env` files
- Rotate secrets regularly in production
- Use secret management services (AWS Secrets Manager, Azure Key Vault)

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Generate HTML report
npm run report
```

### Test Coverage

| Test Suite | Tests | Status |
|------------|-------|--------|
| Authentication API | 11 | ✅ Pass |
| Dashboard API | 5 | ✅ Pass |
| Player API | 15 | ✅ Pass |
| **Total** | **31** | **✅ 100%** |

### Test Categories

- **Model Tests**: Schema validation, UUID generation, password hashing
- **API Tests**: CRUD operations, authentication, authorization
- **Integration Tests**: End-to-end workflows

**View HTML Report:**
After running `npm run report`, open `test-report.html` in your browser.

---

## Deployment

### Environment Configuration for Production

```env
NODE_ENV=production
PORT=5001
MONGO_URI=<production_mongodb_uri>
JWT_SECRET=<strong_64_character_secret>
JWT_EXPIRE=7d
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PASSWORD=<strong_password>
```

### Deployment Checklist

- [x] Set NODE_ENV=production
- [x] Use strong JWT secret (64+ characters)
- [ ] Configure MongoDB Atlas IP whitelist for production
- [ ] Set up automated database backups
- [ ] Configure CORS for production frontend domain
- [x] Enable audit logging
- [ ] Set up error monitoring (Sentry/LogRocket)
- [ ] Configure CDN for static assets
- [ ] Set up CI/CD pipeline
- [ ] Configure SSL/TLS certificates

### Recommended Platforms

- **Backend**: Heroku, AWS EC2, DigitalOcean, Render, Railway
- **Database**: MongoDB Atlas (M10+ cluster for production)
- **Monitoring**: Datadog, New Relic, AWS CloudWatch

---

## Project Structure

```
Backend/
├── config/
│   └── DB.js                    # MongoDB connection
├── Middleware/
│   ├── authMiddleware.js        # JWT verification & RBAC
│   └── auditLogger.js           # Audit logging utilities
├── Models/
│   ├── About.js                 # Organization profile schema
│   ├── Admin.js                 # Admin user schema
│   ├── AuditLog.js              # Audit trail schema
│   ├── Blog.js                  # Blog/article schema
│   └── Players.js               # Player profile schema
├── Routes/
│   ├── aboutRoutes.js           # Organization endpoints
│   ├── adminRoutes.js           # Admin management
│   ├── auditLogRoutes.js        # Audit log endpoints
│   ├── authRoutes.js            # Authentication
│   ├── blogRoutes.js            # Blog/article endpoints
│   ├── dashboardRoutes.js       # Dashboard statistics
│   └── playerRoutes.js          # Player CRUD
├── services/
│   ├── aboutController.js       # Organization business logic
│   ├── adminController.js       # Admin management logic
│   ├── auditLogController.js    # Audit log queries
│   ├── authController.js        # Authentication logic
│   ├── blogController.js        # Blog management logic
│   ├── dashboardController.js   # Dashboard calculations
│   ├── generateToken.js         # JWT token generation
│   ├── playerController.js      # Player management logic
│   └── seedSuperAdmin.js        # Initial setup
├── tests/
│   ├── auth.test.js             # Authentication tests
│   ├── dashboard.test.js        # Dashboard tests
│   ├── players.test.js          # Player CRUD tests
│   └── setup.js                 # Test configuration
├── .env.example                 # Environment template
├── app.js                       # Express app configuration
├── jest.config.js               # Jest configuration
├── package.json                 # Dependencies
├── README.md                    # This file
└── server.js                    # Server entry point
```

---

## API Testing with Postman/Thunder Client

1. **Login** first to get the JWT token
2. **Save the token** as an environment variable
3. **Add token** to Authorization header for protected routes

Example Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## License

This project is proprietary and confidential.

---

## Support

For support, email: charannaikcharan734@gmail.com

---

**Version**: 3.0.0  
**Last Updated**: February 17, 2026  
**Status**: Production Ready - Backend Complete with Comprehensive Security & Audit Logging

Made with ⚽ for sports talent management worldwide

[Back to Top](#pro-talent-connect-backend-api)
