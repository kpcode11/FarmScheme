# ⚡ Quick Deploy - 5 Minutes

Your authentication is ready for production! Follow these steps:

---

## 🔑 Step 1: Get Clerk Secret Key (30 seconds)

1. Go to https://dashboard.clerk.com
2. Click your app → **API Keys**
3. Copy the **Secret key** (starts with `sk_test_`)

---

## 🖥️ Step 2: Deploy Backend (2 minutes)

### On Render:

1. Go to https://render.com → New → **Web Service**
2. Connect GitHub repo
3. Settings:
   - Root: `server`
   - Build: `npm install`
   - Start: `npm start`

4. **Environment Variables** (CRITICAL):
   ```
   CLERK_SECRET_KEY=sk_test_[paste_your_key_here]
   CLERK_PUBLISHABLE_KEY=pk_test_ZXhhY3QtZG92ZS04OS5jbGVyay5hY2NvdW50cy5kZXYk
   MONGODB_URL=[your_mongodb_connection_string]
   DB_NAME=farmers
   CORS_ORIGIN=http://localhost:5173
   PORT=3000
   ```

5. Click **Deploy**
6. Copy backend URL: `https://_____.onrender.com`

**Test**: Visit `https://_____.onrender.com/health`  
Should see: `"clerkConfigured": true` ✅

---

## 🌐 Step 3: Deploy Frontend (2 minutes)

### On Vercel:

1. Go to https://vercel.com → **Import Project**
2. Choose your GitHub repo
3. **IMPORTANT**: Root Directory = `client/Learning`
4. Framework: Vite

5. **Environment Variables**:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXhhY3QtZG92ZS04OS5jbGVyay5hY2NvdW50cy5kZXYk
   VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
   VITE_API_KEY=AIzaSyBrNxzYziHh597YlHdPLI8Ib8jRYbwSnbc
   ```

6. Click **Deploy**
7. Copy frontend URL: `https://_____.vercel.app`

---

## 🔄 Step 4: Update CORS (30 seconds)

1. Go back to **Render**
2. Your service → **Environment**
3. Update: `CORS_ORIGIN=https://your-app.vercel.app,http://localhost:5173`
4. Save (auto-restarts)

---

## ✅ Step 5: Test (30 seconds)

1. Visit your Vercel URL
2. Click **Register** → Sign up
3. Click **Login** → Sign in
4. ✅ Done!

---

## 🐛 Troubleshooting

**401 Error?**
→ Check `CLERK_SECRET_KEY` on Render (starts with `sk_test_`)

**CORS Error?**
→ Update `CORS_ORIGIN` on Render with exact Vercel URL

**"Missing Key" Error?**
→ Check `VITE_CLERK_PUBLISHABLE_KEY` on Vercel (with `VITE_` prefix)

---

## 📚 Need More Help?

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for detailed instructions.

---

**🚀 That's it! Your app is live!**
