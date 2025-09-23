import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openAI} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    googleAI(),
    openAI({
      apiKey: process.env.OPENAI_API_KEY,
      organizationId: process.env.OPENAI_ORGANIZATION_ID,
      projectId: process.env.OPENAI_PROJECT_ID,
    }),
  ],
  model: 'openai/gpt-4o-mini',
});
