'use server';

/**
 * @fileOverview AI-driven smart daily planner flow.
 *
 * - smartDailyPlanner - A function that generates an optimized daily plan based on user context.
 * - SmartDailyPlannerInput - The input type for the smartDailyPlanner function.
 * - SmartDailyPlannerOutput - The return type for the smartDailyPlanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartDailyPlannerInputSchema = z.object({
  goals: z
    .string()
    .describe('The user goals.'),
  schedule: z
    .string()
    .describe('The user schedule.'),
  habits: z
    .string()
    .describe('The user habits.'),
});
export type SmartDailyPlannerInput = z.infer<typeof SmartDailyPlannerInputSchema>;

const SmartDailyPlannerOutputSchema = z.object({
  plan: z.string().describe('The generated daily plan.'),
});
export type SmartDailyPlannerOutput = z.infer<typeof SmartDailyPlannerOutputSchema>;

export async function smartDailyPlanner(input: SmartDailyPlannerInput): Promise<SmartDailyPlannerOutput> {
  return smartDailyPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartDailyPlannerPrompt',
  input: {schema: SmartDailyPlannerInputSchema},
  output: {schema: SmartDailyPlannerOutputSchema},
  prompt: `You are an AI productivity assistant. Generate a daily plan for the user based on their goals, schedule, and habits.

Goals: {{{goals}}}
Schedule: {{{schedule}}}
Habits: {{{habits}}}

Daily Plan:`,
});

const smartDailyPlannerFlow = ai.defineFlow(
  {
    name: 'smartDailyPlannerFlow',
    inputSchema: SmartDailyPlannerInputSchema,
    outputSchema: SmartDailyPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
