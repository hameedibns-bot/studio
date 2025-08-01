
'use client'

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { AuthForm } from '@/components/auth-form';


export default function AuthPage() {
    const [authMethod, setAuthMethod] = useState<'email' | 'phone' | null>(null);

    const renderInitialState = () => (
        <>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Welcome to ProLife+</CardTitle>
                <CardDescription>Your personal AI-powered productivity and lifestyle coach.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Button variant="outline" onClick={() => setAuthMethod('email')}>
                    <Mail className="mr-2 h-4 w-4" /> Continue with Email
                </Button>
                <Button variant="outline" onClick={() => setAuthMethod('phone')}>
                    <Phone className="mr-2 h-4 w-4" /> Continue with Phone
                </Button>
            </CardContent>
        </>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div id="recaptcha-container"></div>
            <div className="absolute top-4 left-4">
                <Logo />
            </div>
            <Card className="w-full max-w-sm">
                {authMethod ? (
                    <div>
                        <Button variant="ghost" size="sm" onClick={() => setAuthMethod(null)} className="m-2">
                           <ArrowLeft className="mr-2 h-4 w-4"/> Back
                        </Button>
                        <AuthForm method={authMethod} />
                    </div>
                ) : renderInitialState()}
            </Card>
            <div className="text-center mt-4 text-sm text-muted-foreground">
                <p>By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.</p>
            </div>
        </div>
    );
}
