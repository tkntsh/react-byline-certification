# Deployment Guide

## 📋 Table of Contents
1. [Git Setup & Push Instructions](#git-setup--push-instructions)
2. [Deployment Options](#deployment-options)
3. [Recommended Deployment: Vercel + Railway](#recommended-deployment-vercel--railway)
4. [Alternative Deployment Options](#alternative-deployment-options)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🚀 Git Setup & Push Instructions

### Step 1: Initialize Git Repository (if not already done)

```bash
# Navigate to project root
cd C:\Users\Ntokozo\cursor-demo1

# Initialize git repository
git init

# Check current status
git status
```

### Step 2: Verify .gitignore

Ensure your `.gitignore` file includes (should already be present):
```
node_modules/
client/node_modules/
.env
.DS_Store
*.log
database.db
database.json
dist/
client/dist/
.vite/
```

**Important**: The `.gitignore` already excludes `database.json`, which is correct for deployment (database will be created fresh on server).

### Step 3: Stage All Files

```bash
# Add all files to staging
git add .

# Check what will be committed
git status
```

### Step 4: Create Initial Commit

```bash
# Create first commit
git commit -m "Initial commit: Byline Certification Web Application"

# Or use a more descriptive message:
git commit -m "Initial commit: Full-stack byline certification app with React frontend and Express backend"
```

### Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `byline-certification-app` (or your preferred name)
4. Description: "Byline Certification Web Application - Full-stack app for report submission and certification"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

### Step 6: Connect Local Repository to GitHub

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/byline-certification-app.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/byline-certification-app.git

# Verify remote was added
git remote -v
```

### Step 7: Push to GitHub

```bash
# Push to main branch (or master if that's your default)
git branch -M main
git push -u origin main

# If prompted for credentials, use your GitHub username and Personal Access Token
```

### Step 8: Verify Push

1. Go to your GitHub repository page
2. Verify all files are present
3. Check that `.env` and `database.json` are **NOT** in the repository

### Step 9: Create .env.example (Optional but Recommended)

Create a template file for environment variables:

```bash
# Create .env.example file
echo "NEWS_API_KEY=your_newsapi_org_key_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000" > .env.example

# Add and commit it
git add .env.example
git commit -m "Add .env.example template"
git push
```

---

## 🌐 Deployment Options

### Architecture Overview

This is a **full-stack application** with:
- **Frontend**: React app (static files after build)
- **Backend**: Node.js/Express server (requires running server)

### Deployment Strategy

Since you have separate frontend and backend:
1. **Frontend** → Deploy as static site (Vercel, Netlify, etc.)
2. **Backend** → Deploy as Node.js server (Railway, Render, Heroku, etc.)

---

## ⭐ Recommended Deployment: Vercel + Railway

This is the **best option** for your application:
- ✅ Vercel: Excellent for React apps, free tier, automatic deployments
- ✅ Railway: Easy Node.js deployment, free tier, simple setup
- ✅ Fast and reliable
- ✅ Great developer experience

### Part A: Deploy Backend to Railway

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended) or email
3. Complete account setup

#### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your repository: `byline-certification-app`
4. Railway will detect it's a Node.js project

#### Step 3: Configure Backend Deployment

Railway will auto-detect the project, but you need to configure it:

1. **Set Root Directory** (if needed):
   - In project settings, set root directory to project root (not needed if deploying from root)

2. **Configure Start Command**:
   - In the service settings, set start command:
   ```
   npm run server
   ```

3. **Set Environment Variables**:
   - Go to **Variables** tab
   - Add the following:
     ```
     NEWS_API_KEY=your_newsapi_key_here (optional)
     JWT_SECRET=generate_a_strong_random_string_here
     PORT=5000 (Railway will override this, but include it)
     NODE_ENV=production
     ```
   
   **Generate JWT Secret**:
   ```bash
   # On your local machine, run:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as `JWT_SECRET`

4. **Configure Port**:
   - Railway automatically assigns a port via `PORT` environment variable
   - Your Express server already uses `process.env.PORT || 5000`, so it will work automatically

#### Step 4: Deploy
1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** to deploy immediately
3. Wait for deployment to complete (2-5 minutes)

#### Step 5: Get Backend URL
1. After deployment, Railway will provide a URL like: `https://your-app-name.up.railway.app`
2. **Copy this URL** - you'll need it for the frontend
3. This is your backend API URL

#### Step 6: Test Backend
```bash
# Test health endpoint
curl https://your-app-name.up.railway.app/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

---

### Part B: Deploy Frontend to Vercel

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Complete account setup

#### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `byline-certification-app`
3. Vercel will auto-detect it's a React/Vite project

#### Step 3: Configure Frontend Deployment

1. **Framework Preset**: Vite (should be auto-detected)

2. **Root Directory**: 
   - Set to: `client`
   - This tells Vercel to deploy the `client` folder

3. **Build Command**:
   ```
   npm run build
   ```

4. **Output Directory**:
   ```
   dist
   ```
   (Vite outputs to `dist` by default)

5. **Install Command**:
   ```
   npm install
   ```
   (Run in the `client` directory)

6. **Environment Variables**:
   - Add: `VITE_API_URL=https://your-railway-app.up.railway.app`
   - This will be used to configure the API base URL

#### Step 4: Update Frontend API Configuration

You need to update the frontend to use the production API URL.

**Option A: Use Environment Variable (Recommended)**

1. Update `client/src/services/api.js`:
   ```javascript
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || '/api',
     headers: {
       'Content-Type': 'application/json'
     }
   });
   ```

2. In Vercel, add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-app.up.railway.app`

**Option B: Hardcode for Production**

Update `client/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-railway-app.up.railway.app/api'
    : '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (1-3 minutes)
3. Vercel will provide a URL like: `https://your-app.vercel.app`

#### Step 6: Configure CORS on Backend

Update `server/index.js` to allow your Vercel domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app',
    'https://your-app-*.vercel.app' // For preview deployments
  ],
  credentials: true
}));
```

Or for production, allow all Vercel previews:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.vercel.app', /\.vercel\.app$/]
    : 'http://localhost:5173',
  credentials: true
}));
```

