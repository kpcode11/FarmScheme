import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, "Missing fields");

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user._id.toString());

  return res
    .status(201)
    .json(new ApiResponse(201, { token, user: { ...user.toObject(), passwordHash: undefined } }, "Registered"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Missing fields");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = signToken(user._id.toString());
  return res
    .status(200)
    .json(new ApiResponse(200, { token, user: { ...user.toObject(), passwordHash: undefined } }, "Logged in"));
});

export const me = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json(new ApiResponse(200, user, "Current user"));
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json(new ApiResponse(200, {}, "If the email exists, a reset link was sent"));

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
  await user.save();

  // In production, send an email with the token link. For dev, return the token.
  return res.status(200).json(new ApiResponse(200, { token }, "Reset token generated"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) throw new ApiError(400, "Missing fields");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) throw new ApiError(400, "Invalid or expired token");
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return res.status(200).json(new ApiResponse(200, {}, "Password reset successful"));
});


