import { StudyPlanForm } from "@/components/study-plan-form";

export default function StudyPage() {
    return (
        <div className="space-y-4">
            <header>
                <h2 className="text-3xl font-headline font-bold">Study Assistant</h2>
                <p className="text-muted-foreground">Generate personalized study plans, flashcards, and more with AI.</p>
            </header>
            <StudyPlanForm />
        </div>
    );
}
