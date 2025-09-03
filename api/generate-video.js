// api/generate-video.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Example API: POST /api/generate-video
router.post("/generate-video", async (req, res) => {
  try {
    const { apiKey, prompt } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "Missing API key" });
    }
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // Example external API call (replace with your actual video API)
    const response = await fetch("https://example.com/video-api", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
