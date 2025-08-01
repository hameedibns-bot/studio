
"use client"

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FeatureLock } from '@/components/feature-lock';

type Goal = {
  id: number;
  title: string;
  description: string;
  progress: number;
};

const initialGoals: Goal[] = [
  { id: 1, title: "Run a 5k Marathon", description: "Train consistently for the upcoming city marathon.", progress: 40 },
  { id: 2, title: "Read 12 Books This Year", description: "Finish one book every month.", progress: 75 },
  { id: 3, title: "Learn React Native", description: "Build and deploy a mobile app.", progress: 60 },
  { id: 4, title: "Daily Meditation", description: "Practice mindfulness for 10 minutes every day.", progress: 90 },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [open, setOpen] = useState(false);
  const isPro = false; // This would be dynamic based on user auth

  const handleAddGoal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if(title && description) {
      const newGoal: Goal = {
        id: goals.length + 1,
        title,
        description,
        progress: 0,
      };
      setGoals([...goals, newGoal]);
      setOpen(false);
      form.reset();
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold">Goals & Habits</h2>
          <p className="text-muted-foreground">Track your ambitions and build better habits.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="relative">
             {!isPro && <FeatureLock />}
            <DialogHeader>
              <DialogTitle>Create a New Goal</DialogTitle>
              <DialogDescription>What new heights do you want to reach?</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddGoal}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" name="title" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input id="description" name="description" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                   <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Goal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <Target className="w-6 h-6 text-accent shrink-0 mt-1" />
                <span>{goal.title}</span>
              </CardTitle>
              <CardDescription>{goal.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} aria-label={`${goal.title} progress at ${goal.progress} percent`} />
              </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">Mark as Complete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
