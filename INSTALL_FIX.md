# Installation Fix - Windows Setup

## Problem Solved ✅

The original issue was that `better-sqlite3` requires Python to compile native bindings. I've fixed this by switching to a **pure JavaScript JSON file-based database** that requires **no compilation** and works immediately on Windows!

## What Changed

- ✅ Removed `better-sqlite3` (required Python compilation)
- ✅ Implemented JSON file-based database (no compilation needed)
- ✅ All database operations now use simple JavaScript
- ✅ No Python or build tools required!

## Quick Setup

### 1. Create `.env` File

Create a `.env` file in the root directory with your API key:

```env
NEWS_API_KEY=a8d181a301cd46c1b1c202b8dc17677a
JWT_SECRET=byline_certification_secret_key_2024
PORT=5000
```

### 2. Install Dependencies

Now run the install command - it should work without any Python errors:

```bash
npm run install-all
```

### 3. Start the Application

```bash
npm run dev
```

## Database

The database is now stored in `database.json` (automatically created). This is a simple JSON file that:
- ✅ Works immediately (no setup)
- ✅ No compilation needed
- ✅ Easy to backup (just copy the file)
- ✅ Perfect for development

**Note:** For production, you may want to switch to a proper database like PostgreSQL, but this works great for development!

## Default Admin Account

After first run:
- **Email:** admin@99.ninenine
- **Password:** admin99*

## Troubleshooting

If you still see errors:
1. Delete `node_modules` folder
2. Delete `package-lock.json` if it exists
3. Run `npm run install-all` again

The installation should now complete successfully! 🎉

