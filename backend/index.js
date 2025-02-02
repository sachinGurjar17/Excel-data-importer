import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://sachinGurjar:Sachin%40123@cluster0.8fkp40v.mongodb.net/");

const DataSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: Date,
  verified: String,
});

const DataModel = mongoose.model("ExcelData", DataSchema);

app.post("/api/import", async (req, res) => {
  const { data } = req.body;
  const validRows = [];
  const skippedRows = [];

  data.forEach((row, index) => {
    const [name, amount, date, verified] = row;
    
    if (!name || !amount || !date || !verified) {
      skippedRows.push({ row: index + 1, error: "Missing required fields" });
      return;
    }

    validRows.push({ name, amount, date: new Date(date), verified });
  });

  if (validRows.length) {
    await DataModel.insertMany(validRows);
  }

  res.json({
    message: "Import completed",
    imported: validRows.length,
    skipped: skippedRows,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
