const axios = require('axios');
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const OPENAI_API_KEY = process.env.apiKey;
const app = express();
const port = 4000;

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(express.json());
app.use(cors(corsOptions));

//endpoint to handle quiz generation requests
app.post('/generateQuiz', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    //extract only generated questions from response
    const generatedQuestions = response.data.choices.map(choice => choice.message.content);

    console.log('Generated Questions:', generatedQuestions);

    //send generated questions to the client-side (front end)
    console.log("Sending quiz data to client:", generatedQuestions);
    res.json(generatedQuestions);
  } catch (error) {
    console.error("Error in OpenAI request:", error.response || error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});