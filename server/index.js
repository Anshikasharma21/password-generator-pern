import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

// Save password
app.post("/save", async (req, res) => {
  try {
    const { password } = req.body;

    const newPass = await pool.query(
      "INSERT INTO passwords (password) VALUES ($1) RETURNING *",
      [password]
    );

    res.json(newPass.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all passwords
app.get("/passwords", async (req, res) => {
  try {
    const all = await pool.query("SELECT * FROM passwords");
    res.json(all.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// IMPORTANT: Render compatible port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});