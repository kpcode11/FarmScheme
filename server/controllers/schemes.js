import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { schemes as SchemeModel } from "../models/schemes.models.js";

//Get all the schemes (with filtering, search, pagination, sorting)
const getAllschemes = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const { level, schemeCategory, tags, q, sort } = req.query;

  const filter = {};

  if (level && level !== "all") {
    filter.level = { $in: level.split(",").map((s) => s.trim()).filter(Boolean) };
  }

  if (schemeCategory) {
    const categories = schemeCategory
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (categories.length === 1) {
      const esc = categories[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.schemeCategory = new RegExp(`^${esc}$`, "i");
    } else if (categories.length > 1) {
      const regs = categories.map((c) => {
        const esc = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`^${esc}$`, "i");
      });
      filter.schemeCategory = { $in: regs };
    }
  }

  if (tags) {
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tagList.length) {
      const regexes = tagList.map((t) => {
        const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`^${esc}$`, "i");
      });
      filter.tags = { $all: regexes };
    }
  }

  if (q && q.trim().length > 0) {
    const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safe, "i");
    filter.$or = [
      { scheme_name: regex },
      { details: regex },
      { benefits: regex },
      { eligibility: regex },
      { documents: regex },
      { schemeCategory: regex },
      { level: regex },
      // For arrays of strings, direct field: regex matches any element
      { tags: regex },
    ];
  }

  let sortSpec = { createdAt: -1 };
  if (typeof sort === "string" && sort.length > 0) {
    const [field, dirRaw] = sort.split(":");
    const dir = (dirRaw || "desc").toLowerCase();
    if (field) sortSpec = { [field]: dir === "asc" ? 1 : -1 };
  }

  const totalschemes = await SchemeModel.countDocuments(filter);
  const allSchemes = await SchemeModel.find(filter)
    .sort(sortSpec)
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        scheme: allSchemes,
        CurrentPage: page,
        TotalPages: Math.ceil(totalschemes / limit),
        TotalSchemes: totalschemes,
      },
      allSchemes.length ? "Schemes Fetched Successfully" : "No schemes found"
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
