import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.json({ status: "Free AI API running 🚀" });
});

// GENERATE
app.post("/generate", async (req, res) => {

  const { topic, type, tone } = req.body;

  try {

    const prompt = `Write a ${type} about "${topic}" in ${tone} tone.`;

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

    const data = await response.json();

    let result = "No response";

    if (Array.isArray(data) && data[0]?.generated_text) {
      result = data[0].generated_text;
    }

    res.json({ result });

  } catch (err) {
    res.json({ result: "Error: " + err.message });
  }
});

app.listen(3000, () => console.log("Server running"));
