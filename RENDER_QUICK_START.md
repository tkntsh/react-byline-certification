# Render Deployment - Quick Start

## 🚀 Fast Track (5 Minutes)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com) → Sign up with GitHub

### Step 2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `byline-certification-backend`
   - **Start Command**: `npm run server`
   - **Build Command**: `npm install` (or leave default)
4. Add Environment Variables:
   ```
   JWT_SECRET=<generate_with_command_below>
   NODE_ENV=production
   FRONTEND_URL=https://react-byline-certification.vercel.app
   NEWS_API_KEY=<optional>
   ```
5. Click **"Create Web Service"**
6. Wait 2-5 minutes for deployment
7. Copy your Render URL: `https://your-backend.onrender.com`

### Step 3: Update Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Your project → **Settings** → **Environment Variables**
3. Update `VITE_API_URL` to: `https://your-backend.onrender.com`
4. **Redeploy** your frontend

### Step 4: Test
- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: `https://react-byline-certification.vercel.app`

## 🔑 Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ⚠️ Important Notes

- **Free Tier**: Spins down after 15 min inactivity (30 sec cold start)
- **Keep Awake**: Use [UptimeRobot](https://uptimerobot.com) to ping every 10 min
- **CORS**: Already configured via `FRONTEND_URL` environment variable

## 🆘 Quick Troubleshooting

**CORS Error?** → Check `FRONTEND_URL` in Render matches your Vercel URL  
**Service Won't Start?** → Check Start Command is `npm run server`  
**Slow First Request?** → Normal on free tier (cold start)  

For detailed instructions, see `RENDER_DEPLOYMENT.md`

