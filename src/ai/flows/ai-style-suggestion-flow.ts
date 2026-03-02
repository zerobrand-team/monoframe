'use server';
/**
 * @fileOverview This file provides an AI tool that analyzes an uploaded image
 * and suggests optimal background choices or subtle visual adjustments for a cohesive design.
 *
 * - aiStyleSuggestion - A function that handles the AI style suggestion process.
 * - AiStyleSuggestionInput - The input type for the aiStyleSuggestion function.
 * - AiStyleSuggestionOutput - The return type for the aiStyleSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiStyleSuggestionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a foreground image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AiStyleSuggestionInput = z.infer<typeof AiStyleSuggestionInputSchema>;

const AiStyleSuggestionOutputSchema = z.object({
  suggestedBackgrounds: z
    .array(z.string().describe('A text description of a suggested background theme or style.'))
    .describe('A list of 3-5 distinct background themes or descriptions that would complement the foreground image.'),
  stylisticAdjustments: z
    .string()
    .describe(
      'A brief, one-sentence suggestion for subtle stylistic adjustments (e.g., color grading, filter, lighting) that would enhance the foreground image to create a cohesive composition.'
    ),
});
export type AiStyleSuggestionOutput = z.infer<typeof AiStyleSuggestionOutputSchema>;

export async function aiStyleSuggestion(
  input: AiStyleSuggestionInput
): Promise<AiStyleSuggestionOutput> {
  return aiStyleSuggestionFlow(input);
}

const aiStyleSuggestionPrompt = ai.definePrompt({
  name: 'aiStyleSuggestionPrompt',
  input: { schema: AiStyleSuggestionInputSchema },
  output: { schema: AiStyleSuggestionOutputSchema },
  prompt: `Analyze the uploaded foreground image provided as a data URI.
Based on its content, dominant colors, and overall mood or subject matter, suggest 3-5 distinct background themes or descriptions that would perfectly complement it. These suggestions should be creative and diverse, aiming for a cohesive and visually appealing final composition.

Additionally, provide a brief, one-sentence suggestion for subtle stylistic adjustments (e.g., color grading, lighting, simple filters, contrast adjustments) that would enhance the foreground image itself, ensuring it blends harmoniously with any of the suggested backgrounds.

Output your suggestions strictly in JSON format, adhering to the provided schema.

Foreground Image: {{media url=photoDataUri}}`,
});

const aiStyleSuggestionFlow = ai.defineFlow(
  {
    name: 'aiStyleSuggestionFlow',
    inputSchema: AiStyleSuggestionInputSchema,
    outputSchema: AiStyleSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await aiStyleSuggestionPrompt(input);
    if (!output) {
      throw new Error('AI did not return any style suggestions.');
    }
    return output;
  }
);
