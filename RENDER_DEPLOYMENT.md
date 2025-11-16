# Backend Deployment on Render

## 🎯 Overview

This guide will help you deploy your backend to **Render**, a free alternative to Railway that's perfect for Node.js applications.

**Render Free Tier Features:**
- ✅ Free tier available (750 hours/month)
- ✅ Automatic SSL certificates
- ✅ GitHub integration
- ✅ Automatic deployments
- ⚠️ Free tier spins down after 15 minutes of inactivity (cold start ~30 seconds)

---

## 📋 Prerequisites

- Your code pushed to GitHub
- Frontend already deployed on Vercel: `https://react-byline-certification.vercel.app/`
- GitHub account

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended for easy repo connection)
4. Complete the account setup

### Step 2: Create New Web Service

1. In your Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. You'll be prompted to connect your GitHub account if not already connected
4. Authorize Render to access your repositories

### Step 3: Connect Your Repository

1. In the "Connect a repository" section:
   - Select your GitHub account
   - Find and select your repository: `cursor-demo1` (or whatever you named it)
   - Click **"Connect"**

### Step 4: Configure Web Service

Fill in the following configuration:

#### Basic Settings:
- **Name**: `byline-certification-backend` (or your preferred name)
- **Region**: Choose closest to you (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
- **Branch**: `main` (or `master` if that's your default branch)
- **Root Directory**: Leave **empty** (deploying from root)

#### Build & Deploy Settings:
- **Runtime**: `Node`
- **Build Command**: 
  ```
  npm install
  ```
  (Render will automatically run this, but you can specify it explicitly)
  
- **Start Command**: 
  ```
  npm run server
  ```
  **This is critical!** Make sure this is set correctly.

#### Environment Variables:

Click **"Add Environment Variable"** and add each of these:

1. **JWT_SECRET**
   - **Key**: `JWT_SECRET`
   - **Value**: Generate a strong random string (see below)
   - **Generate Secret**:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
     Copy the output and use it as the value

2. **NODE_ENV**
   - **Key**: `NODE_ENV`
   - **Value**: `production`

3. **FRONTEND_URL**
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://react-byline-certification.vercel.app`
   - This allows CORS to work with your Vercel frontend

4. **NEWS_API_KEY** (Optional)
   - **Key**: `NEWS_API_KEY`
   - **Value**: Your NewsAPI.org key (if you have one)
   - If you don't have one, skip this - the app will use mock data

5. **PORT** (Optional - Render sets this automatically)
   - Render automatically sets the `PORT` environment variable
   - Your server code already uses `process.env.PORT || 5000`, so it will work automatically

#### Advanced Settings (Optional):

- **Auto-Deploy**: `Yes` (deploys automatically on git push)
- **Health Check Path**: `/api/health` (optional, but recommended)

### Step 5: Deploy

1. Scroll down and click **"Create Web Service"**
2. Render will start building and deploying your application
3. Wait for deployment to complete (2-5 minutes)
4. You'll see build logs in real-time

### Step 6: Get Your Backend URL

1. Once deployment completes, Render will provide a URL like:
   ```
   https://byline-certification-backend.onrender.com
   ```
2. **Copy this URL** - you'll need it for the frontend configuration
3. Test the backend:
   ```bash
   curl https://byline-certification-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

### Step 7: Update Frontend Configuration (Vercel)

Now you need to update your Vercel frontend to point to the new Render backend:

1. Go to [vercel.com](https://vercel.com)
2. Select your project: `react-byline-certification`
3. Go to **Settings** → **Environment Variables**
4. Find or add `VITE_API_URL`:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://byline-certification-backend.onrender.com`
   - **Environment**: Production, Preview, Development (select all)
5. Click **"Save"**
6. Go to **Deployments** tab
7. Click the **"..."** menu on the latest deployment
8. Click **"Redeploy"** to apply the new environment variable

**Alternative**: If you want to update via Vercel CLI:
```bash
vercel env add VITE_API_URL production
# Enter: https://byline-certification-backend.onrender.com
```

### Step 8: Verify Deployment

1. **Test Backend Health**:
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**:
   - Visit: `https://react-byline-certification.vercel.app`
   - Try logging in or registering
   - Check browser console for any CORS errors

3. **Test Full Flow**:
   - Register a new user
   - Login
   - Submit a report
   - Check admin dashboard (if you have admin access)

---

## 🔧 Render-Specific Configuration

### Understanding Render's Free Tier

- **Spins Down**: After 15 minutes of inactivity, your service spins down
- **Cold Start**: First request after spin-down takes ~30 seconds
- **Uptime**: 750 hours/month free (enough for always-on if you stay under limit)
- **Solution**: For production, consider upgrading to paid tier ($7/month) for always-on service

### Health Check (Optional but Recommended)

Render can automatically check if your service is healthy:

1. In your Render service settings
2. Go to **"Health Check Path"**
3. Set to: `/api/health`
4. This helps Render know if your service is running correctly

### Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Follow DNS configuration instructions

---

## 🔄 Updating Your Deployment

### Automatic Deployments

Render automatically deploys when you push to your connected branch:
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render will detect the push and automatically redeploy.

### Manual Redeploy

1. Go to Render dashboard
2. Select your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Viewing Logs

1. In Render dashboard, select your service
2. Click **"Logs"** tab
3. View real-time logs and debug issues

---

## 🐛 Troubleshooting

### Issue: Service Won't Start

**Symptoms**: Deployment fails or service crashes

**Solutions**:
1. Check **Logs** tab in Render dashboard
2. Verify **Start Command** is: `npm run server`
3. Check environment variables are set correctly
4. Verify `package.json` has the `server` script

### Issue: CORS Errors

**Symptoms**: Frontend can't connect to backend, CORS errors in browser console

**Solutions**:
1. Verify `FRONTEND_URL` environment variable is set to: `https://react-byline-certification.vercel.app`
2. Check backend logs for CORS errors
3. Ensure frontend `VITE_API_URL` points to your Render backend URL
4. Redeploy both frontend and backend after making changes

### Issue: Slow First Request

**Symptoms**: First request after inactivity takes 30+ seconds

**Explanation**: This is normal on Render's free tier - the service spins down after 15 minutes of inactivity

**Solutions**:
1. Wait for the cold start (first request)
2. Subsequent requests will be fast
3. Consider upgrading to paid tier for always-on service
4. Use a service like [UptimeRobot](https://uptimerobot.com) to ping your service every 10 minutes (keeps it awake)

### Issue: Database Not Persisting

**Symptoms**: Data resets after redeployment

**Explanation**: JSON file database (`database.json`) is stored in the filesystem, which may reset

**Solutions**:
1. This is expected behavior with file-based storage
2. For production, consider migrating to a proper database (PostgreSQL, MongoDB, etc.)
3. Render offers PostgreSQL as an add-on service

### Issue: Build Fails

**Symptoms**: Build process fails during deployment

**Solutions**:
1. Check build logs in Render dashboard
2. Verify `package.json` is correct
3. Ensure all dependencies are listed in `package.json`
4. Check that Node.js version is compatible (Render uses Node 18+ by default)

---

## 📊 Monitoring Your Service

### View Metrics

1. In Render dashboard, select your service
2. Click **"Metrics"** tab
3. View:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Set Up Alerts

1. Go to **"Settings"** → **"Alerts"**
2. Configure email alerts for:
   - Service down
   - High error rate
   - High resource usage

---

## 🔐 Security Best Practices

1. **JWT Secret**: Use a strong, random secret (32+ characters)
2. **Environment Variables**: Never commit secrets to Git
3. **CORS**: Always specify exact frontend URLs (not `*`)
4. **HTTPS**: Render provides automatic SSL certificates
5. **Admin Password**: Change default admin password after deployment

---

## 💰 Cost Information

### Free Tier
- **750 hours/month** (enough for always-on if you stay under)
- **Spins down** after 15 minutes of inactivity
- **Perfect for**: Development, testing, low-traffic apps

### Paid Tier ($7/month)
- **Always on** (no spin-down)
- **No cold starts**
- **Better performance**
- **Recommended for**: Production applications

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] Repository connected
- [ ] Web service created
- [ ] Start command set to: `npm run server`
- [ ] Environment variables set:
  - [ ] `JWT_SECRET` (strong random string)
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL=https://react-byline-certification.vercel.app`
  - [ ] `NEWS_API_KEY` (optional)
- [ ] Service deployed successfully
- [ ] Backend URL copied
- [ ] Frontend `VITE_API_URL` updated in Vercel
- [ ] Frontend redeployed
- [ ] Health endpoint tested: `/api/health`
- [ ] Full application tested (login, submit, admin)

---

## 🎉 Success!

Once all steps are complete, your application should be fully functional:

- **Frontend**: https://react-byline-certification.vercel.app/
- **Backend**: https://your-backend.onrender.com
- **API Health**: https://your-backend.onrender.com/api/health

Your backend is now deployed and ready to serve your frontend! 🚀

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Pricing](https://render.com/pricing)
- [Render Status Page](https://status.render.com)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the **Logs** tab in Render dashboard
2. Verify all environment variables are set correctly
3. Test the backend health endpoint
4. Check browser console for frontend errors
5. Review the troubleshooting section above

