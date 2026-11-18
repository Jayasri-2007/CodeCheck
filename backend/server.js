
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Code Submission Routes
const codeRoutes = require("./routes");
app.use("/api", codeRoutes);

// Authentication Routes
const authRoutes = require("./routes-auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("CodeCheck Backend Running Successfully!");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/CodeCheck"
)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open in browser: http://localhost:${PORT}`);
});
