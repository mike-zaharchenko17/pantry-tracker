import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ 
    path: '.env.local' 
});

const openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openAiClient;