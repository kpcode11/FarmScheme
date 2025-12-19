# ✨ Clerk Authentication Integration

## Overview

Your application now uses **Clerk** for authentication instead of custom JWT-based authentication. Clerk provides enterprise-grade authentication with minimal setup.

## 🎯 Key Features

- ✅ **Email/Password Authentication**
- ✅ **Social Login** (Google, GitHub, Facebook, etc.)
- ✅ **Magic Links** (Passwordless login)
- ✅ **Multi-Factor Authentication (2FA)**
- ✅ **Email Verification**
- ✅ **Password Management**
- ✅ **User Profile Management**
- ✅ **Session Management**
- ✅ **Security Best Practices**

## 📦 Installation Commands

If you need to reinstall dependencies:

### Backend
```bash
cd server
npm install
```

### Frontend  
```bash
cd client/Learning
npm install
```

## 🔑 Getting Your Clerk API Keys

1. Go to https://dashboard.clerk.com
2. Sign up or log in
3. Click "Add application"
4. Name your application (e.g., "Government Schemes Portal")
5. Select authentication methods (Email, Google, etc.)
6. Click "Create application"
7. Copy your **Publishable Key** and **Secret Key**

## ⚙️ Configuration

### Frontend Environment Variables

Create `.env` file in `client/Learning/`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_KEY=your-google-maps-api-key
```

### Backend Environment Variables

Create or update `.env` file in `server/`:

```env
PORT=3000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=farmers
CORS_ORIGIN=http://localhost:5173

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

Server will start on `http://localhost:3000`

### Start Frontend (Terminal 2)
```bash
cd client/Learning
npm run dev
```

Frontend will start on `http://localhost:5173`

## 📱 Using Authentication in Your Code

### Accessing User Information

```javascript
import { useAuth } from '../../hooks/useAuth';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <img src={user.imageUrl} alt="Profile" />
    </div>
  );
}
```

### Making Authenticated API Requests

```javascript
import { useClerkAPI } from '../hooks/useClerkAPI';

function DataComponent() {
  const api = useClerkAPI();
  
  const fetchData = async () => {
    try {
      const response = await api.get('/protected-endpoint');
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const createData = async (data) => {
    try {
      const response = await api.post('/endpoint', data);
      console.log('Created:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return <button onClick={fetchData}>Fetch Data</button>;
}
```

### Protecting Routes

```javascript
import RequireAuth from './components/Auth/RequireAuth';

// In your router
<Route 
  path="/protected" 
  element={
    <RequireAuth>
      <ProtectedPage />
    </RequireAuth>
  } 
/>
```

### Using Clerk Components Directly

```javascript
import { UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';

function Header() {
  const { user } = useAuth();
  
  return (
    <header>
      {user ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <div>
          <SignInButton mode="modal">
            <button>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button>Sign Up</button>
          </SignUpButton>
        </div>
      )}
    </header>
  );
}
```

## 🎨 Customizing Clerk UI

You can customize the appearance of Clerk components:

```javascript
<SignIn 
  appearance={{
    elements: {
      card: "shadow-xl rounded-2xl",
      headerTitle: "text-2xl font-bold text-blue-600",
      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600",
    }
  }}
/>
```

## 🔐 Backend API Authentication

Protected routes automatically verify Clerk tokens:

```javascript
// Example protected route in Express
router.get('/api/v1/protected', authRequired, (req, res) => {
  // req.user contains Clerk user info
  res.json({ 
    message: 'Protected data',
    user: req.user 
  });
});
```

User object structure:
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

### "Missing Clerk Publishable Key" Error
- Check `.env` file exists in `client/Learning/`
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set
- Restart the dev server after adding the key

### 401 Unauthorized on API Calls
- Verify Clerk Secret Key is set in backend `.env`
- Check that user is signed in
- Clear browser cache and try again

### Infinite Loading
- Clear browser localStorage
- Sign out and sign in again
- Check browser console for errors

### Clerk Dashboard Not Showing Users
- Users are created automatically on sign-up
- Check your Clerk dashboard Users section
- Verify webhook configuration (if using)

## 📚 Additional Resources

- **Clerk Documentation**: https://clerk.com/docs
- **React SDK Guide**: https://clerk.com/docs/references/react/overview
- **Node.js SDK Guide**: https://clerk.com/docs/references/nodejs/overview
- **Customization**: https://clerk.com/docs/components/customization/overview

## 🔄 Migration from Old Auth

If migrating from the previous JWT authentication:
- ❌ Old user passwords are NOT transferred
- ✅ Users must create new Clerk accounts
- ✅ Old JWT tokens are invalid
- ✅ User data can be migrated separately if needed

## 🔗 Useful Links

- [Setup Guide](./CLERK_SETUP.md) - Detailed setup instructions
- [Migration Guide](./CLERK_MIGRATION.md) - What changed in the migration
- [Clerk Status](https://status.clerk.com) - Service status
- [Clerk Discord](https://clerk.com/discord) - Community support

---

Need help? Check the documentation files or reach out to the development team! 🚀
