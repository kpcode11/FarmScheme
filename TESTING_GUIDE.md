# 🧪 Test Authentication - Verification Guide

Use this guide to test your authentication system locally and in production.

---

## 🏠 Local Testing

### Prerequisites
- [ ] Backend running on `http://localhost:3000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] MongoDB connected
- [ ] Clerk keys in `.env` files

### Test Checklist

#### 1. Backend Health Check
```bash
# Open in browser or use curl
http://localhost:3000/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "clerkConfigured": true
}
```

✅ Pass: `clerkConfigured: true`  
❌ Fail: `clerkConfigured: false` → Check `CLERK_SECRET_KEY` in server/.env

---

#### 2. Sign Up Flow

1. **Open Frontend**: `http://localhost:5173`
2. **Click "Register"** or navigate to `/register`
3. **Fill in the form**:
   - Email
   - Password (min 8 chars)
   - First name (optional)
   - Last name (optional)

**Expected**:
- ✅ Clerk sign-up form appears
- ✅ Beautiful gradient background
- ✅ Form validates input
- ✅ After signup, redirects to `/`
- ✅ User is logged in

**Troubleshooting**:
- ❌ "Missing Clerk Publishable Key" → Check `VITE_CLERK_PUBLISHABLE_KEY` in client/Learning/.env
- ❌ Blank page → Check console for errors
- ❌ CORS error → Check backend `CORS_ORIGIN` includes `http://localhost:5173`

---

#### 3. Sign In Flow

1. **Sign out** (click user button → Sign out)
2. **Click "Login"** or navigate to `/login`
3. **Enter credentials** from step 2

**Expected**:
- ✅ Clerk login form appears
- ✅ Can sign in with email/password
- ✅ Redirects to `/` after login
- ✅ User profile shows in navbar

---

#### 4. Protected Routes

**Test these routes** (should only work when logged in):

- `/profile` - User profile page
- `/saved-schemes` - Saved schemes
- `/dashboard` - Dashboard

**Expected**:
- ✅ When logged in: Pages load correctly
- ✅ When logged out: Redirects to `/login`
- ✅ After login: Returns to intended page

---

#### 5. API Authentication

**Open DevTools** → Network tab → Navigate to a protected page

**Check API requests**:
- ✅ Headers include: `Authorization: Bearer eyJhbGc...`
- ✅ Responses return `200 OK`
- ❌ If `401 Unauthorized`: Check backend middleware

**Example API Call**:
```javascript
// In browser console
fetch('http://localhost:3000/api/v1/user/profile', {
  headers: {
    'Authorization': 'Bearer ' + 'your_token_here'
  }
})
```

---

#### 6. User Profile

1. **Navigate to** `/profile`
2. **Check displayed data**:
   - ✅ Name shows correctly
   - ✅ Email shows correctly
   - ✅ Avatar shows (if uploaded)

---

#### 7. Sign Out

1. **Click user button** in navbar
2. **Click "Sign Out"**

**Expected**:
- ✅ Redirects to home page
- ✅ User button disappears
- ✅ Cannot access protected routes
- ✅ Redirects to `/login` when trying to access protected pages

---

## 🌐 Production Testing

After deploying to Vercel and Render, test the same flows:

### 1. Backend Health Check
```
https://your-backend.onrender.com/health
```

**Expected**:
```json
{
  "status": "ok",
  "timestamp": "...",
  "clerkConfigured": true
}
```

**If `clerkConfigured: false`**:
1. Check Render environment variables
2. Verify `CLERK_SECRET_KEY` is set (starts with `sk_test_`)
3. Check Render logs for errors

---

### 2. Frontend Deployment

Visit: `https://your-app.vercel.app`

**Expected**:
- ✅ Page loads
- ✅ No console errors
- ✅ Login/Register buttons visible

**Common Issues**:
- ❌ Blank page → Check Vercel build logs
- ❌ "Missing Clerk key" → Check Vercel env vars
- ❌ Console errors → Check browser DevTools

---

### 3. Full Authentication Flow

**Test in production**:
1. ✅ Sign up new account
2. ✅ Receive verification email (if enabled)
3. ✅ Sign in
4. ✅ Access protected routes
5. ✅ Check user profile
6. ✅ Sign out

---

### 4. API Integration

**Check in DevTools → Network**:
- ✅ API calls go to `https://your-backend.onrender.com/api/v1/...`
- ✅ Include `Authorization: Bearer ...` header
- ✅ Return `200` status
- ❌ `401` → Backend token verification failing
- ❌ CORS error → Update `CORS_ORIGIN` on Render

