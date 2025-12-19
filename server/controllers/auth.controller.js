import { clerkClient } from "@clerk/clerk-sdk-node";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Clerk handles authentication on the frontend
// These endpoints are now simplified or can sync Clerk users with your DB if needed

export const me = asyncHandler(async (req, res) => {
  // User info is already attached by the authRequired middleware from Clerk
  const user = req.user;
  return res.status(200).json(new ApiResponse(200, user, "Current user"));
});

// Optional: Webhook handler to sync Clerk users with your database
export const clerkWebhook = asyncHandler(async (req, res) => {
  const { type, data } = req.body;
  
  switch (type) {
    case "user.created":
      // Optionally sync user to your database
      console.log("User created:", data);
      break;
    case "user.updated":
      console.log("User updated:", data);
      break;
    case "user.deleted":
      console.log("User deleted:", data);
      break;
    case "session.created":
      console.log("Session created:", data);
      break;
    default:
      console.log("Unhandled webhook type:", type);
  }
  
  return res.status(200).json({ received: true });
});


