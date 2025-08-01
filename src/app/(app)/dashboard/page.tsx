import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Lightbulb, BarChart, Heart, Briefcase, BookOpen, Sparkles } from "lucide-react";
import { GoalProgressChart } from "@/components/goal-progress-chart";
import { MoodJournalForm } from "@/components/mood-journal-form";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const isPro = false; // This would be dynamic based on user auth

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold">Welcome back, User!</h2>
        <p className="text-muted-foreground">Here is your personalized deck for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-card-sky-blue/20 border-card-sky-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-card-sky-blue" />
              Today's Plan
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-card-sky-blue hover:bg-card-sky-blue/20 hover:text-card-sky-blue">
              <Link href="/planner">
                View Planner <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
               <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-card-sky-blue shrink-0" />
                <div>
                  <p className="font-medium">Morning workout</p>
                  <p className="text-sm text-muted-foreground">7:00 AM - 8:00 AM</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-card-sky-blue shrink-0" />
                <div>
                  <p className="font-medium">Team Stand-up</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 9:30 AM</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-accent shrink-0" />
                <div>
                  <p className="font-medium">Work on 'ProLife+' Project</p>
                  <p className="text-sm text-muted-foreground">9:30 AM - 12:00 PM</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card-mint-green/20 border-card-mint-green/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-card-mint-green" />
              Mood Journal
            </CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodJournalForm />
          </CardContent>
        </Card>
        
        <Card className="bg-card-amber/20 border-card-amber/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-card-amber" /> 
                Daily AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              "You completed 80% of your tasks yesterday after your morning workout. Starting today with exercise could lead to another productive day."
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card-deep-red/20 border-card-deep-red/30 relative">
          {!isPro && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 rounded-lg"></div>}
          <CardHeader>
             <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-card-deep-red" />
                  Career Growth
                </div>
                <Badge variant="destructive" className="bg-card-deep-red/80 text-white">Pro</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
             <p className="text-sm text-muted-foreground mb-4">Ready to optimize your resume for that dream job?</p>
             <Button asChild variant="outline" className="bg-transparent border-card-deep-red/50 text-card-deep-red hover:bg-card-deep-red/10 hover:text-card-deep-red">
                <Link href="/resume">Optimize Resume</Link>
             </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-card-purple-gradient/20 border-card-purple-gradient/30 relative">
          {!isPro && <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 rounded-lg"></div>}
          <CardHeader>
             <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-card-purple-gradient" />
                    Study Smart
                </div>
                <Badge className="bg-card-purple-gradient/80 text-white border-none">Pro</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
             <p className="text-sm text-muted-foreground mb-4">Generate a study plan for your upcoming exams.</p>
             <Button asChild variant="outline" className="bg-transparent border-card-purple-gradient/50 text-card-purple-gradient hover:bg-card-purple-gradient/10 hover:text-card-purple-gradient">
                <Link href="/study">Get Study Plan</Link>
             </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary"/>
                Goals & Habits Progress
            </CardTitle>
             <Button asChild variant="ghost" size="sm">
              <Link href="/goals">
                Manage Goals <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
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
