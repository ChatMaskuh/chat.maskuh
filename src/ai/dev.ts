
import { config } from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Menginisialisasi Genkit dengan plugin Google AI, cara yang lebih stabil.
export const ai = genkit({
    plugins: [
        googleAI(),
    ],
});


import '@/ai/flows/chatbot.ts';
