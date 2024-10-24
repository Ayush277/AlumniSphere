const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3001; 

const apiKey = "AIzaSyCBrstp3tCSkElRYHwBUbOyXSk9oecfFXU";

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});
 
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/ask", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
      history: [
        {
          role: "user",
          parts: [{ text: "You are an assistant that helps with alumni mentoring platform queries." }],
        },
      ],
    });

    
    const result = await chatSession.sendMessage(userPrompt);
    const aiResponse = result.response.text();

    
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).send("Error fetching response.");
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
