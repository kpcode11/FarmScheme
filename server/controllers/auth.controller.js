import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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


