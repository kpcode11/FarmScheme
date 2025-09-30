import mongoose, { Schema } from "mongoose";

const schemeScheme = new Schema(
  {
    scheme_name: {
      type: String,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    details: {
      type: String,
    },
    benefits: {
      type: String,
    },
    eligibility: {
      type: String,
    },
    application: {
      type: String,
    },
    documents: {
      type: String,
    },
    level: {
      type: String,
    },
    schemeCategory: {
      type: String,
    },
    tags: {
      type: Array,
      lowercase: true,
    },
    States: {
      type: String,
    },
    eligibilityQuestions: [
      new Schema(
        {
          key: { type: String, required: true },
          question: { type: String, required: true },
          expectedAnswer: { type: String, enum: ["yes", "no"], required: true },
          failureMessage: { type: String },
        },
        { _id: false }
      ),
    ],
  },
  {
    timestamps: true,
  }
);

export const schemes = mongoose.model("schemes", schemeScheme);
