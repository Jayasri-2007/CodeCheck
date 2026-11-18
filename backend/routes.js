
const express = require("express");
const router = express.Router();

const { validateSyntax } = require("./parser");
const Submission = require("./models/Submission");
const User = require("./models/User");
const verifyToken = require("./auth-middleware");

// Get Logged-in Student's Submission History
router.get("/history", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Students only."
      });
    }

    const submissions = await Submission.find({
      userId: req.user.id
    })
      .sort({ submittedAt: -1 })
      .limit(50);

    res.json(submissions);
  } catch (error) {
    console.log("History Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch submission history."
    });
  }
});

// Validate and Save Student Submission
router.post("/validate", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Students only."
      });
    }

    const { studentName, language, code } = req.body;

    if (
      typeof studentName !== "string" ||
      !studentName.trim() ||
      typeof code !== "string" ||
      !code.trim() ||
      !language
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide student name, language and source code."
      });
    }

    if (language !== "C") {
      return res.status(400).json({
        success: false,
        message: "Currently only C language is supported."
      });
    }

    const result = validateSyntax(code);

    const submission = await Submission.create({
      studentName: studentName.trim(),
      userId: req.user.id,
      language,
      code,
      success: result.success,
      message: result.message
    });

    res.json({
      submissionId: submission._id,
      studentName: studentName.trim(),
      language,
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.log("Validation API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

// ADMIN: Get All Student Submissions with Student Email
router.get("/admin/submissions", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    const submissions = await Submission.find()
      .sort({ submittedAt: -1 })
      .lean();

    const users = await User.find(
      { role: "student" },
      { name: 1, email: 1 }
    ).lean();

    const userMap = {};

    users.forEach((user) => {
      userMap[user._id.toString()] = {
        email: user.email,
        registeredName: user.name
      };
    });

    const result = submissions.map((item) => {
      const student = item.userId
        ? userMap[item.userId.toString()]
        : null;

      return {
        ...item,
        studentEmail: student?.email || "Not available",
        registeredName: student?.registeredName || item.studentName
      };
    });

    res.json(result);
  } catch (error) {
    console.log("Admin Submissions Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch student submissions."
    });
  }
});

module.exports = router;
