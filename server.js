import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.json({ status: "AI Tool Running 🚀" });
});

// GENERATE
app.post("/generate", async (req, res) => {

  try {
    const { topic, type, tone } = req.body;

    if (!topic) {
      return res.json({ result: "Please enter a topic" });
    }

    const prompt = `Write a ${type} about "${topic}" in ${tone} tone. Make it detailed and human-like.`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    const text = await response.text();

    let result = "No response from AI";

    try {
      const data = JSON.parse(text);

      if (Array.isArray(data) && data[0]?.generated_text) {
        result = data[0].generated_text;
      } else if (data.error) {
        result = "API Error: " + data.error;
      }

    } catch {
      result = "Server Error: " + text.substring(0, 200);
    }

    res.json({ result });

  } catch (err) {
    res.json({ result: "Fetch Error: " + err.message });
  }

});

// PORT FIX
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
