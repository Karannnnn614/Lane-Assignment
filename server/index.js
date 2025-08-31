import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins temporarily for debugging
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Bug", "Feature", "Improvement"],
  },
  votes: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Routes
// GET /feedback - List feedback with optional query params
app.get("/feedback", async (req, res) => {
  try {
    const { sort, category, q } = req.query;

    // Build query
    const query = {};
    if (category && category !== "all") {
      query.category = category;
    }
    if (q) {
      query.title = { $regex: q, $options: "i" };
    }

    // Build sort
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const feedback = await Feedback.find(query).sort(sortOption);
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// POST /feedback - Create feedback
app.post("/feedback", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Server-side validation
    if (!title || !description || !category) {
      return res.status(400).json({
        error: "Title, description, and category are required",
      });
    }

    if (!["Bug", "Feature", "Improvement"].includes(category)) {
      return res.status(400).json({
        error: "Category must be Bug, Feature, or Improvement",
      });
    }

    const feedback = new Feedback({
      title: title.trim(),
      description: description.trim(),
      category,
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create feedback" });
  }
});

// PUT /feedback/:id/vote - Upvote feedback
app.put("/feedback/:id/vote", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json(feedback);
  } catch (error) {
    console.error("Error voting on feedback:", error);
    res.status(500).json({ error: "Failed to vote on feedback" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
