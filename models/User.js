import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// USER SCHEMA
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    variantId: {
      type: String,
    },
    customerId: {
      type: String,
    },
    image: {
      type: String,
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
    // Adding credits field to track user credits
    credits: {
      type: Number,
      default: 0,  // Set initial value to 0
      min: 0,      // Ensure the value doesn't go below 0
    },
    // Adding trialEndsAt field to track the end of the trial period
    trialEndsAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);
