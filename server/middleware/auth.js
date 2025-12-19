import { clerkClient, verifyToken } from "@clerk/clerk-sdk-node";

export const authRequired = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    try {
      // Verify the Clerk session token using verifyToken
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      
      if (!payload || !payload.sub) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }

      // Get user information from Clerk
      const user = await clerkClient.users.getUser(payload.sub);
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        clerkId: user.id,
      };
      
      next();
    } catch (verifyError) {
      console.error("Clerk verification error:", verifyError);
      return res.status(401).json({ message: "Unauthorized - Token verification failed" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};


