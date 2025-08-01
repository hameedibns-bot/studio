'use server';
/**
 * @fileOverview An AI agent that provides suggestions on how to improve a resume.
 *
 * - optimizeResume - A function that handles the resume optimization process.
 * - OptimizeResumeInput - The input type for the optimizeResume function.
 * - OptimizeResumeOutput - The return type for the optimizeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be optimized.'),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description for which the resume is being optimized.'),
});
export type OptimizeResumeInput = z.infer<typeof OptimizeResumeInputSchema>;

const OptimizeResumeOutputSchema = z.object({
  optimizedResume: z.string().describe('The improved resume content with suggestions incorporated.'),
  suggestions: z.array(z.string()).describe('A list of specific suggestions for improving the resume.'),
});
export type OptimizeResumeOutput = z.infer<typeof OptimizeResumeOutputSchema>;

export async function optimizeResume(input: OptimizeResumeInput): Promise<OptimizeResumeOutput> {
  return optimizeResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumePrompt',
  input: {schema: OptimizeResumeInputSchema},
  output: {schema: OptimizeResumeOutputSchema},
  prompt: `You are an expert resume optimizer. Your goal is to provide suggestions on how to improve the resume to increase the chances of getting a job interview.

  Resume Text: {{{resumeText}}}

  {% if jobDescription %}
  Job Description: {{{jobDescription}}}
  {% endif %}

  Provide an optimized resume incorporating the suggestions. Also, provide a list of specific suggestions that you made to improve the resume.
  Ensure that the optimizedResume incorporates all the suggestions made, and that the suggestions array accurately reflects the changes.
  Do not leave any TODOs or placeholders in the optimizedResume.
  `, // Ensure Handlebars templating is used correctly here
});

const optimizeResumeFlow = ai.defineFlow(
  {
    name: 'optimizeResumeFlow',
    inputSchema: OptimizeResumeInputSchema,
    outputSchema: OptimizeResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
