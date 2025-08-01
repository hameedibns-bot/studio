
'use client'

import { useState } from 'react';
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

export function AuthForm({ method }: AuthFormProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'otp'>('input');
    const [loginHint, setLoginHint] = useState('');
    const router = useRouter();

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


    const handleEmailSubmit = (values: z.infer<typeof emailSchema>) => {
        console.log('Email submitted', values);
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoginHint(values.email);
            setStep('otp');
            setLoading(false);
        }, 1000);
    };
    
    const handlePhoneSubmit = (values: z.infer<typeof phoneSchema>) => {
        console.log('Phone submitted', values);
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoginHint(values.phone);
            setStep('otp');
            setLoading(false);
        }, 1000);
    };

    const handleOtpSubmit = (values: z.infer<typeof otpSchema>) => {
        console.log('OTP submitted', values);
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            router.push('/dashboard');
        }, 1000);
    };

    if (step === 'otp') {
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
                    Didn't receive it? <Button variant="link" size="sm" className="p-0 h-auto">Resend OTP</Button>
                </CardFooter>
            </>
        )
    }

    if (method === 'email') {
        return (
            <>
                <CardHeader>
                    <CardTitle className="font-headline">Continue with Email</CardTitle>
                    <CardDescription>Enter your email to receive a one-time password.</CardDescription>
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
                                Send OTP
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
