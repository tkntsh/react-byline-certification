# CORS Error Fix Guide

## 🔧 Issue
CORS errors when accessing backend from Vercel frontend (especially preview deployments).

## ✅ Solution Applied
Updated CORS configuration to automatically allow all Vercel preview URLs (`*.vercel.app`).

## 🚀 Quick Fix Steps

### Step 1: Commit and Push the Updated Code

```bash
git add server/index.js
git commit -m "Fix CORS: Allow Vercel preview deployments"
git push origin main
```

### Step 2: Update Render Environment Variable (Optional but Recommended)

Even though the code now allows all Vercel previews, it's good practice to set the production URL:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service: `byline-certification-backend`
3. Go to **"Environment"** tab
4. Find or add `FRONTEND_URL`:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://react-byline-certification.vercel.app`
   - This is your production Vercel URL
5. Click **"Save Changes"**

### Step 3: Redeploy Backend

Render will automatically redeploy when you push to GitHub. If you want to manually redeploy:

1. In Render dashboard, go to your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait 2-5 minutes for deployment

### Step 4: Verify Fix

1. **Test Backend Health**:
   ```
   https://byline-certification-backend.onrender.com/api/health
   ```

2. **Test from Frontend**:
   - Go to: https://react-byline-certification.vercel.app
   - Open browser console (F12)
   - Check that news loads without CORS errors
   - Try logging in/registering

## 🎯 What Changed

The CORS configuration now:
- ✅ Allows production Vercel URL: `https://react-byline-certification.vercel.app`
- ✅ Automatically allows ALL Vercel preview URLs: `*.vercel.app`
- ✅ Allows localhost in development
- ✅ Maintains security by only allowing Vercel domains

## 📝 Environment Variables Summary

### Render Backend Environment Variables:
```
JWT_SECRET=<your_secret>
NODE_ENV=production
FRONTEND_URL=https://react-byline-certification.vercel.app
NEWS_API_KEY=<optional>
```

### Vercel Frontend Environment Variables:
```
VITE_API_URL=https://byline-certification-backend.onrender.com
```

## 🐛 If Issues Persist

1. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
2. **Check Render logs** for any errors
3. **Verify environment variables** are set correctly
4. **Test backend directly**: 
   ```bash
   curl https://byline-certification-backend.onrender.com/api/health
   ```
5. **Check browser console** for specific error messages

## ✅ Expected Result

After deployment:
- ✅ News loads on homepage
- ✅ No CORS errors in browser console
- ✅ Login/Register works
- ✅ All API calls succeed

---

**Note**: The updated CORS configuration automatically handles Vercel's preview deployments, so you don't need to add each preview URL manually. This makes development and testing much easier!

