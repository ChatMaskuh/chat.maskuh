
import { config } from 'dotenv';
config();

import {genkit} from 'genkit';

// This file is now cleaner, only initializing Genkit without other plugins for now.
export const ai = genkit();


import '@/ai/flows/chatbot.ts';
