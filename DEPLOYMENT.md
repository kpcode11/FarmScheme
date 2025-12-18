# 🚀 Deployment Guide - Farmers Support Platform

This guide will walk you through deploying your full-stack application to production.

## 📋 Deployment Overview

Your application has three main components:
1. **Frontend** (React + Vite) → Deploy to **Vercel** or **Netlify**
2. **Backend** (Node.js + Express) → Deploy to **Render** or **Railway**
3. **Python Services** (Chatbot) → Deploy to **Render** or **Railway**
4. **Database** (MongoDB) → Already on **MongoDB Atlas** ✅

---

## 🎯 Recommended Deployment Stack

- **Frontend**: Vercel (Free, optimized for React)
- **Backend**: Render (Free tier available)
- **Python Services**: Render (Free tier available)
- **Database**: MongoDB Atlas (Already set up)

---

## 📦 PART 1: Prepare Your Project

### Step 1: Update package.json files

Make sure your scripts are production-ready:

**server/package.json** - Add this if not present:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

**client/Learning/package.json** - Should have:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Create Production Config Files

We'll create these files in the next steps.

---

## 🌐 PART 2: Deploy Backend (Render)

### Step 1: Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Connect Repository
1. Connect your GitHub repository
2. Select your repository
3. Render will detect it's a Node.js app

### Step 3: Configure Web Service

**Build Settings:**
- **Name**: `farmers-backend` (or any name)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Plan:** Select "Free"

### Step 4: Add Environment Variables

In Render dashboard, add these environment variables:

```
PORT=3000
MONGODB_URL=mongodb+srv://username:password@clustername.rqu43sk.mongodb.net
DB_NAME=dbname
CORS_ORIGIN=https://your-frontend-url.vercel.app
JWT_SECRET=a7f3c8e9d2b4a6f1e8c3d7b9a2f5e8c1d4b7a9e2f6c8d1b3a7e9f2c4d6b8a1e3f5
CLOUDINARY_CLOUD_NAME=cloudname
CLOUDINARY_API_KEY=apikey
CLOUDINARY_API_SECRET=apisecret
```

**Important**: You'll update `CORS_ORIGIN` after deploying frontend.

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://farmers-backend.onrender.com`

---

## 🎨 PART 3: Deploy Frontend (Vercel)

### Step 1: Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"

### Step 2: Import Repository
1. Select your GitHub repository
2. Click "Import"

### Step 3: Configure Project

**Build Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `client/Learning`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_KEY=googlemapsapikey
VITE_API_BASE_URL=https://farmers-backend.onrender.com/api/v1
```

**Replace** `farmers-backend.onrender.com` with your actual Render backend URL.

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://your-app.vercel.app`

### Step 6: Update Backend CORS
1. Go back to **Render dashboard**
2. Go to your backend service
3. Update `CORS_ORIGIN` environment variable:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
4. Save and wait for backend to redeploy

---

## 🐍 PART 4: Deploy Python Chatbot (Render)

### Step 1: Create Another Web Service
1. In Render, click "New +" → "Web Service"
2. Select your repository again
3. Name it `farmers-chatbot`

### Step 2: Configure Python Service

**Build Settings:**
- **Name**: `farmers-chatbot`
- **Region**: Same as backend
- **Branch**: `main`
- **Root Directory**: `.` (root)
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python chatbot_service.py`

### Step 3: Add Environment Variables (if needed)
Add any required environment variables for your chatbot.

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment

---

## 🔒 PART 5: Security Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] `.env` files are NOT committed to Git
- [ ] MongoDB Atlas has proper IP whitelist (0.0.0.0/0 for now, or specific IPs)
- [ ] CORS is configured with your frontend domain
- [ ] API keys are kept secret
- [ ] JWT secret is strong and unique

---

## 🧪 PART 6: Test Your Deployment

### Test Checklist:

1. **Frontend loads**: Visit your Vercel URL
2. **API connection**: Try registering/logging in
3. **Database**: Check if data is saved (MongoDB Atlas)
4. **File uploads**: Test Cloudinary integration
5. **Maps**: Check if Google Maps loads
6. **Chatbot**: Test chatbot functionality

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend not connecting to MongoDB
- **Solution**: Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)

**Problem**: CORS errors
- **Solution**: Verify CORS_ORIGIN matches your frontend URL exactly

**Problem**: Environment variables not loading
- **Solution**: Check Render dashboard → Environment → Variables

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check VITE_API_BASE_URL points to your backend

**Problem**: Build fails
- **Solution**: Check build logs in Vercel, ensure all dependencies are in package.json

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin down may take 30-60 seconds
- 750 hours/month free (enough for one service running 24/7)

**Solutions:**
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 14 minutes
- Upgrade to paid tier ($7/month) for always-on services

---

## 📊 Monitoring

### Set Up Monitoring:

1. **Render**: Built-in logs and metrics
2. **Vercel**: Analytics dashboard
3. **MongoDB Atlas**: Database monitoring

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:

1. **Push to GitHub** → Auto-deploy to production
2. **Branch**: `main` triggers production deployment
3. **Pull Requests**: Get preview deployments

---

## 💰 Cost Breakdown (Free Tier)

- **MongoDB Atlas**: Free (512MB storage)
- **Render**: Free (750 hours/month)
- **Vercel**: Free (100GB bandwidth)
- **Cloudinary**: Free (25GB storage, 25GB bandwidth)
- **Google Maps API**: $200 free credit monthly

**Total**: $0/month (within free tier limits)

---

## 🚀 Alternative Deployment Options

### Option 2: Railway (Alternative to Render)
- Similar to Render
- $5 free credit monthly
- Easier configuration
- [https://railway.app](https://railway.app)

### Option 3: DigitalOcean App Platform
- $5/month for basic plan
- More control
- Good for scaling

### Option 4: Self-Hosted VPS
- DigitalOcean Droplet ($6/month)
- AWS EC2
- More complex but full control

---

## 📝 Post-Deployment Steps

1. **Update README.md**: Add live demo link
2. **Test everything**: Run through all features
3. **Monitor logs**: Check for errors
4. **Set up domain**: (Optional) Buy custom domain
5. **Enable analytics**: Add Google Analytics
6. **Set up error tracking**: Consider Sentry

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

**Next**: After deployment, update your [README.md](README.md) with:
- Live demo link
- Deployment status badges
- Known issues (if any)

Good luck with your deployment! 🎉
