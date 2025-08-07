
'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/client';
import { 
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    signInWithEmailLink, 
    isSignInWithEmailLink, 
    sendSignInLinkToEmail, 
    ConfirmationResult, 
    GoogleAuthProvider, 
    signInWithPopup,
    signInAnonymously
} from "firebase/auth";
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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.344-11.303-8H6.306C9.656,39.663,16.318,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.02,35.622,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export function UnifiedAuthForm() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'otp' | 'email-sent'>('input');
    const [loginHint, setLoginHint] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

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
                        toast({ variant: 'destructive', title: 'Error', description: 'Failed to sign in. The link may have expired or been used.' });
                        setLoading(false);
                        router.push('/auth');
                    }
                }
            }
        };
        handleEmailLinkSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function to get or create RecaptchaVerifier
    const getRecaptchaVerifier = () => {
        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
            });
        }
        return recaptchaVerifierRef.current;
    }

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
                const verifier = getRecaptchaVerifier();
                const result = await signInWithPhoneNumber(auth, identifier, verifier);
                setConfirmationResult(result);
                setLoginHint(identifier);
                setStep('otp');
                toast({ title: 'OTP Sent', description: `A code has been sent to ${identifier}.`});
            } catch (error: any) {
                 toast({ variant: 'destructive', title: 'Error', description: `Failed to send OTP. Please check the number and try again. ${error.message}` });
                 // Reset reCAPTCHA
                 if (recaptchaVerifierRef.current) {
                    recaptchaVerifierRef.current.clear();
                    recaptchaVerifierRef.current = null;
                 }
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
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: 'Could not sign in with Google. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleGuestSignIn = async () => {
        setLoading(true);
        try {
            await signInAnonymously(auth);
            router.push('/dashboard');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Guest Sign-In Failed', description: 'Could not sign in as a guest. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const identifierForm = useForm<z.infer<typeof identifierSchema>>({
        resolver: zodResolver(identifierSchema),
        defaultValues: { identifier: '' },
    });

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' },
    });

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
        <div className="space-y-4">
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
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                Continue with Google
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleGuestSignIn} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <User className="mr-2 h-4 w-4" />}
                Continue as Guest
            </Button>
        </div>
    );
}
