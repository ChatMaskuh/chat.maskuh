'use server';
/**
 * @fileOverview A simple chatbot flow.
 *
 * - chat - A function that takes a user's message and returns a response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatInputSchema = z.string();
const ChatOutputSchema = z.string();

export async function chat(message: string): Promise<string> {
    return chatFlow(message);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (message) => {
    const llmResponse = await ai.generate({
      prompt: `You are a helpful assistant. Respond to the following message: ${message}`,
      model: 'googleai/gemini-2.0-flash',
    });

    return llmResponse.text;
  }
);
