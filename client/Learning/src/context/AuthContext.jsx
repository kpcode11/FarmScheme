import React, { createContext, useEffect, useMemo, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && clerkUser) {
        setUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [isSignedIn, isLoaded, clerkUser]);

  const value = useMemo(() => ({ 
    user, 
    loading,
    // These are kept for backward compatibility but Clerk handles auth differently
    login: () => console.warn("Use Clerk's SignIn component"),
    register: () => console.warn("Use Clerk's SignUp component"),
    logout: () => console.warn("Use Clerk's signOut method"),
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


