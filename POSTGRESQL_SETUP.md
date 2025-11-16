# PostgreSQL Setup Guide - Quick Reference

## 🎯 Why PostgreSQL?

Your current setup uses JSON file storage, which gets wiped on every Render redeployment. PostgreSQL provides **persistent storage** that survives redeployments.

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `byline-certification-db`
   - **Database**: `byline_certification` (auto-generated)
   - **Region**: Same region as your backend
   - **Plan**: Free (90 days free, then $7/month)
4. Click **"Create Database"**
5. Wait 1-2 minutes for creation

### Step 2: Get Connection String

1. In your PostgreSQL service dashboard
2. Go to **"Connections"** tab
3. Copy the **"Internal Database URL"**
   - Format: `postgresql://user:password@host:port/database`
   - Example: `postgresql://byline_user:abc123@dpg-xxxxx-a.oregon-postgres.render.com/byline_certification`

### Step 3: Add to Backend Environment Variables

1. Go to your **backend service** on Render
2. Go to **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the connection string from Step 2
5. Click **"Save Changes"**

### Step 4: Redeploy (Automatic)

- Render will automatically redeploy your backend
- Wait 2-5 minutes
- Check logs for: `✅ Connected to PostgreSQL database`

---

## ✅ Verification

### Check Database Connection

1. **Render Logs**:
   - Go to backend service → **"Logs"**
   - Look for: `✅ Connected to PostgreSQL database`
   - Look for: `✅ PostgreSQL tables initialized`

2. **Test Registration**:
   - Register a new user on your site
   - Check logs - should see database operations
   - User should be saved

3. **Test Persistence**:
   - Register a user
   - Redeploy backend (or wait for auto-deploy)
   - Login with same user - should work!

---

## 🔍 Troubleshooting

### "Cannot connect to database"

**Solution**:
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running (green status)
- Ensure connection string has no extra spaces

### "relation does not exist" error

**Solution**:
- Tables are auto-created on first run
- Check logs for table creation messages
- If missing, restart backend service

### "SSL required" error

**Solution**:
- Code automatically handles SSL in production
- Verify `NODE_ENV=production` is set
- Check connection string format

---

## 💰 Cost Information

### Render PostgreSQL Free Tier:
- ✅ **90 days free** (then $7/month)
- ✅ **1 GB storage**
- ✅ **No connection limits**
- ✅ Perfect for small to medium apps

### Alternative Free Options:
- **Supabase**: Free tier (500 MB, unlimited projects)
- **Neon**: Free tier (3 GB, serverless)
- **Railway**: $5/month (if you have Railway account)

---

## 📝 What Happens After Setup

1. **First Run**: 
   - Tables are automatically created
   - Default admin user is created
   - Ready to use!

2. **User Registration**:
   - Users saved to PostgreSQL
   - Data persists across deployments

3. **Submissions**:
   - All submissions saved to database
   - Admin reviews saved permanently

---

## 🔄 Migration from JSON to PostgreSQL

**Automatic**: 
- If `DATABASE_URL` is set → Uses PostgreSQL
- If not set → Falls back to JSON (local dev)

**No data migration needed**:
- New users will be saved to PostgreSQL
- Old JSON data remains (but won't be used if PostgreSQL is active)

---

## 🎯 Summary

1. ✅ Create PostgreSQL on Render (free tier)
2. ✅ Copy connection string
3. ✅ Add `DATABASE_URL` to backend environment variables
4. ✅ Wait for auto-redeploy
5. ✅ Verify connection in logs
6. ✅ Test user registration

**That's it!** Your data will now persist! 🎉

---

## 📚 Additional Resources

- [Render PostgreSQL Docs](https://render.com/docs/databases)
- [PostgreSQL Node.js Guide](https://node-postgres.com/)
- [Render Database Connection Guide](https://render.com/docs/databases#connecting-from-outside-render)

---

**Need Help?** Check `FIXES_AND_DEPLOYMENT.md` for detailed troubleshooting.

