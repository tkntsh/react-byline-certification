# Quick Deployment Reference

## 🚀 Fast Track Deployment (Vercel + Railway)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git push -u origin main
```

### Step 2: Deploy Backend (Railway)
1. Go to [railway.app](https://railway.app) → Sign up
2. New Project → Deploy from GitHub → Select your repo
3. Settings → Add environment variables:
   ```
   JWT_SECRET=<generate_random_string>
   NEWS_API_KEY=<optional>
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Settings → Start Command: `npm run server`
5. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

### Step 3: Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) → Sign up
2. Add New Project → Import GitHub repo
3. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app
   ```
5. Deploy → Copy your Vercel URL

### Step 4: Update Backend CORS
1. Go back to Railway
2. Add environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy backend

### Step 5: Test
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-railway-app.up.railway.app/api/health`

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

**CORS Error**: Update `FRONTEND_URL` in Railway and redeploy

**API Not Working**: Check `VITE_API_URL` in Vercel matches Railway URL

**Build Fails**: Check Root Directory is set to `client` in Vercel

**Backend Not Starting**: Check Start Command is `npm run server`

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

