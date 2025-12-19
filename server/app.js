import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables first
dotenv.config({ path: "./.env" });

// Verify Clerk environment variables
if (!process.env.CLERK_SECRET_KEY) {
  console.warn("⚠️  WARNING: CLERK_SECRET_KEY is not set. Authentication will fail.");
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed from this origin"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

//Import Routes and definition of routes
import schemesRouter from "./routes/schemes.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import ttsRouter from "./routes/tts.routes.js";
import chatbotRouter from "./routes/chatbot.routes.js";

app.use("/api/v1/schemes", schemesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tts", ttsRouter);
app.use("/api/v1/chatbot", chatbotRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    clerkConfigured: !!process.env.CLERK_SECRET_KEY
  });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message, errors: err.errors || [] });
});

export default app;
