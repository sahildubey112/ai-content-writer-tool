import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ROOT (CHECK)
app.get("/", (req, res) => {
  res.send("🔥 FINAL VERSION LIVE 🔥");
});

// ✅ GENERATE API
app.post("/generate", async (req, res) => {
  try {
    const { topic, type, tone } = req.body;

    if (!topic) {
      return res.json({ result: "Please enter a topic" });
    }

    const prompt = `Write a ${type} about "${topic}" in ${tone} tone. Make it simple and human-like.`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true }
        })
      }
    );

    const contentType = response.headers.get("content-type");

    // ❌ If HTML error
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.json({
        result: "❌ API Error (Check API Key or Limit)\n\n" + text.substring(0, 200)
      });
    }

    const data = await response.json();

    let result = "No response from AI";

    if (Array.isArray(data) && data[0]?.generated_text) {
      result = data[0].generated_text;
    } else if (data.error) {
      result = "API Error: " + data.error;
    }

    res.json({ result });

  } catch (err) {
    res.json({ result: "Fetch Error: " + err.message });
  }
});

// ✅ PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
