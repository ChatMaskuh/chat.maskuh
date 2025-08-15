'use server';

import { generateStaffingSuggestions, type StaffingSuggestionsInput } from '@/ai/flows/staffing-suggestions';
import { z } from 'zod';

const formSchema = z.object({
  totalPickOrders: z.coerce.number().min(0, "Must be a positive number"),
  packedOrders: z.coerce.number().min(0, "Must be a positive number"),
  shippedOrders: z.coerce.number().min(0, "Must be a positive number"),
  paymentAccepted: z.coerce.number().min(0, "Must be a positive number"),
  inProgressOrders: z.coerce.number().min(0, "Must be a positive number"),
  numPickers: z.coerce.number().int().min(0, "Must be a positive integer"),
  numPackers: z.coerce.number().int().min(0, "Must be a positive integer"),
  numDispatchers: z.coerce.number().int().min(0, "Must be a positive integer"),
  pickingGoal: z.coerce.number().min(1, "Must be at least 1"),
  packingGoal: z.coerce.number().min(1, "Must be at least 1"),
  dispatchingGoal: z.coerce.number().min(1, "Must be at least 1"),
});

export async function getStaffingSuggestionsAction(
  prevState: { suggestions: string | null; error: string | null },
  formData: FormData
) {
  const validatedFields = formSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      suggestions: null,
      error: 'Invalid form data. Please check your inputs.',
    };
  }
  
  try {
    const input: StaffingSuggestionsInput = validatedFields.data;
    const result = await generateStaffingSuggestions(input);
    return { suggestions: result.suggestions, error: null };
  } catch (e) {
    console.error(e);
    return {
      suggestions: null,
      error: 'Failed to generate suggestions. Please try again later.',
    };
  }
}
