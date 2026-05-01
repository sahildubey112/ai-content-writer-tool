import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ROOT
app.get("/", (req, res) => {
  res.json({ status: "Server running 🚀" });
});

// GENERATE
app.post("/generate", (req, res) => {
  const { topic, type, tone } = req.body;

  res.json({
    result: `✅ Working\n\nTopic: ${topic}\nType: ${type}\nTone: ${tone}`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
