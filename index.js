import express from 'express';
import cors from 'cors';
import { agent } from './agent.js';

const app = express();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    
    res.send('API is running');
});

app.post('/generate', async (req, res) => {
    try {
        const { query, video_id, thread_id } = req.body;

        const results = await agent.invoke(
            {
                messages: [
                    { 
                        role: 'user',
                        content: query
                    }
                ]
            },
            {
                configurable: { thread_id, video_id }
            }
        );

        res.json(results.messages.at(-1)?.content);
    } catch (error) {
        console.error('Error during generation:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
app.post('/webhook',(req,res)=>{
    
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});