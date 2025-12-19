# 🚀 Clerk Authentication - Production Deployment Guide

## Quick Start: Deploy in 5 Minutes

### ✅ Prerequisites Checklist
- [ ] Code pushed to GitHub
- [ ] Clerk account created at [clerk.com](https://clerk.com)
- [ ] MongoDB Atlas database ready
- [ ] Cloudinary account (for file uploads)

---

## 1️⃣ Get Your Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application (or create one)
3. Navigate to **API Keys**
4. Copy both keys:
   - **Publishable Key**: `pk_test_...` (for frontend)
   - **Secret Key**: `sk_test_...` (for backend)

---

## 2️⃣ Backend Deployment (Render)

### Deploy to Render

1. **Create Web Service**
   - Go to [render.com](https://render.com/dashboard)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   
2. **Configure Service**
   ```
   Name: farmers-backend
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```

3. **Add Environment Variables** (CRITICAL ⚠️)

   Click **"Environment"** tab and add:

   ```bash
   # Clerk Authentication (REQUIRED)
   CLERK_SECRET_KEY=sk_test_your_secret_key_from_clerk_dashboard
   CLERK_PUBLISHABLE_KEY=pk_test_ZXhhY3QtZG92ZS04OS5jbGVyay5hY2NvdW50cy5kZXYk
   
   # Database
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net
   DB_NAME=farmers
   
   # Server
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   
   # Cloudinary (File Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment (~2-3 minutes)
   - Copy your backend URL: `https://your-app.onrender.com`

5. **Test Backend Health**
   
   Visit: `https://your-app.onrender.com/health`
   
   Should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-12-19T...",
     "clerkConfigured": true
   }
   ```

---

## 3️⃣ Frontend Deployment (Vercel)

### Deploy to Vercel

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - **IMPORTANT**: Set **Root Directory** to `client/Learning`

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Add Environment Variables**

   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXhhY3QtZG92ZS04OS5jbGVyay5hY2NvdW50cy5kZXYk
   VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
   VITE_API_KEY=AIzaSyBrNxzYziHh597YlHdPLI8Ib8jRYbwSnbc
   ```

4. **Deploy**
   - Click **"Deploy"**
   - Wait for build (~1-2 minutes)
   - Get your URL: `https://your-app.vercel.app`

---

## 4️⃣ Configure Clerk Dashboard

1. **Add Production URLs**
   - Go to Clerk Dashboard → Your App → **"Paths"**
   - Add Vercel URL to **Allowed origins**:
     ```
     https://your-app.vercel.app
     https://your-app-*.vercel.app (for preview deployments)
     ```

2. **Set Redirect URLs**
   - **Sign-in URL**: `/login`
   - **Sign-up URL**: `/register`
   - **After sign-in URL**: `/`
   - **After sign-up URL**: `/`

3. **Enable Email Verification** (Recommended)
   - Go to **User & Authentication** → **Email**
   - Enable "Verify email address"

---

## 5️⃣ Update CORS on Backend

**After frontend is deployed**, update Render environment:

1. Go to Render Dashboard → Your Service → **Environment**
2. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://your-app.vercel.app,http://localhost:5173
   ```
3. Click **"Save Changes"** (service will restart automatically)

---

## ✅ Test Your Deployment

### Test Authentication

1. **Visit your Vercel URL**: `https://your-app.vercel.app`

2. **Test Sign Up**:
   - Click "Register" or "Sign Up"
   - Fill in the Clerk form
   - Verify email if required
   - Should redirect to home/dashboard

3. **Test Sign In**:
   - Sign out
   - Click "Login"
   - Enter credentials
   - Should authenticate successfully

4. **Test Protected Routes**:
   - Navigate to pages that require authentication
   - Should work without 401 errors
   - Check browser DevTools → Network → Look for `Authorization: Bearer ...` header

### Check API Integration

Open DevTools → Network tab:
- API calls should have `Authorization: Bearer <token>` header
- Should return **200** status (not 401 Unauthorized)
- Backend should log successful token verification

---

## 🐛 Common Issues & Solutions

### ❌ Issue: "Missing Clerk Publishable Key"

**Solution**:
1. Check Vercel environment variables
2. Ensure `VITE_CLERK_PUBLISHABLE_KEY` is set
3. Redeploy: Settings → Deployments → Redeploy

### ❌ Issue: 401 Unauthorized on API Calls

**Possible Causes**:
1. Missing `CLERK_SECRET_KEY` on Render
2. Wrong secret key (using publishable key instead)
3. Backend not restarted after adding env vars

**Solution**:
1. Verify Render env vars: `CLERK_SECRET_KEY=sk_test_...` (starts with `sk_test_`)
2. Check backend logs on Render dashboard
3. Restart backend service

### ❌ Issue: CORS Error

**Error**: `Access to fetch at 'https://backend...' from origin 'https://frontend...' has been blocked`

**Solution**:
1. Update `CORS_ORIGIN` on Render to include your Vercel domain
2. Format: `https://app.vercel.app` (no trailing slash)
3. Restart backend

### ❌ Issue: Infinite Redirect Loop

**Solution**:
1. Check Clerk Dashboard → Paths
2. Ensure "After sign-in URL" is `/` or `/dashboard`
3. Not `/login` or `/register`

### ❌ Issue: Backend Health Check Shows "clerkConfigured: false"

**Solution**:
1. `CLERK_SECRET_KEY` is missing or incorrect on Render
2. Add the key: `sk_test_...` from Clerk Dashboard
3. Restart service

---

## 📋 Environment Variables Reference

### Vercel (Frontend)

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | ✅ Yes |
| `VITE_API_BASE_URL` | `https://backend.onrender.com/api/v1` | ✅ Yes |
| `VITE_API_KEY` | Google Maps API Key | ⚠️ If using maps |

### Render (Backend)

| Variable | Value | Required |
|----------|-------|----------|
| `CLERK_SECRET_KEY` | `sk_test_...` | ✅ Yes |
| `CLERK_PUBLISHABLE_KEY` | `pk_test_...` | ✅ Yes |
| `MONGODB_URL` | MongoDB connection string | ✅ Yes |
| `DB_NAME` | `farmers` | ✅ Yes |
| `CORS_ORIGIN` | Frontend URL | ✅ Yes |
| `PORT` | `3000` | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | ⚠️ If using uploads |
| `CLOUDINARY_API_KEY` | Your API key | ⚠️ If using uploads |
| `CLOUDINARY_API_SECRET` | Your API secret | ⚠️ If using uploads |

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** to Git
   - Already in `.gitignore` ✅
   
2. **Use separate Clerk instances** for dev/production
   - Create a new Clerk app for production
   - Use `pk_live_...` and `sk_live_...` keys

3. **Rotate secrets regularly**
   - Update Clerk keys every 90 days
   - Update database credentials

4. **Enable 2FA in Clerk**
   - Dashboard → User & Authentication → Multi-factor

5. **Monitor Backend Logs**
   - Check Render logs regularly
   - Set up error alerts

---

## 🎯 Production Checklist

Before going live:

- [ ] Clerk production instance created (with `pk_live_` keys)
- [ ] MongoDB production cluster configured
- [ ] Custom domain set up on Vercel
- [ ] SSL certificate enabled (automatic on Vercel/Render)
- [ ] Environment variables set on both platforms
- [ ] CORS configured with production domains
- [ ] Clerk allowed origins updated
- [ ] API rate limiting enabled
- [ ] Error monitoring set up (Sentry/LogRocket)
- [ ] Database backups enabled
- [ ] Cloudinary production account configured
- [ ] Test all authentication flows
- [ ] Test all API endpoints
- [ ] Mobile responsiveness verified

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Clerk Docs**: https://clerk.com/docs
- **Clerk Support**: https://clerk.com/support
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

---

## 🎉 You're Live!

Your app is now running with:
✅ Professional authentication (Clerk)
✅ Secure backend (Render)
✅ Fast frontend (Vercel)
✅ Email verification
✅ Password reset
✅ Session management
✅ Production-ready security

**Test your app**: `https://your-app.vercel.app` 🚀
