import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/save", async (req, res) => {
  const { password } = req.body;

  const newPass = await pool.query(
    "INSERT INTO passwords (password) VALUES ($1) RETURNING *",
    [password]
  );

  res.json(newPass.rows[0]);
});

app.get("/passwords", async (req, res) => {
  const all = await pool.query("SELECT * FROM passwords");
  res.json(all.rows);
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});