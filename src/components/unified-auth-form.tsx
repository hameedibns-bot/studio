
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

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

function isEmail(identifier: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
}

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
    }
}

export function UnifiedAuthForm() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'otp' | 'email-sent'>('input');
    const [loginHint, setLoginHint] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
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

    // Effect for handling email link sign-in on component mount
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
                        toast({ variant: 'destructive', title: 'Error', description: 'Failed to sign in. The link may have expired or been used.' });
                        setLoading(false);
                        router.push('/auth');
                    }
                }
            }
        };
        handleEmailLinkSignIn();
    }, [router, toast]);

    // Effect to manage reCAPTCHA verifier lifecycle
    useEffect(() => {
        if (step === 'input') {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => { /* reCAPTCHA solved */ }
            });
        }
    
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        };
    }, [step]);


    const handleIdentifierSubmit = async (values: z.infer<typeof identifierSchema>) => {
        setLoading(true);
        const { identifier } = values;

        if (isEmail(identifier)) {
            const actionCodeSettings = {
                url: `${window.location.origin}/dashboard`,
                handleCodeInApp: true,
            };
            try {
                await sendSignInLinkToEmail(auth, identifier, actionCodeSettings);
                window.localStorage.setItem('emailForSignIn', identifier);
                setLoginHint(identifier);
                setStep('email-sent');
                toast({ title: 'Check your email', description: `A sign-in link has been sent to ${identifier}.` });
            } catch (error: any) {
                 toast({ variant: 'destructive', title: 'Error', description: 'Failed to send sign-in link. Please check the email and try again.' });
            }
        } else if (phoneRegex.test(identifier)) {
            try {
                if (!window.recaptchaVerifier) {
                    throw new Error("reCAPTCHA verifier not initialized.");
                }
                const result = await signInWithPhoneNumber(auth, identifier, window.recaptchaVerifier);
                setConfirmationResult(result);
                setLoginHint(identifier);
                setStep('otp');
                toast({ title: 'OTP Sent', description: `A code has been sent to ${identifier}.`});
            } catch (error: any) {
                 toast({ variant: 'destructive', title: 'Error', description: `Failed to send OTP. Please check the number and try again. ${error.message}` });
            }
        } else {
            identifierForm.setError("identifier", { type: "manual", message: "Please enter a valid email or phone number (e.g., +1234567890)." });
        }
        setLoading(false);
    };

    const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
        if (!confirmationResult) {
            toast({ variant: 'destructive', title: 'Error', description: 'Verification session expired. Please try again.' });
            setStep('input');
            return;
        }
        setLoading(true);
        try {
            await confirmationResult.confirm(values.otp);
            router.push('/dashboard');
        } catch (error) {
            otpForm.setError("otp", { type: "manual", message: "Invalid OTP. Please try again." });
        } finally {
            setLoading(false);
        }
    };
    
    const handleBack = () => {
        setStep('input');
        identifierForm.reset();
        otpForm.reset();
    }

    if (step === 'email-sent') {
        return (
            <div className="text-center space-y-4">
                <h3 className="font-headline text-xl">Check your inbox</h3>
                <p className="text-muted-foreground text-sm">A sign-in link has been sent to <span className="font-semibold text-foreground">{loginHint}</span>. Click the link there to complete your sign-in.</p>
                <Button variant="outline" onClick={handleBack}>Use another account</Button>
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
                 <Button variant="link" size="sm" className="p-0 h-auto w-full" onClick={handleBack}>Use another method</Button>
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
