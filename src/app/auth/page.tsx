
'use client'

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedAuthForm } from "@/components/unified-auth-form";

export default function AuthPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div id="recaptcha-container"></div>
            <div className="absolute top-4 left-4">
                <Logo />
            </div>
            <Card className="w-full max-w-sm">
                 <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Welcome to ProLife+</CardTitle>
                    <CardDescription>Sign in with your email or phone number.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UnifiedAuthForm />
                </CardContent>
            </Card>
            <div className="text-center mt-4 text-sm text-muted-foreground">
                <p>By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.</p>
            </div>
        </div>
    );
}
