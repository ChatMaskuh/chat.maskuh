import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.Gemini_key,
    }),
  ],
  model: 'googleai/gemini-1.5-flash-latest',
});
