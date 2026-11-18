const mongoose = require("mongoose");

async function preview() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/CodeCheck");

    const docs = await mongoose.connection.db
      .collection("submissions")
      .find({
        $or: [
          { success: { $exists: false } },
          { message: { $exists: false } },
          { submittedAt: { $exists: false } }
        ]
      })
      .toArray();

    console.log("Matching records:", docs.length);

    docs.forEach((d, i) => {
      console.log(i + 1, JSON.stringify({
        _id: d._id,
        studentName: d.studentName,
        language: d.language,
        success: d.success,
        message: d.message,
        submittedAt: d.submittedAt
      }));
    });
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

preview();
