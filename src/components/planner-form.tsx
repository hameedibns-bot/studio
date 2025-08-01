'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { smartDailyPlanner, SmartDailyPlannerOutput } from '@/ai/flows/smart-daily-planner';
import { Loader2, Sparkles, CalendarDays } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const plannerFormSchema = z.object({
  goals: z.string().min(5, 'Please list at least one goal.'),
  schedule: z.string().min(5, 'Please describe your schedule or commitments.'),
  habits: z.string().min(5, 'Please list some habits you want to incorporate.'),
});

export function PlannerForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmartDailyPlannerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof plannerFormSchema>>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: { goals: '', schedule: '', habits: '' },
  });

  async function onSubmit(values: z.infer<typeof plannerFormSchema>) {
    setLoading(true);
    setResult(null);

    try {
      const res = await smartDailyPlanner(values);
      setResult(res);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate your plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Your Daily Inputs</CardTitle>
                <CardDescription>Provide context for the AI to generate your optimal plan.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField control={form.control} name="goals" render={({ field }) => (
                            <FormItem><FormLabel>Today's Top Goals</FormLabel><FormControl><Textarea placeholder="e.g., Finish Q3 report, Prepare presentation slides..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="schedule" render={({ field }) => (
                            <FormItem><FormLabel>Fixed Schedule / Appointments</FormLabel><FormControl><Textarea placeholder="e.g., 10 AM Team Meeting, 2 PM Dentist Appointment" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="habits" render={({ field }) => (
                            <FormItem><FormLabel>Habits to Include</FormLabel><FormControl><Textarea placeholder="e.g., Morning meditation, 30-min workout, Read for 20 mins" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Generate My Plan
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <div className="min-h-[400px]">
            {loading && (
                <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="font-semibold">Crafting your perfect day...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment.</p>
                </div>
            )}
            {!loading && result && (
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Your Optimized Daily Plan</CardTitle>
                        <CardDescription>Here is your AI-generated schedule for today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">{result.plan}</div>
                    </CardContent>
                </Card>
            )}
            {!loading && !result && (
                <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center bg-muted/50">
                    <CalendarDays className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-lg">Ready to plan your day?</h3>
                    <p className="text-muted-foreground text-sm">Fill in your details to get a personalized schedule.</p>
                </div>
            )}
        </div>
    </div>
  );
}
