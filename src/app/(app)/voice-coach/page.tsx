
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, Languages, Square, Sparkles, BrainCircuit, Check, ThumbsUp, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSpokenResponse, VoiceCoachInput, VoiceCoachOutput } from '@/ai/flows/voice-coach-flow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'ur-PK', name: 'Urdu' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'zh-CN', name: 'Mandarin Chinese' },
];

type Feedback = VoiceCoachOutput['feedback'];

export default function VoiceCoachPage() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [aiResponseText, setAiResponseText] = useState('');
    const [feedback, setFeedback] = useState<Feedback>(null);
    const [interviewMode, setInterviewMode] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<string[]>([]);
    
    const recognitionRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const userStoppedManually = useRef(false);
    const { toast } = useToast();

    const handleGenerateResponse = useCallback(async (text: string) => {
        if (!text) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please say something first.' });
            return;
        }
        setLoading(true);
        setAudioUrl(null);
        setAiResponseText('');
        setFeedback(null);
        try {
            const input: VoiceCoachInput = { text, interviewMode, conversationHistory };
            const result = await generateSpokenResponse(input);
            
            const newHistory = [...conversationHistory, `User: ${text}`, `AI: ${result.responseText}`];
            setConversationHistory(newHistory);
            
            if (result.media) {
                setAudioUrl(result.media);
                setAiResponseText(result.responseText);
                setFeedback(result.feedback);
            } else {
                throw new Error('No audio data received.');
            }
        } catch (e) {
            console.error("AI Error:", e);
            toast({ variant: 'destructive', title: 'AI Error', description: 'Failed to generate spoken response.' });
        } finally {
            setLoading(false);
        }
    }, [interviewMode, conversationHistory, toast]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast({ variant: 'destructive', title: 'Not Supported', description: "Your browser doesn't support speech recognition." });
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLang;

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                 if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setTranscript(prev => prev.trim() ? `${prev.trim()} ${finalTranscript.trim()}`: finalTranscript.trim());
            }
        };

        recognition.onerror = (event: any) => {
            toast({ variant: 'destructive', title: 'Speech Recognition Error', description: event.error });
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (userStoppedManually.current && transcript.trim()) {
                handleGenerateResponse(transcript);
            }
             userStoppedManually.current = false;
        };

        recognitionRef.current = recognition;
    }, [selectedLang, toast, handleGenerateResponse, transcript]);
    
    useEffect(() => {
      if (audioUrl && audioRef.current) {
        audioRef.current.play().catch(e => {
            console.error("Audio playback failed:", e);
            toast({ variant: 'destructive', title: 'Audio Error', description: 'Could not play audio.' });
        });
      }
    }, [audioUrl, toast]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        
        if (isListening) {
            userStoppedManually.current = true;
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            setAudioUrl(null);
            setAiResponseText('');
            setFeedback(null);
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const startInterview = () => {
        setConversationHistory([]);
        setTranscript('start');
        handleGenerateResponse('start');
    }
    
    const stopPlayback = () => {
        if(audioRef.current){
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setAudioUrl(null);
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <header className="text-center">
                <h2 className="text-4xl font-headline font-bold">AI Voice Coach</h2>
                <p className="text-muted-foreground text-lg mt-2">
                    {interviewMode ? 'Practice your interview skills with an AI coach.' : 'Interact with your AI coach using your voice.'}
                </p>
            </header>
            
            <Card>
                <CardHeader>
                    <div className='flex justify-between items-start'>
                        <div>
                            <CardTitle>Conversation</CardTitle>
                            <CardDescription>Select a mode, start recording, and get a spoken response.</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="interview-mode" checked={interviewMode} onCheckedChange={setInterviewMode} />
                            <Label htmlFor="interview-mode" className="font-semibold">Interview Practice</Label>
                        </div>
                    </div>
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

                    <Separator />

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                             <h3 className="font-semibold text-lg">Your Input</h3>
                             <Textarea 
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                placeholder="Your transcribed text will appear here..." 
                                className="min-h-[150px] bg-muted/30"
                            />
                            <div className="flex flex-col sm:flex-row gap-4">
                                {interviewMode ? (
                                    <Button onClick={startInterview} disabled={loading || isListening} className="flex-1">
                                        <Sparkles className="mr-2" /> Start Interview
                                    </Button>
                                ) : (
                                    <Button onClick={toggleListening} disabled={loading} variant={isListening ? 'secondary' : 'default'} className="flex-1">
                                        {isListening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                                        {isListening ? 'Stop Recording' : 'Start Recording'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                           <h3 className="font-semibold text-lg">AI Coach Response</h3>
                           <Card className="min-h-[150px] bg-muted/30 p-4 flex items-center justify-center">
                               {loading ? (
                                   <div className="flex items-center justify-center h-full">
                                       <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                   </div>
                               ) : (
                                   <p className="text-muted-foreground text-center">{aiResponseText || 'AI response will appear here.'}</p>
                               )}
                           </Card>
                            {audioUrl && !loading && (
                               <div className="flex items-center justify-center gap-4 p-2 border rounded-lg bg-muted/50">
                                    <audio ref={audioRef} src={audioUrl} onEnded={() => setAudioUrl(null)} autoPlay />
                                    <p className="text-sm font-medium">Playing AI response...</p>
                                    <Button onClick={stopPlayback} variant="ghost" size="icon">
                                        <Square className="w-5 h-5" />
                                        <span className="sr-only">Stop Playback</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {interviewMode && feedback && !loading && (
                        <div className="space-y-4 pt-4">
                            <Separator />
                            <h3 className="font-semibold text-lg flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-primary"/> Interview Feedback</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader className="flex-row items-center gap-2 pb-2">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <CardTitle className="text-base">Clarity</CardTitle>
                                    </CardHeader>
                                    <CardContent><p className="text-sm text-muted-foreground">{feedback.clarity}</p></CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex-row items-center gap-2 pb-2">
                                        <ThumbsUp className="w-5 h-5 text-blue-500" />
                                        <CardTitle className="text-base">Relevance</CardTitle>
                                    </CardHeader>
                                    <CardContent><p className="text-sm text-muted-foreground">{feedback.relevance}</p></CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader className="flex-row items-center gap-2 pb-2">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        <CardTitle className="text-base">Confidence</CardTitle>
                                    </CardHeader>
                                    <CardContent><p className="text-sm text-muted-foreground">{feedback.confidence}</p></CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
