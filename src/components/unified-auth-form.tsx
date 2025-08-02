
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/client';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailLink, isSignInWithEmailLink, sendSignInLinkToEmail, ConfirmationResult } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';

const identifierSchema = z.object({
  identifier: z.string().min(1, 'Please enter your email or phone number.'),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'Your OTP should be 6 digits.').max(6),
});

// A simple regex to check for a pattern that looks like a phone number.
// This doesn't need to be perfect, as Firebase will do the real validation.
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

function isEmail(identifier: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
}

// Store verifier and confirmation result on the window object to preserve across re-renders
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}

export function UnifiedAuthForm() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'otp' | 'email-sent'>('input');
    const [loginHint, setLoginHint] = useState('');
    const [authMethod, setAuthMethod] = useState<'email' | 'phone' | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const identifierForm = useForm<z.infer<typeof identifierSchema>>({
        resolver: zodResolver(identifierSchema),
        defaultValues: { identifier: '' },
    });

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    });

    // Handle email link sign-in on component mount
    useEffect(() => {
        const handleEmailLinkSignIn = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    email = window.prompt('Please provide your email for confirmation');
                }
                if (email) {
                    setLoading(true);
                    try {
                        await signInWithEmailLink(auth, email, window.location.href);
                        window.localStorage.removeItem('emailForSignIn');
                        router.push('/dashboard');
                    } catch (error) {
                        toast({ variant: 'destructive', title: 'Error', description: 'Failed to sign in. The link may have expired.' });
                        setLoading(false);
                    }
                }
            }
        };
        handleEmailLinkSignIn();
    }, [router, toast]);

    const handleIdentifierSubmit = async (values: z.infer<typeof identifierSchema>) => {
        setLoading(true);
        const { identifier } = values;

        if (isEmail(identifier)) {
            setAuthMethod('email');
            await handleEmailSubmit(identifier);
        } else if (phoneRegex.test(identifier)) {
            setAuthMethod('phone');
            await handlePhoneSubmit(identifier);
        } else {
            identifierForm.setError("identifier", { type: "manual", message: "Please enter a valid email or phone number (e.g., +1234567890)." });
            setLoading(false);
        }
    };
    
    const handleEmailSubmit = async (email: string) => {
        const actionCodeSettings = {
            url: window.location.origin + '/dashboard',
            handleCodeInApp: true,
        };
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            setLoginHint(email);
            setStep('email-sent');
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Error', description: 'Failed to send sign-in link. Please try again.' });
        } finally {
            setLoading(false);
        }
    };
    
    const handlePhoneSubmit = async (phone: string) => {
        try {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => { /* reCAPTCHA solved */ }
            });
            const confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
            window.confirmationResult = confirmationResult;
            setLoginHint(phone);
            setStep('otp');
            toast({ title: 'OTP Sent', description: `A code has been sent to ${phone}.`});
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Error', description: 'Failed to send OTP. Please check your number and try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
        setLoading(true);
        try {
            if (!window.confirmationResult) throw new Error("Confirmation result not available.");
            await window.confirmationResult.confirm(values.otp);
            router.push('/dashboard');
        } catch (error) {
            otpForm.setError("otp", { type: "manual", message: "Invalid OTP. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (step === 'email-sent') {
        return (
            <div className="text-center space-y-4">
                <h3 className="font-headline text-xl">Check your inbox</h3>
                <p className="text-muted-foreground text-sm">A sign-in link has been sent to <span className="font-semibold text-foreground">{loginHint}</span>. Click the link there to complete your sign-in.</p>
                <Button variant="outline" onClick={() => { setStep('input'); identifierForm.reset(); }}>Use another account</Button>
            </div>
        );
    }

    if (step === 'otp') {
        return (
            <div className='space-y-4'>
                 <div className="text-center">
                    <h3 className="font-headline text-xl">Enter your code</h3>
                    <p className="text-muted-foreground text-sm">An OTP was sent to <span className="font-semibold text-foreground">{loginHint}</span>.</p>
                </div>
                <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                        <FormField control={otpForm.control} name="otp" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">One-Time Password</FormLabel>
                                <FormControl><Input placeholder="_ _ _ _ _ _" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify
                        </Button>
                    </form>
                </Form>
                 <Button variant="link" size="sm" className="p-0 h-auto w-full" onClick={() => setStep('input')}>Use another method</Button>
            </div>
        );
    }
    
    return (
        <Form {...identifierForm}>
            <form onSubmit={identifierForm.handleSubmit(handleIdentifierSubmit)} className="space-y-4">
                <FormField control={identifierForm.control} name="identifier" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email or Phone</FormLabel>
                        <FormControl>
                            <Input placeholder="you@example.com or +1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                </Button>
            </form>
        </Form>
    );
}
