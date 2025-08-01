
'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Lightbulb, BarChart, Heart, Briefcase, BookOpen, Sparkles, Target } from "lucide-react";
import { GoalProgressChart } from "@/components/goal-progress-chart";
import { MoodJournalForm } from "@/components/mood-journal-form";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const isPro = false; // This would be dynamic based on user auth
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold">Welcome back, User!</h2>
        <p className="text-muted-foreground">Here is your personalized deck for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-accent/10 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-accent" />
              Today's Plan
            </CardTitle>
            <Button onClick={() => router.push('/planner')} variant="ghost" size="sm" className="text-accent hover:bg-accent/20 hover:text-accent">
                View Planner <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
               <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-accent shrink-0" />
                <div>
                  <p className="font-medium">Morning workout</p>
                  <p className="text-sm text-muted-foreground">7:00 AM - 8:00 AM</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-accent shrink-0" />
                <div>
                  <p className="font-medium">Team Stand-up</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 9:30 AM</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="font-medium">Work on 'ProLife+' Project</p>
                  <p className="text-sm text-muted-foreground">9:30 AM - 12:00 PM</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive" />
              Mood Journal
            </CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodJournalForm />
          </CardContent>
        </Card>
        
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" /> 
                Daily AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              "You completed 80% of your tasks yesterday after your morning workout. Starting today with exercise could lead to another productive day."
            </p>
          </CardContent>
        </Card>

        <Card className="relative">
          {!isPro && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 rounded-lg"></div>}
          <CardHeader>
             <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" />
                  Career Growth
                </div>
                <Badge variant="default" className="bg-accent/80 text-white border-none">Pro</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
             <p className="text-sm text-muted-foreground mb-4">Ready to optimize your resume for that dream job?</p>
             <Button onClick={() => router.push('/resume')} variant="outline" className="border-accent/50 text-accent hover:bg-accent/10 hover:text-accent">
                Optimize Resume
             </Button>
          </CardContent>
        </Card>
        
        <Card className="relative">
          {!isPro && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 rounded-lg"></div>}
          <CardHeader>
             <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    Study Smart
                </div>
                <Badge className="bg-accent/80 text-white border-none">Pro</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
             <p className="text-sm text-muted-foreground mb-4">Generate a study plan for your upcoming exams.</p>
             <Button onClick={() => router.push('/study')} variant="outline" className="border-accent/50 text-accent hover:bg-accent/10 hover:text-accent">
                Get Study Plan
             </Button>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 bg-card-foreground/5 border-card-foreground/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-card-foreground/70"/>
                    Goals & Habits Progress
                </CardTitle>
                <Button onClick={() => router.push('/goals')} variant="ghost" size="sm">
                    Manage Goals <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </CardHeader>
            <CardContent className="pl-0">
                <GoalProgressChart />
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
