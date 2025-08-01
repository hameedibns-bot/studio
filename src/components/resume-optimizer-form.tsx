'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { optimizeResume, OptimizeResumeOutput } from '@/ai/flows/resume-optimizer';
import { Loader2, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const resumeFormSchema = z.object({
  resumeText: z.string().min(50, 'Please paste your full resume.'),
  jobDescription: z.string().optional(),
});

export function ResumeOptimizerForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResumeOutput | null>(null);
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof resumeFormSchema>) {
    setLoading(true);
    setResult(null);

    try {
      const res = await optimizeResume(values);
      setResult(res);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to optimize resume. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="resumeText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Resume</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your resume content here..."
                      className="h-96"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the target job description for tailored feedback..."
                      className="h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
             <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Optimize My Resume
            </Button>
            
            {loading && (
                <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="font-semibold">Optimizing your resume...</p>
                    <p className="text-sm text-muted-foreground">Our AI is polishing your profile. Hang tight!</p>
                </div>
            )}

            {result && (
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Optimization Complete</CardTitle>
                  <CardDescription>Here is your improved resume and suggestions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileText className="w-5 h-5 text-primary" /> Optimized Resume</h4>
                    <Textarea readOnly value={result.optimizedResume} className="h-96 bg-secondary" />
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Suggestions</h4>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!result && !loading && (
              <Card className="h-full flex flex-col items-center justify-center text-center p-6 bg-muted/50">
                  <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">Ready to improve your resume?</h3>
                  <p className="text-muted-foreground text-sm">Fill in the details and let our AI get to work.</p>
              </Card>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
