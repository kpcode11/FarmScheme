import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { connect } from "mongoose";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 9000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
  });
