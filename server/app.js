import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//Import Routes and definition of routes
import schemesRouter from "./routes/schemes.routes.js";

app.use("/api/v1/schemes", schemesRouter);

export default app;
