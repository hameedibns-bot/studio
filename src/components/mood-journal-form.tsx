'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { analyzeMoodAndSuggestWellness, MoodHealthJournalOutput } from '@/ai/flows/mood-health-journal';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from './ui/use-toast';

const journalFormSchema = z.object({
  entry: z.string().min(10, 'Please write a bit more about your day.'),
});

export function MoodJournalForm({ showTitle = false }: { showTitle?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MoodHealthJournalOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof journalFormSchema>>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: { entry: '' },
  });

  async function onSubmit(values: z.infer<typeof journalFormSchema>) {
    setLoading(true);
    setResult(null);

    try {
      const res = await analyzeMoodAndSuggestWellness({ entry: values.entry });
      setResult(res);
      form.reset();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Sorry, something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <header>
            <h2 className="text-3xl font-headline font-bold">Mood & Health Journal</h2>
            <p className="text-muted-foreground">Log your feelings and get AI-powered wellness insights.</p>
        </header>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="entry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Journal Entry</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell me about your day, your mood, and your health..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Analyze my entry
          </Button>
        </form>
      </Form>
      
      {result && (
        <Card className="bg-background/50">
          <CardHeader>
            <CardTitle>Your Analysis</CardTitle>
            <CardDescription>Based on your entry, here's what I found.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Detected Mood:</h4>
              <p>{result.mood}</p>
            </div>
            <div>
              <h4 className="font-semibold">Wellness Suggestions:</h4>
              <p className="whitespace-pre-wrap">{result.suggestions}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
