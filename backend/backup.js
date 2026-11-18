const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

async function backup() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/CodeCheck");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(__dirname, "backups", `CodeCheck_${timestamp}`);

    fs.mkdirSync(backupDir, { recursive: true });

    for (const collection of collections) {
      const data = await db.collection(collection.name).find({}).toArray();

      fs.writeFileSync(
        path.join(backupDir, `${collection.name}.json`),
        JSON.stringify(data, null, 2)
      );

      console.log(`${collection.name}: ${data.length} records backed up`);
    }

    fs.writeFileSync(
      path.join(backupDir, "backup-info.json"),
      JSON.stringify({
        database: "CodeCheck",
        createdAt: new Date().toISOString(),
        collections: collections.map(c => c.name)
      }, null, 2)
    );

    console.log("\nBACKUP COMPLETED SUCCESSFULLY!");
    console.log("Backup location:", backupDir);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Backup failed:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  }
}

backup();
