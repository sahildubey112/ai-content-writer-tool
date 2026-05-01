import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.send("NEW VERSION LIVE 🔥");   // 👈 change for confirmation
});

// GENERATE
app.post("/generate", async (req, res) => {
  try {
    const { topic, type, tone } = req.body;

    const prompt = `Write a ${type} about "${topic}" in ${tone} tone.`;

    // ✅ ONLY THIS URL (no /models mistake)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    const data = await response.json();

    let result = "No response";

    if (Array.isArray(data) && data[0]?.generated_text) {
      result = data[0].generated_text;
    } else if (data.error) {
      result = "API Error: " + data.error;
    }

    res.json({ result });

  } catch (err) {
    res.json({ result: "Error: " + err.message });
  }
});

// PORT FIX
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
