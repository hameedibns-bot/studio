'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2, Sparkles, BookOpen, BrainCircuit, ListChecks, HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { generateStudyPlan, StudyPlanOutput } from "@/ai/flows/study-plan-generator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "./ui/scroll-area"

const studyPlanFormSchema = z.object({
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  examDate: z.date({ required_error: "An exam date is required." }),
  topics: z.string().min(5, { message: "Please list some topics." }),
  studyHoursPerDay: z.coerce.number().min(1).max(12),
})

export function StudyPlanForm() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StudyPlanOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof studyPlanFormSchema>>({
    resolver: zodResolver(studyPlanFormSchema),
    defaultValues: { studyHoursPerDay: 3 },
  })

  async function onSubmit(data: z.infer<typeof studyPlanFormSchema>) {
    setLoading(true)
    setResult(null)
    try {
      const res = await generateStudyPlan({ ...data, examDate: format(data.examDate, 'yyyy-MM-dd') })
      setResult(res)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate study plan. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="subject" render={({ field }) => (
              <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g. Quantum Physics" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="topics" render={({ field }) => (
              <FormItem><FormLabel>Topics to Cover</FormLabel><FormControl><Textarea placeholder="e.g. Superposition, Quantum Entanglement, Wave-particle duality" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="examDate" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel>Exam Date</FormLabel>
                <Popover><PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="studyHoursPerDay" render={({ field }) => (
              <FormItem><FormLabel>Study Hours per Day</FormLabel><FormControl><Input type="number" min="1" max="12" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Plan
            </Button>
          </form>
        </Form>
      </div>

      <div className="md:col-span-2 min-h-[500px]">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="font-semibold">Generating your personalized study plan...</p>
            <p className="text-sm text-muted-foreground">AI is hard at work. This might take a moment.</p>
          </div>
        )}
        {!loading && result && (
          <Card className="h-full">
            <CardHeader>
                <CardTitle>Your Personalized Study Plan</CardTitle>
                <CardDescription>Use the tabs below to explore your generated study materials.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="plan">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="plan"><ListChecks className="w-4 h-4 mr-2" />Plan</TabsTrigger>
                        <TabsTrigger value="flashcards"><BrainCircuit className="w-4 h-4 mr-2" />Flashcards</TabsTrigger>
                        <TabsTrigger value="summaries"><BookOpen className="w-4 h-4 mr-2" />Summaries</TabsTrigger>
                        <TabsTrigger value="questions"><HelpCircle className="w-4 h-4 mr-2" />Questions</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[400px] mt-4">
                      <TabsContent value="plan"><div className="pr-4 whitespace-pre-wrap">{result.studyPlan}</div></TabsContent>
                      <TabsContent value="flashcards"><div className="space-y-2 pr-4">{result.flashcards.map((f, i) => <div key={i} className="p-3 border rounded-md text-sm">{f}</div>)}</div></TabsContent>
                      <TabsContent value="summaries"><div className="space-y-2 pr-4">{result.summaries.map((s, i) => <div key={i} className="p-3 border rounded-md text-sm">{s}</div>)}</div></TabsContent>
                      <TabsContent value="questions"><div className="space-y-2 pr-4">{result.practiceQuestions.map((q, i) => <div key={i} className="p-3 border rounded-md text-sm">{q}</div>)}</div></TabsContent>
                    </ScrollArea>
                </Tabs>
            </CardContent>
          </Card>
        )}
         {!loading && !result && (
              <div className="flex flex-col items-center justify-center h-full rounded-lg border border-dashed p-8 text-center bg-muted/50">
                  <BookOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">Ready to ace your exam?</h3>
                  <p className="text-muted-foreground text-sm">Fill in your study details to get a custom plan.</p>
              </div>
         )}
      </div>
    </div>
  )
}
