const mongoose = require("mongoose");
const fs = require("fs");

const ids = [
  "6af828f5b5d899cf576886a2",
  "6af828f6b5d899cf576886a4",
  "6af82b94f52fdb8c466fa187",
  "6af82b94f52fdb8c466fa189",
  "6af82f20f52fdb8c466fa18d"
];

async function clean() {
  try {
    const backup = "./backups/CodeCheck_2026-11-15T04-40-12-931Z";

    if (!fs.existsSync(backup + "/submissions.json")) {
      throw new Error("Backup not found. Delete cancelled.");
    }

    await mongoose.connect("mongodb://127.0.0.1:27017/CodeCheck");

    const collection = mongoose.connection.db.collection("submissions");

    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

    const records = await collection.find({
      _id: { $in: objectIds }
    }).toArray();

    if (records.length !== 5) {
      throw new Error(`Expected 5 records, found ${records.length}. Delete cancelled.`);
    }

    const result = await collection.deleteMany({
      _id: { $in: objectIds }
    });

    const remaining = await collection.countDocuments();

    console.log("Deleted records:", result.deletedCount);
    console.log("Remaining submissions:", remaining);

    if (result.deletedCount === 5 && remaining === 38) {
      console.log("SUCCESS: Only 5 incomplete records deleted!");
    }

  } catch (error) {
    console.log("Operation stopped:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

clean();
