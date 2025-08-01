import { StudyPlanForm } from "@/components/study-plan-form";
import { FeatureLock } from "@/components/feature-lock";

export default function StudyPage() {
    const isPro = false; // This would be dynamic based on user auth

    return (
        <div className="space-y-4 relative">
            {!isPro && <FeatureLock />}
            <header>
                <h2 className="text-3xl font-headline font-bold">Study Assistant</h2>
                <p className="text-muted-foreground">Generate personalized study plans, flashcards, and more with AI.</p>
            </header>
            <StudyPlanForm />
        </div>
    );
}
