
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  language: {
    type: String,
    required: true,
    default: "C"
  },
  code: {
    type: String,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Submission", submissionSchema);
