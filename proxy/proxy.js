import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/api/generate-video", async (req, res) => {
  const { apiKey, prompt } = req.body;

  if (!apiKey || !prompt) {
    return res.status(400).json({ error: "Missing apiKey or prompt" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/veo-3:generateVideo?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            text: prompt
          }
        }),
      }
    );

    // Debugging: raw response log
    const text = await response.text();
    console.log("Gemini raw response:", text);

    if (!response.ok) {
      return res.status(500).json({
        error: "Gemini API call failed",
        detail: text,
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON from Gemini",
        detail: text,
      });
    }

    res.json(data);

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy server error", detail: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
