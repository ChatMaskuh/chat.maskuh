
import { config } from 'dotenv';
config();

import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_...',
      baseUrl: 'https://api-inference.huggingface.co/v1', // The general API endpoint
    }),
  ],
});


import '@/ai/flows/chatbot.ts';
