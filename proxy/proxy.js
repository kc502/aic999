import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // ✅ frontend က request လွတ်လွတ်ထားနိုင်မယ်

// Gemini video generation (Veo-3)
app.post("/api/generate-video", async (req, res) => {
  const { apiKey, prompt } = req.body;

  if (!apiKey || !prompt) {
    return res.status(400).json({ error: "API key and prompt required" });
  }

  try {
    // ✅ Google Generative Language API သုံးတဲ့ URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/veo-3:generateVideo?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: { text: prompt },
        config: { durationSeconds: 5, resolution: "720p" }
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Proxy server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
