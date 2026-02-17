# Blog Seed Script Documentation

## Overview
This seed script populates the MongoDB database with sample blog posts for the Pro-Talent-Connect platform.

**⚠️ IMPORTANT: This is a one-time seed script. The file will automatically delete itself after successfully seeding the database.**

## Location
`Backend/services/seedBlogs.js` (deleted after successful execution)

## Features
- Creates or uses an existing admin user for blog authorship
- Clears all existing blog entries
- Seeds 8 professional blog posts across 3 categories:
  - **Transfers** (3 posts)
  - **Achievements** (2 posts)
  - **Announcements** (3 posts)
- All blogs are published with proper metadata (images, tags, read times, authors)
- Displays summary statistics after seeding

## Usage

### Option 1: Using npm script (Recommended)
```bash
cd Backend
npm run seed:blogs
```

### Option 2: Direct execution
```bash
cd Backend
node services/seedBlogs.js
```

## Sample Blog Data
The script includes 8 blog posts:
1. **Marcus Silva Signs with Premier League Club** - Transfer news (5 min read)
2. **Five Players Called Up to National Youth Team** - Achievement story (4 min read)
3. **New Advanced Search Features Now Live** - Platform announcement (3 min read)
4. **Top Performers of December 2025** - Player recognition (6 min read)
5. **Winter Transfer Window: Key Moves to Watch** - Transfer analysis (7 min read)
6. **Platform Reaches 1000 Player Milestone** - Company milestone (4 min read)
7. **Behind the Scenes: How We Scout Talent** - Educational content (8 min read)
8. **Record-Breaking Transfer Fee Secured** - Success story (5 min read)

## Blog Schema Fields
Each blog includes:
- `title` - Blog post headline
- `slug` - URL-friendly identifier (auto-generated)
- `content` - Full article text
- `excerpt` - Short summary (max 300 chars)
- `author` - Writer's name (string)
- `author_id` - Reference to Admin model
- `category` - Post category (Transfers, Achievements, Announcements)
- `image` - Featured image URL
- `cover_image` - Alternative cover image
- `readTime` - Estimated reading time in minutes
- `tags` - Array of relevant tags
- `status` - Publication status (PUBLISHED)
- `published_at` - Publication date
- `createdAt` / `updatedAt` - Auto-generated timestamps

## Prerequisites
- MongoDB connection configured in `.env` file
- At least one admin user (script creates one if none exists)

## Output Example
```
MongoDB connected successfully
Using existing admin: Charan
Cleared existing blogs
Successfully seeded 8 blogs

Blogs by category:
  Transfers: 3
  Achievements: 2
  Announcements: 3

Database connection closed

Deleting seed script file...
✓ Seed script file deleted successfully
```

## Self-Deletion Behavior
After successfully seeding the database:
- The script automatically deletes itself (`Backend/services/seedBlogs.js`)
- This ensures seed data is only pushed once
- The npm script `seed:blogs` will fail if run again (file not found)
- This is intentional to prevent accidental re-seeding

## API Endpoint
After seeding, blogs are accessible via:
- **GET** `/api/blogs` - Fetch all published blogs (public)
- **GET** `/api/blogs/:id` - Fetch single blog by ID or slug (public)

## Frontend Integration
The Blog Page automatically fetches and displays seeded content:
- Navigate to: `http://localhost:5173/#blog`
- Filter by category: All, Transfers, Achievements, Announcements
- View cards with images, read times, and excerpts

## Troubleshooting

### MongoDB Connection Error
Ensure your `.env` file contains valid `MONGO_URI`:
```env
MONGO_URI=mongodb+srv://...
```

### Validation Errors
If you see validation errors, ensure the Blog model schema matches the seed data structure.
**The script deletes itself after successful execution** - this is a one-time operation
- Running the script multiple times requires recreating the seed file
- All blog images use Unsplash URLs for professional visuals
- Published dates range from December 2024 to January 2025 for variety
- All blogs are marked as `PUBLISHED` and appear immediately on the frontend
- To re-seed, you would need to recreate the seed script file
## Modified Files
1. **Backend/Models/Blog.js** - Added `author`, `category`, `image`, and `readTime` fields
2. **Backend/services/seedBlogs.js** - Created seed script
3. **Backend/package.json** - Added `seed:blogs` script

## Notes
- Running the script multiple times is safe (it clears existing blogs first)
- All blog images use Unsplash URLs for professional visuals
- Published dates range from December 2024 to January 2025 for variety
- All blogs are marked as `PUBLISHED` and appear immediately on the frontend
