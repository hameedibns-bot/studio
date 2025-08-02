
'use client'

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/client';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailLink, isSignInWithEmailLink, sendSignInLinkToEmail, ConfirmationResult } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';


const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

const phoneSchema = z.object({
  phone: z.string().refine(isPossiblePhoneNumber, { message: 'Please enter a valid phone number.' }),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'Your OTP should be 6 digits.').max(6),
});

type AuthFormProps = {
    method: 'email' | 'phone';
}

// Store these on the window object to preserve them across re-renders
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
        grecaptcha?: any;
    }
}

export function AuthForm({ method }: AuthFormProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'otp'>('input');
    const [loginHint, setLoginHint] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: '' },
    });

    const phoneForm = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phone: '' },
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
                        toast({ variant: 'destructive', title: 'Error', description: 'Failed to sign in with email link.' });
                        setLoading(false);
                    }
                }
            }
        };
        handleEmailLinkSignIn();
    }, [router, toast]);

    // Effect for setting up reCAPTCHA for phone auth
    useEffect(() => {
        if (method === 'phone') {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => { /* reCAPTCHA solved */ }
            });
        }
        return () => {
            window.recaptchaVerifier?.clear();
        }
    }, [method]);


    const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
        setLoading(true);
        const actionCodeSettings = {
            url: window.location.origin + '/auth',
            handleCodeInApp: true,
        };
        try {
            await sendSignInLinkToEmail(auth, values.email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', values.email);
            setLoginHint(values.email);
            toast({ title: 'Check your email', description: `A sign-in link has been sent to ${values.email}.` });
            setStep('otp'); // Re-using OTP step to show a message
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/configuration-not-found') {
                toast({ variant: 'destructive', title: 'Configuration Error', description: 'Email sign-in is not enabled. Please enable the Email/Password provider in your Firebase console.' });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to send sign-in link. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handlePhoneSubmit = async (values: z.infer<typeof phoneSchema>) => {
        setLoading(true);
        try {
            const verifier = window.recaptchaVerifier;
            if (!verifier) throw new Error("reCAPTCHA verifier not initialized.");
            
            const confirmationResult = await signInWithPhoneNumber(auth, values.phone, verifier);
            window.confirmationResult = confirmationResult;
            setLoginHint(values.phone);
            setStep('otp');
            toast({ title: 'OTP Sent', description: 'A one-time password has been sent to your phone.'});
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/configuration-not-found') {
                toast({ variant: 'destructive', title: 'Configuration Error', description: 'Phone sign-in is not enabled. Please go to the Firebase console and enable the Phone provider.' });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to send OTP. This can happen if Phone Sign-In is not enabled in your Firebase project. Please try again.' });
            }
            // Reset reCAPTCHA on error
            if (window.grecaptcha && window.recaptchaVerifier) {
                window.grecaptcha.reset(window.recaptchaVerifier.widgetId);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
       await handlePhoneSubmit({ phone: loginHint });
    }

    const handleOtpSubmit = async (values: z.infer<typeof otpSchema>) => {
        setLoading(true);
        try {
            if (!window.confirmationResult) throw new Error("Confirmation result not available.");
            await window.confirmationResult.confirm(values.otp);
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            otpForm.setError("otp", { type: "manual", message: "Invalid OTP. Please try again." });
            toast({ variant: 'destructive', title: 'Error', description: 'Invalid OTP. Please try again.' });
        } finally {
            setLoading(false);
        }
    };
    
    if (step === 'otp') {
        if (method === 'email') {
            return (
                <>
                    <CardHeader>
                        <CardTitle className="font-headline">Check your inbox</CardTitle>
                        <CardDescription>
                            A sign-in link has been sent to {loginHint}. Click the link to complete your sign-in.
                        </CardDescription>
                    </CardHeader>
                </>
            )
        }
        return (
             <>
                <CardHeader>
                    <CardTitle className="font-headline">Verify your identity</CardTitle>
                    <CardDescription>
                        An OTP was sent to {loginHint}. Please enter it below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...otpForm}>
                        <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                            <FormField control={otpForm.control} name="otp" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>One-Time Password</FormLabel>
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
                </CardContent>
                <CardFooter className="text-sm text-center block">
                    Didn't receive it? <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleResendOtp} disabled={loading}>Resend OTP</Button>
                </CardFooter>
            </>
        )
    }

    if (method === 'email') {
        return (
            <>
                <CardHeader>
                    <CardTitle className="font-headline">Continue with Email</CardTitle>
                    <CardDescription>Enter your email to receive a secure sign-in link.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                            <FormField control={emailForm.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Sign-in Link
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </>
        );
    }

    if (method === 'phone') {
         return (
            <>
                <CardHeader>
                    <CardTitle className="font-headline">Continue with Phone</CardTitle>
                    <CardDescription>Enter your phone number to receive a one-time password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...phoneForm}>
                        <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                            <FormField control={phoneForm.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            {...field}
                                            international
                                            countryCallingCodeEditable={false}
                                            defaultCountry="US"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send OTP
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </>
        );
    }
    
    return null;
}
