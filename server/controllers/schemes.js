import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { schemes as SchemeModel } from "../models/schemes.models.js";

//Get all the schemes (included pagination)
const getAllschemes = asyncHandler(async (req, res) => {
  // Change from req.params to req.query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // console.log("Pagination params:", { page, limit, skip }); // Debug log

  const totalschemes = await SchemeModel.countDocuments();
  const allSchemes = await SchemeModel.find({}).skip(skip).limit(limit);

  if (!allSchemes.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          scheme: [],
          CurrentPage: page,
          TotalPages: Math.ceil(totalschemes / limit),
          TotalSchemes: totalschemes,
        },
        "No schemes found"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        scheme: allSchemes,
        CurrentPage: page,
        TotalPages: Math.ceil(totalschemes / limit),
        TotalSchemes: totalschemes, // Add total count
      },
      "Schemes Fetched Successfully"
    )
  );
});

// Get all State Level schemes (pagination included)
const getStateSchemes = asyncHandler(async (req, res) => {
  // Change from req.params to req.query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalschemes = await SchemeModel.countDocuments({ level: "State" });
  const allStateSchemes = await SchemeModel.find({ level: "State" })
    .skip(skip)
    .limit(limit);

  if (!allStateSchemes.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          scheme: [],
          CurrentPage: page,
          TotalPages: Math.ceil(totalschemes / limit),
          TotalSchemes: totalschemes,
        },
        "No State schemes found"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        scheme: allStateSchemes,
        CurrentPage: page,
        TotalPages: Math.ceil(totalschemes / limit),
        TotalSchemes: totalschemes,
      },
      "State Level Schemes fetched successfully"
    )
  );
});

// Get all Central Level schemes (pagination included)
const getCentralSchemes = asyncHandler(async (req, res) => {
  // Change from req.params to req.query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalschemes = await SchemeModel.countDocuments({ level: "Central" });
  const allCentralSchemes = await SchemeModel.find({ level: "Central" })
    .skip(skip)
    .limit(limit);

  if (!allCentralSchemes.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          scheme: [],
          CurrentPage: page,
          TotalPages: Math.ceil(totalschemes / limit),
          TotalSchemes: totalschemes,
        },
        "No Central schemes found"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        scheme: allCentralSchemes,
        CurrentPage: page,
        TotalPages: Math.ceil(totalschemes / limit),
        TotalSchemes: totalschemes,
      },
      "Central Level Schemes fetched successfully"
    )
  );
});

// Get Schemes by Id - MOVED OUTSIDE and FIXED
const getSchemeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const scheme = await SchemeModel.findById(id);

  if (!scheme) {
    throw new ApiError(404, "Scheme not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, scheme, "Scheme fetched successfully"));
});

export { getAllschemes, getStateSchemes, getCentralSchemes, getSchemeById };
