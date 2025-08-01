
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, HelpCircle, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const proFeatures = [
    "AI Resume Optimizer",
    "AI Study Assistant",
    "Secure Data Vault",
    "Advanced AI Insights",
    "Priority Support",
];

// Base price in INR
const basePriceINR = 3700;
// Example conversion rate, in a real app this would be from an API
const conversionRate = 0.012; // 1 INR = 0.012 USD
const priceUSD = (basePriceINR * conversionRate).toFixed(2);

export function PricingCard() {
    return (
        <Card className="max-w-md w-full shadow-2xl border-primary/20 bg-card">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold font-headline">Pro+ Plan</CardTitle>
                <CardDescription>Everything you need to unlock your full potential.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <span className="text-5xl font-bold">${priceUSD}</span>
                    <span className="text-muted-foreground">/ month</span>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                        <span>Approximately ₹{basePriceINR} INR</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="w-3 h-3 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Price shown in your local currency. Final charge may vary slightly due to exchange rates.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <ul className="space-y-3">
                    {proFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full" size="lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Upgrade Now
                </Button>
            </CardFooter>
        </Card>
    )
}
