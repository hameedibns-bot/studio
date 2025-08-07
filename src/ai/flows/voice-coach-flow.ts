
'use server';
/**
 * @fileOverview A flow for handling voice coach interactions.
 * - generateSpokenResponse - A function that takes text and returns a spoken response.
 * - VoiceCoachInput - The input type for the generateSpokenResponse function.
 * - VoiceCoachOutput - The return type for the generateSpokenResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

export const VoiceCoachInputSchema = z.object({
  text: z.string().describe("The user's transcribed text."),
  interviewMode: z.boolean().optional().describe('Whether the user is in interview practice mode.'),
  conversationHistory: z.array(z.string()).optional().describe('The history of the conversation so far.'),
});
export type VoiceCoachInput = z.infer<typeof VoiceCoachInputSchema>;

const InterviewFeedbackSchema = z.object({
    clarity: z.string().describe("Feedback on the clarity of the user's response."),
    relevance: z.string().describe("Feedback on the relevance of the user's response to the question."),
    confidence: z.string().describe("Feedback on the perceived confidence of the user's response."),
});

export const VoiceCoachOutputSchema = z.object({
  responseText: z.string(),
  media: z.string().describe("A data URI of the spoken response in WAV format. Format: 'data:audio/wav;base64,<encoded_data>'."),
  feedback: InterviewFeedbackSchema.optional().describe('Structured feedback for the interview response.'),
});
export type VoiceCoachOutput = z.infer<typeof VoiceCoachOutputSchema>;

export async function generateSpokenResponse(input: VoiceCoachInput): Promise<VoiceCoachOutput> {
  return voiceCoachFlow(input);
}

const coachingPrompt = ai.definePrompt({
    name: 'coachingPrompt',
    input: { schema: VoiceCoachInputSchema },
    output: { schema: z.object({ response: z.string() }) },
    prompt: `You are a supportive and insightful AI life coach. The user will provide you with a statement or question. Respond in a helpful, encouraging, and conversational manner. Keep your response to 1-3 sentences.
  
User said: {{{text}}}
  
Your response:`,
});

const interviewPrompt = ai.definePrompt({
    name: 'interviewPrompt',
    input: { schema: VoiceCoachInputSchema },
    output: { schema: VoiceCoachOutputSchema.pick({ responseText: true, feedback: true }) },
    prompt: `You are an expert AI interview coach. You are conducting a practice interview.
If the conversation history is empty or the user says "start", begin by asking a common opening interview question (e.g., "Tell me about yourself.").
Otherwise, respond to the user's answer and ask a relevant follow-up question.

After formulating your next question, provide structured feedback on the user's *previous* answer.

Conversation History:
{{#if conversationHistory}}
{{#each conversationHistory}}
- {{this}}
{{/each}}
{{else}}
No history yet. This is the start of the interview.
{{/if}}

User's latest response: "{{{text}}}"

Your task:
1.  Formulate your response, which should be the next interview question.
2.  Provide structured, constructive feedback on the user's last answer based on clarity, relevance, and confidence.
`,
});


const voiceCoachFlow = ai.defineFlow(
  {
    name: 'voiceCoachFlow',
    inputSchema: VoiceCoachInputSchema,
    outputSchema: VoiceCoachOutputSchema,
  },
  async (input) => {
    let responseText: string;
    let feedback: z.infer<typeof InterviewFeedbackSchema> | undefined;

    if (input.interviewMode) {
        const { output } = await interviewPrompt(input);
        responseText = output?.responseText ?? "That's an interesting perspective. Let's move on. What are your biggest strengths?";
        feedback = output?.feedback;
    } else {
        const { output } = await coachingPrompt(input);
        responseText = output?.response ?? "I'm sorry, I didn't understand. Could you please rephrase?";
    }

    // 2. Convert the text response to speech
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: responseText,
    });
    
    if (!media || !media.url) {
      throw new Error('No media was returned from the text-to-speech model.');
    }

    // 3. Convert the raw PCM audio to WAV format
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);
    
    // 4. Return both the text and the audio data URI
    return {
      responseText: responseText,
      media: 'data:audio/wav;base64,' + wavData,
      feedback: feedback,
    };
  }
);


// Helper function to convert PCM audio data to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
