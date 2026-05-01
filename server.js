import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🔥 AI Content Writer Tool is Live 🔥");
});

// ✅ GENERATE API
app.post("/generate", async (req, res) => {
  try {
    const { topic, type, tone } = req.body;

    if (!topic) {
      return res.json({ result: "Please provide a topic." });
    }

    const prompt = `Write a ${type} about "${topic}" in a ${tone} tone. Make it engaging, informative, and human-like.`;

    // ✅ Proper Hugging Face Inference API endpoint
    const response = await fetch("[api-inference.huggingface.co](https://api-inference.huggingface.co/pipeline/text-generation)", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt2",
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.8,
          top_p: 0.95
        }
      })
    });

    const text = await response.text();
    let result = "No AI response.";

    try {
      const data = JSON.parse(text);
      if (Array.isArray(data) && data[0]?.generated_text) {
        result = data[0].generated_text;
      } else if (data.error) {
        result = "API Error: " + data.error;
      } else if (data.generated_text) {
        result = data.generated_text;
      }
    } catch {
      result = "Server Error (Non-JSON Response): " + text.substring(0, 200);
    }

    res.json({ result });
  } catch (err) {
    res.json({ result: "Fetch Error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
