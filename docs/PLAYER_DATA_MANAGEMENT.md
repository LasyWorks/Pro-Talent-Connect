# Player Data Management Guide

## Overview
This guide explains how to add player data to the Pro-Talent-Connect database.

## Database Schema
The Player model supports the following fields:
- Basic Info: name, age, age_group, dateOfBirth, nationality, gender
- Position: playingPosition, alternativePosition, preferredFoot
- Physical: height, weight, jersey_no, size
- Contact: email, mobileNumber, city, address
- Profile: profileImage, scouting_notes, career_history, media_links
- IDs: playerId, plId
- Performance: competitions[], stateLeague, clubTier, sprint30m, sprint50m, mentalityScore
- History: clubsPlayed[]
- Computed: scoutReport (auto-calculated)

## Method 1: Direct Database Insert (Recommended for Bulk Import)

Use the `insertPlayers.js` script for direct database insertion:

```bash
# Navigate to Backend directory
cd Backend

# Run the insert script
node services/insertPlayers.js
```

**To add new players:**
1. Open `Backend/services/insertPlayers.js`
2. Add your player objects to the `playersToInsert` array
3. Run the script

**Features:**
- Automatically calculates scout reports
- Checks for duplicate emails and playerIds
- No authentication required
- Direct database access

## Method 2: POST API Endpoint (Recommended for Single Player)

Use the REST API endpoint for authenticated player creation:

**Endpoint:** `POST /api/players`

**Authentication:** Required (Admin or Super Admin token)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

**Request Body Example:**
```json
{
  "name": "PLAYER NAME",
  "age": 22,
  "age_group": "Senior",
  "playingPosition": "DEFENDER",
  "alternativePosition": "",
  "preferredFoot": "Right",
  "transferMarketLink": "",
  "playerId": "PL0000123456",
  "dateOfBirth": "2003-09-13T00:00:00.000Z",
  "nationality": "Indian",
  "weight": 61,
  "height": 172,
  "gender": "Male",
  "jersey_no": 0,
  "size": "M",
  "city": "City Name",
  "address": "Full Address",
  "mobileNumber": "1234567890",
  "email": "player@example.com",
  "profileImage": "",
  "scouting_notes": "",
  "career_history": "",
  "media_links": [],
  "plId": "PL0000123456",
  "competitions": [
    {
      "name": "Tournament Name",
      "type": "State League",
      "year": 2024,
      "result": "Champion"
    }
  ],
  "stateLeague": "Assam PL",
  "clubTier": "",
  "sprint30m": 4.1,
  "sprint50m": 0,
  "mentalityScore": 1,
  "clubsPlayed": [
    {
      "clubName": "Club Name FC",
      "clubLogo": "",
      "duration": "2018-2020"
    }
  ],
  "featured": false
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/players \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @player-data.json
```

**Using Postman:**
1. Set method to POST
2. URL: `http://localhost:5000/api/players`
3. Add Authorization header with Bearer token
4. Set body to raw JSON
5. Paste your player data
6. Send request

## Pre-seeded Data

Pre-seeded sample data has been removed. Use one of the methods above to add players.

## Scout Report Calculation

Scout reports are automatically calculated when a player is created or updated. The calculation considers:
- Age score
- Physical attributes (height, weight)
- Transfer market presence
- Competition participation
- Championship achievements
- State league recognition
- Club tier reputation
- Speed metrics (30m, 50m sprints)
- Mentality assessment

The final grade ranges from A (highest) to E (lowest).

## Getting Player Data

**Get all players:**
```
GET /api/players
```

**Get specific player:**
```
GET /api/players/:id
```

**Search players:**
```
GET /api/players/search?name=SUBHAM
```

**Filter players:**
```
GET /api/players?age_group=Senior&playingPosition=DEFENDER
```

## Updating Players

**Endpoint:** `PUT /api/players/:id`

**Authentication:** Required (Admin or Super Admin)

Same body structure as POST endpoint. Scout report will be recalculated automatically.

## Deleting Players

**Endpoint:** `DELETE /api/players/:id`

**Authentication:** Required (Super Admin only)

Performs a soft delete (sets `isDeleted: true`).
