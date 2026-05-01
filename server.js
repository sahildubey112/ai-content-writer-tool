app.post("/generate", async (req, res) => {

  const { topic, type, tone } = req.body;

  try {

    const prompt = `Write a ${type} about "${topic}" in ${tone} tone. SEO friendly and human style.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    // 🔥 SAFE PARSING (IMPORTANT)
    let result = "No response from AI";

    if (data && data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];

      if (candidate.content && candidate.content.parts) {
        result = candidate.content.parts
          .map(part => part.text)
          .join("\n");
      }
    }

    // ❗ ERROR DEBUG (VERY IMPORTANT)
    if (data.error) {
      result = "API Error: " + data.error.message;
    }

    res.json({ result });

  } catch (err) {
    res.json({ result: "Server Error: " + err.message });
  }
});
