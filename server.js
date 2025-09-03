// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import generateVideoRouter from "./api/generate-video.js";

const app = express();
const PORT = process.env.PORT || 10000;

// Express config
app.use(express.json());

// API route (mounted from api/generate-video.js)
app.use("/api", generateVideoRouter);

// --- Serve frontend (static files) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// Root route → show index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
