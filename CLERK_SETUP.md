# Clerk Authentication Setup Guide

This project now uses [Clerk](https://clerk.com) for authentication instead of custom JWT-based authentication. Follow these steps to set up Clerk for your application.

## 📋 Prerequisites

- Node.js installed
- A Clerk account (free tier available at https://clerk.com)

## 🚀 Setup Instructions

### 1. Create a Clerk Application

1. Go to https://dashboard.clerk.com and sign up/login
2. Click "Add application"
3. Choose a name for your application
4. Select the authentication methods you want (Email, Google, GitHub, etc.)
5. Click "Create application"

### 2. Get Your API Keys

After creating your application, you'll see your API keys:

- **Publishable Key** (starts with `pk_test_` or `pk_live_`)
- **Secret Key** (starts with `sk_test_` or `sk_live_`)

⚠️ **Important**: Keep your Secret Key secure and never commit it to version control!

### 3. Configure Environment Variables

#### Frontend (.env in client/Learning/)

Create a `.env` file in `client/Learning/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_KEY=your-google-maps-api-key
```

Replace `pk_test_your_publishable_key_here` with your actual Clerk Publishable Key.

#### Backend (.env in server/)

Create or update your `.env` file in the `server/` directory:

```env
PORT=3000
MONGODB_URL=mongodb+srv://your-username:your-password@your-cluster.mongodb.net
DB_NAME=farmers
CORS_ORIGIN=http://localhost:5173

# Clerk Keys
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Cloudinary (if using image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Replace the Clerk keys with your actual keys from the Clerk dashboard.

### 4. Install Dependencies

If you haven't already, install the required packages:

#### Frontend
```bash
cd client/Learning
npm install @clerk/clerk-react
```

#### Backend
```bash
cd server
npm install @clerk/clerk-sdk-node
```

### 5. Start Your Application

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd client/Learning
npm run dev
```

## 🔑 Key Changes from Custom Auth

### What Changed:

1. **Login/Register**: Now handled by Clerk's pre-built components with social login support
2. **Session Management**: Clerk automatically manages user sessions
3. **Password Reset**: Handled by Clerk (no custom implementation needed)
4. **User Profile**: Clerk provides a built-in user profile management
5. **Security**: Industry-standard security managed by Clerk

### Authentication Flow:

```
User → Login/Register via Clerk → Session Token → Backend Validates Token with Clerk
```

## 📱 Features You Get with Clerk

- ✅ **Email/Password Authentication**
- ✅ **Social Login** (Google, GitHub, Facebook, etc.)
- ✅ **Magic Links** (passwordless login)
- ✅ **Multi-Factor Authentication** (2FA)
- ✅ **Email Verification**
- ✅ **Password Reset**
- ✅ **User Profile Management**
- ✅ **Session Management**
- ✅ **Security Best Practices**

## 🎨 Customizing Clerk Components

You can customize the appearance of Clerk components in your code:

```jsx
<SignIn 
  appearance={{
    elements: {
      card: "bg-white shadow-lg rounded-xl",
      headerTitle: "text-2xl font-bold",
      // ... more customization
    }
  }}
/>
```

## 🔧 Backend API Changes

### Protected Routes

Protected routes now verify Clerk session tokens. The `authRequired` middleware extracts user information from Clerk:

```javascript
// Example protected route
router.get('/me', authRequired, (req, res) => {
  // req.user contains: { id, email, name, firstName, lastName, imageUrl }
  res.json({ user: req.user });
});
```

### User Object Structure

The authenticated user object from Clerk contains:
```javascript
{
  id: "user_xxxxxxxxxxxxx",
  email: "user@example.com",
  name: "John Doe",
  firstName: "John",
  lastName: "Doe",
  imageUrl: "https://..."
}
```

## 🐛 Troubleshooting

### Issue: "Missing Clerk Publishable Key" Error

**Solution**: Make sure you have created a `.env` file in `client/Learning/` with your Clerk Publishable Key.

### Issue: Backend 401 Unauthorized

**Solution**: 
1. Check that your Clerk Secret Key is set in the backend `.env` file
2. Ensure you're passing the session token in API requests
3. Verify your Clerk application settings

### Issue: Infinite Loading on Login

**Solution**: Clear your browser cache and localStorage, then try again.

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk Node.js SDK](https://clerk.com/docs/references/nodejs/overview)

## 🔄 Migration Notes

If you're migrating from the old custom authentication:

1. Existing users will need to create new accounts with Clerk
2. Old JWT tokens are no longer valid
3. The old User model in MongoDB can be deprecated
4. Update any hardcoded auth logic to use Clerk

## ❓ Support

If you encounter any issues:
1. Check the [Clerk Status Page](https://status.clerk.com)
2. Visit [Clerk Discord Community](https://clerk.com/discord)
3. Contact Clerk Support through your dashboard

---

Happy Coding! 🎉