**Important**: After updating CORS, redeploy the backend on Railway.

---

### Part C: Update Vite Config for Production

Update `client/vite.config.js` to remove the proxy in production:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  // Production build configuration
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

---

## 🔄 Alternative Deployment Options

### Option 2: Vercel (Frontend) + Render (Backend)

**Render** is another excellent option for backend deployment.

#### Backend on Render:
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `byline-certification-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Root Directory**: (leave empty, or set to root)
6. Add environment variables (same as Railway)
7. Deploy

**Pros**: Free tier, easy setup, automatic SSL
**Cons**: Free tier spins down after inactivity (15 min cold start)

---

### Option 3: Full Deployment on Render

Deploy both frontend and backend on Render.

#### Backend (Web Service):
- Same as Option 2 above

#### Frontend (Static Site):
1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
5. Deploy

**Pros**: Everything in one place
**Cons**: Free tier has cold starts, slower than Vercel

---

### Option 4: Vercel (Frontend) + Fly.io (Backend)

**Fly.io** is great for global deployment.

#### Backend on Fly.io:
1. Install Fly CLI: `npm install -g @fly/cli`
2. Sign up at [fly.io](https://fly.io)
3. In project root, run: `fly launch`
4. Follow prompts:
   - App name: `byline-certification-backend`
   - Region: Choose closest to you
   - Database: No (using JSON file)
5. Create `fly.toml`:
   ```toml
   app = "byline-certification-backend"
   primary_region = "iad"
   
   [build]
   
   [http_service]
     internal_port = 5000
     force_https = true
     auto_stop_machines = false
     auto_start_machines = true
     min_machines_running = 1
   
   [[env]]
     PORT = "5000"
   ```
6. Set secrets:
   ```bash
   fly secrets set JWT_SECRET=your_secret_here
   fly secrets set NEWS_API_KEY=your_key_here
   ```
7. Deploy: `fly deploy`

**Pros**: Global edge deployment, fast, good free tier
**Cons**: More complex setup, requires CLI

---

### Option 5: Heroku (Full Stack)

**Note**: Heroku removed free tier, but still an option.

#### Backend:
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create byline-certification-backend`
4. Set config vars in Heroku dashboard
5. Deploy: `git push heroku main`

