
import { config } from 'dotenv';
config();

import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_...',
    }),
  ],
});


import '@/ai/flows/chatbot.ts';
