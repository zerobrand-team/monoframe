'use server';

import { aiStyleSuggestion, type AiStyleSuggestionInput, type AiStyleSuggestionOutput } from '@/ai/flows/ai-style-suggestion-flow';

export async function getAiSuggestions(
  input: AiStyleSuggestionInput
): Promise<{ success: true; data: AiStyleSuggestionOutput } | { success: false; error: string }> {
  try {
    const suggestions = await aiStyleSuggestion(input);
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to get style suggestions. ${errorMessage}` };
  }
}
