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

// Get eligibility questions for a scheme
const getEligibilityQuestions = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const scheme = await SchemeModel.findById(id).select("eligibilityQuestions scheme_name");
  if (!scheme) {
    throw new ApiError(404, "Scheme not found");
  }

  const questions = Array.isArray(scheme.eligibilityQuestions)
    ? scheme.eligibilityQuestions
    : [];

  return res.status(200).json(
    new ApiResponse(200, { questions, schemeId: id, schemeName: scheme.scheme_name }, "Eligibility questions fetched")
  );
});

// Check eligibility by evaluating provided answers against expected answers
const checkEligibility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body || {};

  const scheme = await SchemeModel.findById(id).select("eligibilityQuestions scheme_name");
  if (!scheme) {
    throw new ApiError(404, "Scheme not found");
  }

  const questions = Array.isArray(scheme.eligibilityQuestions)
    ? scheme.eligibilityQuestions
    : [];

  if (!answers || typeof answers !== "object") {
    throw new ApiError(400, "Invalid answers payload");
  }

  const failures = [];
  for (const q of questions) {
    const provided = (answers[q.key] || "").toString().toLowerCase();
    const expected = (q.expectedAnswer || "").toString().toLowerCase();

    if (provided !== "yes" && provided !== "no") {
      failures.push({ key: q.key, question: q.question, reason: "Answer must be 'yes' or 'no'" });
      continue;
    }

    if (expected && provided !== expected) {
      failures.push({ key: q.key, question: q.question, reason: q.failureMessage || `Expected answer: ${expected.toUpperCase()}` });
    }
  }

  const eligible = failures.length === 0;

  return res.status(200).json(
    new ApiResponse(200, { eligible, failures }, eligible ? "Eligible" : "Not eligible")
  );
});

export { getAllschemes, getStateSchemes, getCentralSchemes, getSchemeById, getEligibilityQuestions, checkEligibility };
