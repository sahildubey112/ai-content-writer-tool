import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate", async (req, res) => {

  const { topic, type, tone } = req.body;

  const prompt = `
Write a high quality ${type} about "${topic}" in ${tone} tone.
SEO friendly, human written, detailed content.
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      result: response.choices[0].message.content
    });

  } catch (err) {
    res.json({ result: err.message });
  }
});

app.listen(3000, () => console.log("Server running"));