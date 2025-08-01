'use server';

/**
 * @fileOverview A mood and health journal AI agent.
 *
 * - analyzeMoodAndSuggestWellness - A function that handles the mood analysis and wellness suggestion process.
 * - MoodHealthJournalInput - The input type for the analyzeMoodAndSuggestWellness function.
 * - MoodHealthJournalOutput - The return type for the analyzeMoodAndSuggestWellness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodHealthJournalInputSchema = z.object({
  entry: z.string().describe('The journal entry from the user, detailing their mood and health information.'),
});
export type MoodHealthJournalInput = z.infer<typeof MoodHealthJournalInputSchema>;

const MoodHealthJournalOutputSchema = z.object({
  mood: z.string().describe('The overall mood detected from the journal entry.'),
  suggestions: z.string().describe('Personalized suggestions for improving the user\'s well-being based on their mood and health information.'),
});
export type MoodHealthJournalOutput = z.infer<typeof MoodHealthJournalOutputSchema>;

export async function analyzeMoodAndSuggestWellness(input: MoodHealthJournalInput): Promise<MoodHealthJournalOutput> {
  return analyzeMoodAndSuggestWellnessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodHealthJournalPrompt',
  input: {schema: MoodHealthJournalInputSchema},
  output: {schema: MoodHealthJournalOutputSchema},
  prompt: `You are an AI wellness coach specializing in mood analysis and personalized wellness suggestions.

You will analyze the user's journal entry to detect their mood and provide personalized suggestions for improving their well-being.

Journal Entry: {{{entry}}}

Based on the journal entry, determine the user's mood and provide actionable suggestions for improving their well-being. Consider suggesting specific activities, mindfulness practices, or other relevant advice.

Output the mood detected and the personalized suggestions in the following format:

Mood: [The detected mood]
Suggestions: [Personalized suggestions for improving well-being] `,
});

const analyzeMoodAndSuggestWellnessFlow = ai.defineFlow(
  {
    name: 'analyzeMoodAndSuggestWellnessFlow',
    inputSchema: MoodHealthJournalInputSchema,
    outputSchema: MoodHealthJournalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
