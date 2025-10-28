import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Fetched profile"));
});

export const updateMe = asyncHandler(async (req, res) => {
  const updates = req.body || {};
  // Prevent sensitive fields from being updated directly
  delete updates.passwordHash;
  delete updates.role;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");

  return res.status(200).json(new ApiResponse(200, user, "Updated profile"));
});


