import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinary } from "../utils/cloudinary.js";

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

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");
  const { type } = req.body;
  const folder = process.env.CLOUDINARY_FOLDER || "farmer-sahayak/docs";
  const uploadResult = await cloudinary.uploader.upload_stream(
    { folder, resource_type: "auto" },
    async (error, result) => {
      if (error) throw new ApiError(500, "Cloud upload failed");
    }
  );
  // upload_stream returns a writable stream; wrap in Promise
  const streamUpload = () => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
  };
  const result = await streamUpload();
  const user = await User.findById(req.user._id);
  user.documents.push({ type: type || "other", url: result.secure_url });
  await user.save();
  return res.status(201).json(new ApiResponse(201, user.documents[user.documents.length - 1], "Document uploaded"));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const user = await User.findById(req.user._id);
  const before = user.documents.length;
  user.documents = user.documents.filter((d) => d._id && d._id.toString() !== docId);
  if (user.documents.length === before) throw new ApiError(404, "Document not found");
  await user.save();
  return res.status(200).json(new ApiResponse(200, {}, "Document deleted"));
});


