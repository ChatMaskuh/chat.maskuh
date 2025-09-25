
import { config } from 'dotenv';
config();

import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_...',
      // baseUrl is now defined directly in the prompt to avoid conflicts.
    }),
  ],
});


import '@/ai/flows/chatbot.ts';
