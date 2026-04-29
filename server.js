import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ROOT CHECK ROUTE
app.get("/", (req, res) => {
  res.json({ status: "API is running 🚀" });
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ MAIN AI ROUTE
app.post("/generate", async (req, res) => {

  const { topic, type, tone } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Write a ${type} about "${topic}" in ${tone} tone. SEO friendly and human style.`
      }]
    });

    res.json({
      result: response.choices[0].message.content
    });

  } catch (err) {
    res.json({
      result: "Error: " + err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
