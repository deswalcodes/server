import express from 'express';
import cors from 'cors';
import { agent } from './agent.js';
import { addYTVideoToVectorStore } from './embeddings.js';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: '200mb' }));
app.use(cors());





app.post('/generate', async (req, res) => {
  const { query, thread_id } = req.body;
  console.log(query, thread_id);

  const results = await agent.invoke(
    {
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
    },
    { configurable: { thread_id } }
  );

  res.send(results.messages.at(-1)?.content);
});

app.post('/webhook', async (req, res) => {
  await Promise.all(
    req.body.map(async (video) => addYTVideoToVectorStore(video))
  );

  res.send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});