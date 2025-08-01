import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MoodJournalForm } from "@/components/mood-journal-form";
import { GoalProgressChart } from "@/components/goal-progress-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold">Welcome back, User!</h2>
        <p className="text-muted-foreground">Here's your personalized dashboard for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Today's Plan</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/planner">
                View Planner <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="font-medium">Morning workout</p>
                  <p className="text-sm text-muted-foreground">7:00 AM - 8:00 AM</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
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
              <li className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-secondary shrink-0" />
                <div>
                  <p className="font-medium">Read 'Atomic Habits'</p>
                  <p className="text-sm text-muted-foreground">1:00 PM - 1:30 PM</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mood Journal</CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodJournalForm />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Goals & Habits Progress</CardTitle>
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
