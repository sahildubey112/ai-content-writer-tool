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
  try {
    const { topic, type, tone } = req.body;

    res.json({
      result: `✅ Working:\n\nType: ${type}\nTopic: ${topic}\nTone: ${tone}`
    });

  } catch (err) {
    res.json({
      result: "Server Error: " + err.message
    });
  }
});

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
