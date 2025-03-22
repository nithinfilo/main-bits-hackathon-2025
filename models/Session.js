import mongoose from 'mongoose';

// Define a schema for the goal
const GoalSchema = new mongoose.Schema({
  question: { type: String, required: true },
  rationale: { type: String, required: true },
  visualization: { type: String, required: true },
});

// Define a schema for the visualization
const VisualizationSchema = new mongoose.Schema({
  code: String,
  raster: String,
  goal: String,
  instruction: String,
});

// Define the session schema
const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  datasetUrl: String,
  datasetSummary: Object,
  goals: [GoalSchema], // Updated to accept an array of Goal objects
  visualizations: [VisualizationSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
