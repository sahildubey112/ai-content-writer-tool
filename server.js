import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.json({ status: "Gemini API running 🚀" });
});

// ✅ MAIN GENERATE ROUTE
app.post("/generate", async (req, res) => {

  const { topic, type, tone } = req.body;

  try {

    const prompt = `Write a ${type} about "${topic}" in ${tone} tone. SEO friendly and human style.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

const data = await response.json();

// DEBUG (optional)
console.log(JSON.stringify(data, null, 2));

let result = "No response from AI";

if (data.candidates && data.candidates.length > 0) {
  let parts = data.candidates[0].content.parts;

  if (parts && parts.length > 0) {
    result = parts.map(p => p.text).join("\n");
  }
}

res.json({ result });

    res.json({ result });

  } catch (err) {
    res.json({ result: "Error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
