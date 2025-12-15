import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Python chatbot service URL
const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || "http://localhost:5001";

// Chat with the bot
export const chat = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    throw new ApiError(400, "Question is required");
  }

  try {
    // Forward request to Python chatbot service
    const response = await fetch(`${CHATBOT_SERVICE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: question.trim() }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Chatbot service error");
    }

    const data = await response.json();

    return res.status(200).json(
      new ApiResponse(200, data.data, "Chat response generated")
    );
  } catch (error) {
    console.error("Chatbot service error:", error);
    throw new ApiError(503, "Chatbot service is currently unavailable. Please try again later.");
  }
});

// Get suggested questions
export const getSuggestions = asyncHandler(async (req, res) => {
  try {
    const response = await fetch(`${CHATBOT_SERVICE_URL}/api/suggestions`);

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch suggestions");
    }

    const data = await response.json();

    return res.status(200).json(
      new ApiResponse(200, data.data, "Suggestions fetched")
    );
  } catch (error) {
    console.error("Suggestions fetch error:", error);
    // Return fallback suggestions if service is down
    return res.status(200).json(
      new ApiResponse(200, {
        suggestions: [
          "What schemes are available for small farmers?",
          "How can I apply for PM-KISAN?",
          "What are the eligibility criteria for agricultural subsidies?",
          "Which schemes provide financial assistance?",
        ],
      }, "Suggestions fetched (fallback)")
    );
  }
});

// Health check for chatbot service
export const healthCheck = asyncHandler(async (req, res) => {
  try {
    const response = await fetch(`${CHATBOT_SERVICE_URL}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    const data = await response.json();

    return res.status(response.ok ? 200 : 503).json(
      new ApiResponse(response.ok ? 200 : 503, data, response.ok ? "Chatbot service healthy" : "Chatbot service unhealthy")
    );
  } catch (error) {
    return res.status(503).json(
      new ApiResponse(503, { status: "unavailable", error: error.message }, "Chatbot service unavailable")
    );
  }
});