---

### 5. Clerk Dashboard Verification

**Check in Clerk Dashboard**:
1. Go to https://dashboard.clerk.com
2. Your app → **Users**
3. ✅ New user should appear after signup
4. ✅ User status should be "Active"
5. ✅ Email verified (if enabled)

---

## 🐛 Common Issues & Fixes

### Issue: 401 Unauthorized on API Calls

**Symptoms**:
- API returns `401` status
- Backend logs: "Token verification failed"

**Solutions**:
1. Check `CLERK_SECRET_KEY` on Render
2. Verify it starts with `sk_test_` (not `pk_test_`)
3. Check backend logs: Dashboard → Your Service → Logs
4. Verify frontend is sending token (DevTools → Network → Headers)

---

### Issue: CORS Error

**Symptoms**:
- Console error: "blocked by CORS policy"
- Network tab shows CORS error

**Solutions**:
1. Update `CORS_ORIGIN` on Render:
   ```
   CORS_ORIGIN=https://your-app.vercel.app,http://localhost:5173
   ```
2. No trailing slash
3. Exact match required
4. Restart Render service

---

### Issue: Infinite Redirect Loop

**Symptoms**:
- Browser keeps redirecting
- URL keeps changing
- Never reaches page

**Solutions**:
1. Check Clerk Dashboard → Paths
2. "After sign-in URL" should be `/` or `/dashboard`
3. NOT `/login` or `/register`
4. Clear browser cache and cookies

---

### Issue: "Missing Clerk Publishable Key"

**Symptoms**:
- Error message on page load
- Console error about Clerk key

**Solutions**:
1. Check Vercel env vars: `VITE_CLERK_PUBLISHABLE_KEY`
2. Must start with `VITE_` prefix
3. Redeploy after adding
4. Clear browser cache

---

### Issue: Token Not Being Sent

**Symptoms**:
- API calls return 401
- No `Authorization` header in requests

**Solutions**:
1. Check `useClerkAPI` hook is being used
2. Verify `getToken()` is called correctly
3. Check Clerk session is active
4. Try signing out and back in

---

## 📊 Testing Checklist Summary

### Local Testing
- [ ] Backend health check passes
- [ ] Can register new account
- [ ] Can sign in
- [ ] Protected routes work
- [ ] API calls authenticated
- [ ] User profile shows data
- [ ] Can sign out
- [ ] No console errors

### Production Testing
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Health check passes in production
- [ ] Can register on production
- [ ] Can sign in on production
- [ ] Protected routes work in production
- [ ] API calls work in production
- [ ] CORS configured correctly
- [ ] No console errors in production
- [ ] User appears in Clerk Dashboard

---

## 🔍 Debug Commands

### Check Backend Logs (Local)
```bash
cd server
npm start
# Watch for "Clerk verification error" or similar
```

### Check Frontend Console (Browser)
```
F12 → Console tab
# Look for Clerk errors or API errors
```

### Test API Manually
```bash
# Get token from DevTools → Application → Local Storage → Clerk token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/user/profile
```

### Check Render Logs
```
1. Go to dashboard.render.com
2. Click your service
3. Click "Logs" tab
4. Look for errors
```

### Check Vercel Logs
```
1. Go to vercel.com/dashboard
2. Click your project
3. Click "Logs" tab
4. Look for build or runtime errors
```

---

## ✅ Success Indicators

**Everything works if**:
- ✅ Health check returns `clerkConfigured: true`
- ✅ Can register and sign in
- ✅ Protected routes accessible when logged in
- ✅ API calls return 200 (not 401)
- ✅ User profile shows correct data
- ✅ No console errors
- ✅ Sign out works properly
- ✅ New users appear in Clerk Dashboard

---

## 📞 Still Having Issues?

1. **Check Documentation**:
   - [AUTHENTICATION_SUMMARY.md](AUTHENTICATION_SUMMARY.md)
   - [CLERK_DEPLOYMENT.md](CLERK_DEPLOYMENT.md)
   - [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

2. **Check Clerk Docs**: https://clerk.com/docs

3. **Check Logs**:
   - Render backend logs
   - Vercel build logs
   - Browser console
   - Network tab in DevTools

4. **Common Fixes**:
   - Clear browser cache/cookies
   - Restart backend service
   - Redeploy frontend
   - Verify all env vars are set
   - Check Clerk Dashboard settings

---

**Happy Testing! 🧪✅**
