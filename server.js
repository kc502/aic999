// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());           // Browser fetch လိုက်လို့ရအောင်
app.use(express.json());   // JSON body support

const BASE = "https://generativelanguage.googleapis.com/v1beta";

// Proxy endpoint: Browser -> Render -> Gemini API
app.post("/generate-video", async (req, res) => {
  try {
    const { apiKey, model, prompt, negativePrompt, aspectRatio, resolution, personGeneration } = req.body;

    if(!apiKey || !prompt || !model){
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const startResp = await fetch(`${BASE}/models/${encodeURIComponent(model)}:predictLongRunning`, {
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
    });

    if (!startResp.ok) {
      const errText = await startResp.text();
      return res.status(500).json({ error: errText });
    }

    const op = await startResp.json();
    res.json(op);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Polling endpoint: Browser calls to check job status
app.get("/poll/:opName", async (req, res) => {
  try {
    const { opName } = req.params;
    const apiKey = req.query.apiKey;
    if(!apiKey) return res.status(400).json({ error: "Missing apiKey query parameter" });

    const pollResp = await fetch(`${BASE}/${opName}`, {
      headers: { "x-goog-api-key": apiKey }
    });

    const data = await pollResp.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
