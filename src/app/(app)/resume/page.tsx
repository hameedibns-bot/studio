import { ResumeOptimizerForm } from "@/components/resume-optimizer-form";
import { FeatureLock } from "@/components/feature-lock";

export default function ResumePage() {
    const isPro = false; // This would be dynamic based on user auth

    return (
        <div className="space-y-4 relative">
            {!isPro && <FeatureLock />}
            <header>
                <h2 className="text-3xl font-headline font-bold">Resume Optimizer</h2>
                <p className="text-muted-foreground">Get AI-powered feedback to make your resume stand out.</p>
            </header>
            <ResumeOptimizerForm />
        </div>
    );
}
