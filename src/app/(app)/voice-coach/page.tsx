
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, Languages, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSpokenResponse, VoiceCoachInput } from '@/ai/flows/voice-coach-flow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'ur-PK', name: 'Urdu' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'zh-CN', name: 'Mandarin Chinese' },
];

export default function VoiceCoachPage() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const { toast } = useToast();

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = selectedLang;

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                 // Use functional update to avoid stale state
                setTranscript(prev => prev + finalTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                toast({ variant: 'destructive', title: 'Speech Recognition Error', description: event.error });
                setIsListening(false);
            };
        } else {
             toast({ variant: 'destructive', title: 'Not Supported', description: "Your browser doesn't support speech recognition." });
        }
    }, [selectedLang, toast]);
    
    useEffect(() => {
      if (audioUrl && audioRef.current) {
        audioRef.current.play().catch(e => {
            console.error("Audio playback failed:", e);
            toast({ variant: 'destructive', title: 'Audio Error', description: 'Could not play audio.' });
        });
      }
    }, [audioUrl, toast]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast({ variant: 'destructive', title: 'Not Supported', description: "Speech recognition is not available in your browser." });
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            setAudioUrl(null);
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleGenerateResponse = async () => {
        if (!transcript) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please say something first.' });
            return;
        }
        setLoading(true);
        setAudioUrl(null);
        try {
            const input: VoiceCoachInput = { text: transcript };
            const result = await generateSpokenResponse(input);
            if (result.media) {
                setAudioUrl(result.media);
            } else {
                throw new Error('No audio data received.');
            }
        } catch (e) {
            console.error("AI Error:", e);
            toast({ variant: 'destructive', title: 'AI Error', description: 'Failed to generate spoken response.' });
        } finally {
            setLoading(false);
        }
    };
    
    const stopPlayback = () => {
        if(audioRef.current){
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setAudioUrl(null); // Clear audio state to hide the player
        }
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <header className="text-center">
                <h2 className="text-4xl font-headline font-bold">AI Voice Coach</h2>
                <p className="text-muted-foreground text-lg mt-2">
                    Interact with your AI coach using your voice.
                </p>
            </header>
            
            <Card>
                <CardHeader>
                    <CardTitle>Conversation</CardTitle>
                    <CardDescription>Select your language, start recording, and get a spoken response from your coach.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                       <Languages className="w-5 h-5 text-muted-foreground" />
                        <Select onValueChange={setSelectedLang} defaultValue={selectedLang}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(lang => (
                                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Your message:</h3>
                        <Textarea 
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Your transcribed text will appear here..." 
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={toggleListening} disabled={loading} variant={isListening ? 'destructive' : 'outline'} className="flex-1">
                            {isListening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                            {isListening ? 'Stop Listening' : 'Start Listening'}
                        </Button>
                        <Button onClick={handleGenerateResponse} disabled={loading || !transcript} className="flex-1">
                            {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
                            Get AI Response
                        </Button>
                    </div>

                    {audioUrl && (
                       <div className="flex items-center justify-center gap-4 p-4 border rounded-lg bg-muted/50">
                            <audio ref={audioRef} src={audioUrl} onEnded={() => setAudioUrl(null)} />
                            <p className="text-sm font-medium">Playing AI response...</p>
                            <Button onClick={stopPlayback} variant="ghost" size="icon">
                                <Square className="w-5 h-5" />
                                <span className="sr-only">Stop Playback</span>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
