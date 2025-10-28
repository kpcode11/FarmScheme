import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema(
  {
    type: { type: String, required: true },
    url: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profile: {
      age: Number,
      gender: String,
      income: Number,
      state: String,
      district: String,
      category: String,
      occupation: String,
      landHolding: Number,
    },
    documents: [documentSchema],
    savedSchemes: [{ type: Schema.Types.ObjectId, ref: "schemes" }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);


