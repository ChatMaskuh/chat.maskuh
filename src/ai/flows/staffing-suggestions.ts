'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating actionable staffing suggestions based on warehouse performance data.
 *
 * - generateStaffingSuggestions - A function that generates staffing suggestions.
 * - StaffingSuggestionsInput - The input type for the generateStaffingSuggestions function.
 * - StaffingSuggestionsOutput - The return type for the generateStaffingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StaffingSuggestionsInputSchema = z.object({
  totalPickOrders: z.number().describe('The total number of pick orders.'),
  packedOrders: z.number().describe('The number of orders packed.'),
  shippedOrders: z.number().describe('The number of orders shipped.'),
  paymentAccepted: z.number().describe('The number of payments accepted.'),
  inProgressOrders: z.number().describe('The number of orders currently in progress.'),
  numPickers: z.number().describe('The number of pickers on staff.'),
  numPackers: z.number().describe('The number of packers on staff.'),
  numDispatchers: z.number().describe('The number of dispatchers on staff.'),
  pickingGoal: z.number().describe('The daily picking goal.'),
  packingGoal: z.number().describe('The daily packing goal.'),
  dispatchingGoal: z.number().describe('The daily dispatching goal.'),
});
export type StaffingSuggestionsInput = z.infer<typeof StaffingSuggestionsInputSchema>;

const StaffingSuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('Actionable staffing suggestions for optimizing workforce allocation.'),
});
export type StaffingSuggestionsOutput = z.infer<typeof StaffingSuggestionsOutputSchema>;

export async function generateStaffingSuggestions(input: StaffingSuggestionsInput): Promise<StaffingSuggestionsOutput> {
  return staffingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'staffingSuggestionsPrompt',
  input: {schema: StaffingSuggestionsInputSchema},
  output: {schema: StaffingSuggestionsOutputSchema},
  prompt: `You are a warehouse efficiency expert. Analyze the following warehouse performance data, staffing levels, and goals to generate actionable staffing suggestions. Provide specific recommendations for optimizing workforce allocation and improving overall warehouse efficiency.

Performance Data:
- Total Pick Orders: {{{totalPickOrders}}}
- Packed Orders: {{{packedOrders}}}
- Shipped Orders: {{{shippedOrders}}}
- Payment Accepted: {{{paymentAccepted}}}
- In-Progress Orders: {{{inProgressOrders}}}

Staffing Levels:
- Number of Pickers: {{{numPickers}}}
- Number of Packers: {{{numPackers}}}
- Number of Dispatchers: {{{numDispatchers}}}

Goals:
- Picking Goal: {{{pickingGoal}}}
- Packing Goal: {{{packingGoal}}}
- Dispatching Goal: {{{dispatchingGoal}}}

Suggestions:`,
});

const staffingSuggestionsFlow = ai.defineFlow(
  {
    name: 'staffingSuggestionsFlow',
    inputSchema: StaffingSuggestionsInputSchema,
    outputSchema: StaffingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
