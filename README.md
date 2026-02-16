# Pro-Talent-Connect

## 1. Project Overview
Pro-Talent-Connect is a recruitment and management platform for athletes and sports talent. It features an Express-based REST API for managing player profiles, administrative access, and dashboard statistics. The project uses MongoDB with Mongoose for data persistence and JWT for secure authentication.

## 2. Testing Strategy
Our testing strategy focuses on high-coverage unit and integration tests for the backend API.
- **Framework**: [Jest](https://jestjs.io/)
- **Integration Library**: [Supertest](https://github.com/ladjs/supertest)
- **Database**: [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) for isolated, fast, and deterministic tests.
- **CI/CD**: GitHub Actions for automated testing on every push and pull request.

## 3. Unit Testing Scenarios

### Auth API (`tests/auth.test.js`)
- **POST /api/auth/register**:
  - *Happy Path*: Super Admin can register new Admins.
  - *Invalid Input*: Registration fails without name, email, or password.
  - *Unauthorized*: Registration fails without a valid token.
  - *Edge Case*: Regular Admins cannot register other admins (403 Forbidden).
- **POST /api/auth/login**:
  - *Happy Path*: Successful login with valid credentials returns a JWT.
  - *Invalid Input*: Fails with incorrect email or password.

### Players API (`tests/players.test.js`)
- **POST /api/players**:
  - *Happy Path*: Super Admin can create player profiles (including `profileImage`).
  - *Edge Case*: Fails if `playerId` or `email` already exists.
  - *Boundary Conditions*: Fails if required fields (name, position, DOB) are missing.
  - *Unauthorized*: Regular Admins are restricted from creating players.
- **GET /api/players**:
  - *Happy Path*: Authenticated admins can retrieve a paginated list of players.
  - *Edge Case*: Soft-deleted players are excluded from the list.
- **PUT /api/players/:id**:
  - *Happy Path*: Admins can update player details, including their `profileImage`.

### Dashboard API (`tests/dashboard.test.js`)
- **GET /api/dashboard/stats**:
  - *Happy Path*: Returns correct counts for total players, active players, and admins.

## 4. Debugging Summary

| Bug Found | Fix Applied |
|-----------|-------------|
| `Admin` model `pre-save` hook was calling `next()` in an `async` function. | Removed `next()` and used `return` or implicit promise resolution for Mongoose middleware compatibility. |
| `createPlayer` controller did not handle MongoDB duplicate key errors (11000). | Added a `try-catch` block handling `error.code === 11000` to return a 400 status instead of 500. |
| `server.js` was directly listening, making it hard to test with Supertest. | Refactored app logic into `app.js` and exported it, keeping `server.js` as the entry point. |
| Missing `JWT_SECRET` in test environment. | Configured `tests/setup.js` to initialize environment variables for the test runner. |
| Players missing image field. | Added `profileImage` to `Players` model and updated controller/tests. |

## 5. Test Execution

### Automated (CI)
Tests run automatically on GitHub Actions for every push to `main`.
- See [.github/workflows/ci.yml](.github/workflows/ci.yml)

### Locally
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run all tests:
   ```bash
   npm test
   ```
4. Generate HTML report:
   ```bash
   npm run report
   ```
   *View the report at `Backend/test-report.html`.*

## 6. Test Results Summary (Local Run)
- **Total Tests**: 11
- **Passed**: 11
- **Failed**: 0
- **Testing Score**: 100%
- **Status**: PASS