#### Frontend:
1. Create another Heroku app: `heroku create byline-certification-frontend`
2. Use buildpack: `heroku buildpacks:set heroku/nodejs`
3. Configure build: Add `package.json` in root with build script
4. Deploy

**Pros**: Well-established platform
**Cons**: Paid only, more expensive

---

## 📋 Post-Deployment Checklist

### Backend Checklist
- [ ] Backend URL is accessible
- [ ] Health endpoint works: `/api/health`
- [ ] Environment variables are set correctly
- [ ] CORS is configured for frontend domain
- [ ] Database file is being created (check Railway/Render logs)
- [ ] Default admin account is created (check logs)
- [ ] JWT_SECRET is strong and unique
- [ ] NEWS_API_KEY is set (if using real news)

### Frontend Checklist
- [ ] Frontend URL is accessible
- [ ] API calls are pointing to correct backend URL
- [ ] CORS errors are resolved
- [ ] Authentication works (login/register)
- [ ] Protected routes work
- [ ] Admin dashboard accessible (with admin account)
- [ ] News display works
- [ ] Submission system works
- [ ] All pages load correctly

### Security Checklist
- [ ] Default admin password changed
- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] CORS is restricted to your frontend domain
- [ ] Environment variables are not exposed in code
- [ ] HTTPS is enabled (automatic on Vercel/Railway/Render)

### Testing Checklist
- [ ] Register new user
- [ ] Login with new user
- [ ] Submit a report
- [ ] View own submissions
- [ ] Login as admin
- [ ] Review submission as admin
- [ ] View admin dashboard
- [ ] Check statistics

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Railway/Render logs
- Verify `npm run server` command works locally
- Check environment variables are set

**Problem**: Database not working
- JSON file database should work, but check file permissions
- Verify `database.json` is being created (check logs)

**Problem**: CORS errors
- Update CORS configuration in `server/index.js`
- Add your frontend URL to allowed origins

### Frontend Issues

**Problem**: API calls failing
- Check `VITE_API_URL` environment variable
- Verify backend URL is correct
- Check browser console for errors
- Verify CORS is configured correctly

**Problem**: Build fails
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Check Node version (should be 18+)

**Problem**: 404 errors on routes
- Vercel needs special config for React Router
- Create `vercel.json` in `client` directory:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

1. **Vercel**: Automatically deploys on push to `main` branch
2. **Railway**: Automatically deploys on push to connected branch

To set up:
- Connect GitHub repository
- Enable automatic deployments
- Push to `main` branch → automatic deployment

---

## 📊 Cost Estimation

### Free Tier (Recommended Setup)
- **Vercel**: Free (unlimited deployments, 100GB bandwidth)
- **Railway**: $5/month free credit (usually enough for small apps)
- **Total**: ~$0-5/month

### Paid Options
- **Vercel Pro**: $20/month (if needed)
- **Railway Pro**: $20/month (if needed)
- **Render**: $7/month (if using paid tier)

---

## 🎯 Final Recommendations

**Best Choice**: **Vercel (Frontend) + Railway (Backend)**
- ✅ Easiest setup
- ✅ Best performance
- ✅ Great developer experience
- ✅ Automatic deployments
- ✅ Free tier available

**Alternative**: **Vercel (Frontend) + Render (Backend)**
- ✅ Also easy setup
- ✅ Free tier available
- ⚠️ Cold starts on free tier

---

## 📝 Summary

1. **Git Setup**: Initialize, commit, push to GitHub ✅
2. **Backend**: Deploy to Railway (or Render/Fly.io) ✅
3. **Frontend**: Deploy to Vercel ✅
4. **Configuration**: Set environment variables, update API URLs ✅
5. **Testing**: Verify all functionality works ✅

Your application will be live and accessible worldwide! 🚀

