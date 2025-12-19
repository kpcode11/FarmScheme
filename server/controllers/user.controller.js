import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinary } from "../utils/cloudinary.js";

export const getMe = asyncHandler(async (req, res) => {
  // Find user by Clerk ID or email (for migration from old auth)
  let user = await User.findOne({ 
    $or: [
      { clerkId: req.user.clerkId },
      { email: req.user.email }
    ]
  });
  
  if (!user) {
    // Create new user if doesn't exist
    user = await User.create({
      clerkId: req.user.clerkId,
      name: req.user.name || "User",
      email: req.user.email,
      phone: req.user.phone || "",
      passwordHash: "clerk-managed",
    });
  } else if (!user.clerkId) {
    // Update existing user with Clerk ID (migration)
    user.clerkId = req.user.clerkId;
    await user.save();
  }
  
  return res.status(200).json(new ApiResponse(200, user, "Fetched profile"));
});

export const updateMe = asyncHandler(async (req, res) => {
  const updates = req.body || {};
  // Prevent sensitive fields from being updated directly
  delete updates.passwordHash;
  delete updates.role;
  delete updates.clerkId;
  delete updates.email;

  // Find user by Clerk ID or email
  let user = await User.findOne({ 
    $or: [
      { clerkId: req.user.clerkId },
      { email: req.user.email }
    ]
  });
  
  if (!user) {
    user = await User.create({
      clerkId: req.user.clerkId,
      name: req.user.name || "User",
      email: req.user.email,
      phone: req.user.phone || "",
      passwordHash: "clerk-managed",
    });
  } else if (!user.clerkId) {
    user.clerkId = req.user.clerkId;
  }

  // Update user
  Object.assign(user, updates);
  await user.save();

  return res.status(200).json(new ApiResponse(200, user, "Updated profile"));
});

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");
  
  const { type } = req.body;
  const folder = process.env.CLOUDINARY_FOLDER || "farmer-sahayak/docs";
  
  // upload_stream returns a writable stream; wrap in Promise
  const streamUpload = () => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder, 
          resource_type: "auto",
          allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp']
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(new ApiError(500, `Cloud upload failed: ${error.message}`));
          }
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
  };
  
  const result = await streamUpload();
  
  // Find user by Clerk ID or email
  let user = await User.findOne({ 
    $or: [
      { clerkId: req.user.clerkId },
      { email: req.user.email }
    ]
  });
  
  if (!user) {
    user = await User.create({
      clerkId: req.user.clerkId,
      name: req.user.name || "User",
      email: req.user.email,
      phone: req.user.phone || "",
      passwordHash: "clerk-managed",
    });
  } else if (!user.clerkId) {
    user.clerkId = req.user.clerkId;
  }
  
  user.documents.push({ 
    type: type || "other", 
    url: result.secure_url,
    publicId: result.public_id
  });
  
  await user.save();
  
  return res.status(201).json(
    new ApiResponse(201, user.documents[user.documents.length - 1], "Document uploaded successfully")
  );
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  
  // Find user by Clerk ID or email
  let user = await User.findOne({ 
    $or: [
      { clerkId: req.user.clerkId },
      { email: req.user.email }
    ]
  });
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  // Update clerkId if not set (migration)
  if (!user.clerkId) {
    user.clerkId = req.user.clerkId;
  }
  
  // Find the document
  const doc = user.documents.find((d) => d._id && d._id.toString() === docId);
  if (!doc) throw new ApiError(404, "Document not found");
  
  // Delete from Cloudinary if publicId exists
  if (doc.publicId) {
    try {
      await cloudinary.uploader.destroy(doc.publicId);
      console.log(`Deleted file from Cloudinary: ${doc.publicId}`);
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      // Continue with database deletion even if Cloudinary deletion fails
    }
  }
  
  // Remove from user documents
  user.documents = user.documents.filter((d) => d._id && d._id.toString() !== docId);
  await user.save();
  
  return res.status(200).json(new ApiResponse(200, {}, "Document deleted successfully"));
});

export const getSavedSchemes = asyncHandler(async (req, res) => {
  // Find user by Clerk ID or email
  let user = await User.findOne({ 
    $or: [
      { clerkId: req.user.clerkId },
      { email: req.user.email }
    ]
  }).populate({ path: "savedSchemes", model: "schemes" });
  
  if (!user) {
    user = await User.create({
      clerkId: req.user.clerkId,
      name: req.user.name || "User",
      email: req.user.email,
      phone: req.user.phone || "",
      passwordHash: "clerk-managed",
    });
  } else if (!user.clerkId) {
    user.clerkId = req.user.clerkId;
    await user.save();
  }
  
  return res.status(200).json(new ApiResponse(200, user.savedSchemes || [], "Saved schemes"));
});

export const saveScheme = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;
  if (!schemeId) throw new ApiError(400, "Missing schemeId");
  
  // Find user by Clerk ID or email
  let user = await User.findOne({ 
    $or: [
      { clerkId: req.user.clerkId },
      { email: req.user.email }
    ]
  });
  
  if (!user) {
    user = await User.create({
      clerkId: req.user.clerkId,
      name: req.user.name || "User",
      email: req.user.email,
      phone: req.user.phone || "",
      passwordHash: "clerk-managed",
    });
  } else if (!user.clerkId) {
    user.clerkId = req.user.clerkId;
  }
  
  const exists = (user.savedSchemes || []).some((id) => id.toString() === schemeId);
  if (!exists) user.savedSchemes.push(schemeId);
  await user.save();
  return res.status(200).json(new ApiResponse(200, { saved: true }, "Scheme saved"));
});

export const removeSavedScheme = asyncHandler(async (req, res) => {
  const { schemeId } = req.params;
  if (!schemeId) throw new ApiError(400, "Missing schemeId");
  
  // Find user by Clerk ID or email
  let user = await User.findOne({ 
    $or: [
      { clerkId: req.user.clerkId },
      { email: req.user.email }
    ]
  });
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  if (!user.clerkId) {
    user.clerkId = req.user.clerkId;
  }
  
  user.savedSchemes = (user.savedSchemes || []).filter((id) => id.toString() !== schemeId);
  await user.save();
  return res.status(200).json(new ApiResponse(200, { saved: false }, "Scheme removed"));
});


