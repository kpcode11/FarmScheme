/**
 * Helper functions for working with Clerk authentication
 */

/**
 * Check if user is authenticated using Clerk
 */
export const isAuthenticated = (user) => {
  return user !== null && user !== undefined;
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return "Guest";
  return user.name || user.firstName || user.email?.split("@")[0] || "User";
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user) => {
  if (!user) return "?";
  
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  
  if (user.name) {
    const parts = user.name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }
  
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  
  return "U";
};

/**
 * Handle Clerk-specific errors
 */
export const handleClerkError = (error) => {
  if (error.message?.includes("Clerk")) {
    return "Authentication error. Please try again.";
  }
  
  if (error.status === 401) {
    return "Session expired. Please sign in again.";
  }
  
  if (error.status === 403) {
    return "You don't have permission to perform this action.";
  }
  
  return error.message || "An unexpected error occurred.";
};

/**
 * Redirect to sign-in with return URL
 */
export const redirectToSignIn = (returnUrl = window.location.pathname) => {
  const url = `/login?redirect_url=${encodeURIComponent(returnUrl)}`;
  window.location.href = url;
};
