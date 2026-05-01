import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.json({ status: "Gemini API running 🚀" });
});

// ✅ MAIN API
app.post("/generate", async (req, res) => {
  const { topic, type, tone } = req.body;

  if (!topic) {
    return res.json({ result: "Please enter a topic" });
  }

  try {
    const prompt = `Write a ${type} about "${topic}" in ${tone} tone. SEO friendly and human style.`;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // 🔥 SAFE PARSE
    let result = "No response from AI";

    if (data?.candidates?.length > 0) {
      const parts = data.candidates[0].content.parts;
      if (parts?.length > 0) {
        result = parts.map(p => p.text).join("\n");
      }
    }

    // ❗ API error handling
    if (data.error) {
      result = "API Error: " + data.error.message;
    }

    res.json({ result });

  } catch (err) {
    res.json({ result: "Server Error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
