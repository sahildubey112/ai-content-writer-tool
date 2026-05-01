import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// INIT GEMINI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({ status: "Gemini API running 🚀" });
});

// MAIN API
app.post("/generate", async (req, res) => {

  const { topic, type, tone } = req.body;

  if (!topic) {
    return res.json({ result: "Please enter a topic" });
  }

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `Write a ${type} about "${topic}" in ${tone} tone. SEO friendly and human style.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ result: text });

  } catch (err) {
    res.json({ result: "Error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
