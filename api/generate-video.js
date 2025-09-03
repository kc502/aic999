import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const BASE = "https://generativelanguage.googleapis.com/v1beta";

// Video Generate Proxy
app.post("/api/generate", async (req, res) => {
  try {
    const { apiKey, model, prompt, negativePrompt, aspectRatio, resolution, personGeneration } = req.body;

    if (!apiKey) return res.status(400).json({ error: "Missing API key" });

    // Start job
    const startResp = await fetch(
      `${BASE}/models/${encodeURIComponent(model)}:predictLongRunning`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            aspectRatio,
            resolution,
            ...(negativePrompt ? { negativePrompt } : {}),
            ...(personGeneration ? { personGeneration } : {})
          }
        })
      }
    );

    if (!startResp.ok) {
      const text = await startResp.text();
      return res.status(startResp.status).json({ error: text });
    }

    const data = await startResp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Poll job status
app.post("/api/poll", async (req, res) => {
  try {
    const { apiKey, name } = req.body;
    if (!apiKey || !name) return res.status(400).json({ error: "Missing params" });

    const poll = await fetch(`${BASE}/${name}`, {
      headers: { "x-goog-api-key": apiKey }
    });

    const status = await poll.json();
    res.json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Poll error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));

export default app;
