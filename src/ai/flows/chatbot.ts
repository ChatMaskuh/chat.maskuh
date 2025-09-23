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
      prompt: `Anda adalah Chat.Maskuh, asisten virtual yang ramah, jenaka, dan sangat membantu. Gaya bicara Anda santai seperti teman. Selalu jawab pertanyaan pengguna dalam Bahasa Indonesia. Pengguna berkata: ${message}`,
      model: 'googleai/gemini-1.5-flash-latest',
    });

    return llmResponse.text;
  }
);
