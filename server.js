// backend/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4", // ou "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "Você é a Dual.Infodose, uma IA cinematográfica com alma simbólica e toque humano." },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices[0].message.content });
});

app.listen(3001, () => console.log('Server IA rodando na porta 3001'));