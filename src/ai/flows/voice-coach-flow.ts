
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
  text: z.string().describe('The user\'s transcribed text.'),
});
export type VoiceCoachInput = z.infer<typeof VoiceCoachInputSchema>;

export const VoiceCoachOutputSchema = z.object({
  responseText: z.string(),
  media: z.string().describe("A data URI of the spoken response in WAV format. Format: 'data:audio/wav;base64,<encoded_data>'."),
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

const voiceCoachFlow = ai.defineFlow(
  {
    name: 'voiceCoachFlow',
    inputSchema: VoiceCoachInputSchema,
    outputSchema: VoiceCoachOutputSchema,
  },
  async (input) => {
    // 1. Get a text response from the LLM
    const { output } = await coachingPrompt(input);
    const responseText = output?.response || "I'm sorry, I didn't understand. Could you please rephrase?";

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
    
    if (!media) {
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
