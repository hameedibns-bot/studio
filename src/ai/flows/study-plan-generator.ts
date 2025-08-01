'use server';

/**
 * @fileOverview AI-powered study plan generator.
 *
 * - generateStudyPlan - A function that generates a personalized study plan.
 * - StudyPlanInput - The input type for the generateStudyPlan function.
 * - StudyPlanOutput - The return type for the generateStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyPlanInputSchema = z.object({
  subject: z.string().describe('The subject for which the study plan is to be generated.'),
  examDate: z.string().describe('The date of the exam in ISO format (YYYY-MM-DD).'),
  topics: z.string().describe('A comma-separated list of topics to be covered in the study plan.'),
  studyHoursPerDay: z.number().describe('The number of hours available for study each day.'),
});
export type StudyPlanInput = z.infer<typeof StudyPlanInputSchema>;

const StudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A detailed study plan with topics, subtopics, and schedule.'),
  flashcards: z.array(z.string()).describe('An array of flashcard questions and answers.'),
  summaries: z.array(z.string()).describe('An array of summaries for each topic.'),
  practiceQuestions: z.array(z.string()).describe('An array of practice questions for self-assessment.'),
});
export type StudyPlanOutput = z.infer<typeof StudyPlanOutputSchema>;

export async function generateStudyPlan(input: StudyPlanInput): Promise<StudyPlanOutput> {
  return studyPlanGeneratorFlow(input);
}

const studyPlanPrompt = ai.definePrompt({
  name: 'studyPlanPrompt',
  input: {schema: StudyPlanInputSchema},
  output: {schema: StudyPlanOutputSchema},
  prompt: `You are an expert study plan generator. Generate a study plan for the subject {{{subject}}} with the exam date {{{examDate}}}. The topics to be covered are: {{{topics}}}. The student has {{{studyHoursPerDay}}} hours per day to study.

  The output should include a detailed study plan, flashcards, summaries and practice questions.

  Study Plan:
  - Include a day-by-day schedule.
  - Include a topic-by-topic breakdown.
  Flashcards:
  - An array of questions and answers.
  Summaries:
  - An array of summaries for each topic.
  Practice Questions:
  - An array of practice questions for self-assessment.`,
});

const studyPlanGeneratorFlow = ai.defineFlow(
  {
    name: 'studyPlanGeneratorFlow',
    inputSchema: StudyPlanInputSchema,
    outputSchema: StudyPlanOutputSchema,
  },
  async input => {
    const {output} = await studyPlanPrompt(input);
    return output!;
  }
);
