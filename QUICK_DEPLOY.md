# Quick Deployment Reference

## 🚀 Fast Track Deployment (Vercel + Render)

> **Note**: This guide uses Render for backend (free tier available). Railway alternative instructions available in `RENDER_DEPLOYMENT.md`

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git push -u origin main
```

### Step 2: Deploy Backend (Render)
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `byline-certification-backend`
   - **Start Command**: `npm run server`
5. Add environment variables:
   ```
   JWT_SECRET=<generate_random_string>
   NEWS_API_KEY=<optional>
   NODE_ENV=production
   FRONTEND_URL=https://react-byline-certification.vercel.app
   ```
6. Click **"Create Web Service"**
7. Wait 2-5 minutes, then copy your Render URL (e.g., `https://your-backend.onrender.com`)

### Step 3: Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) → Sign up
2. Add New Project → Import GitHub repo
3. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add/Update environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. Deploy → Copy your Vercel URL

### Step 4: Test
- Frontend: `https://react-byline-certification.vercel.app`
- Backend: `https://your-backend.onrender.com/api/health`

## 🔑 Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ✅ Checklist
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Test login/register
- [ ] Test submission
- [ ] Test admin dashboard

## 🆘 Common Issues

**CORS Error**: Update `FRONTEND_URL` in Render to match your Vercel URL and redeploy

**API Not Working**: Check `VITE_API_URL` in Vercel matches Render URL

**Slow First Request**: Normal on Render free tier (cold start ~30 sec after 15 min inactivity)

**Build Fails**: Check Root Directory is set to `client` in Vercel

**Backend Not Starting**: Check Start Command is `npm run server`

---

For detailed Render instructions, see `RENDER_DEPLOYMENT.md`  
For general deployment guide, see `DEPLOYMENT_GUIDE.md`

