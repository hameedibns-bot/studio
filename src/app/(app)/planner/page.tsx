'use client';

import { PlannerForm } from "@/components/planner-form";

export default function PlannerPage() {
    return (
        <div className="space-y-4">
            <header>
                <h2 className="text-3xl font-headline font-bold">Smart Daily Planner</h2>
                <p className="text-muted-foreground">Let our AI organize your day for maximum productivity and balance.</p>
            </header>
            <PlannerForm />
        </div>
    );
}
