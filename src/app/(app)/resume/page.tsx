import { ResumeOptimizerForm } from "@/components/resume-optimizer-form";

export default function ResumePage() {
    return (
        <div className="space-y-4">
            <header>
                <h2 className="text-3xl font-headline font-bold">Resume Optimizer</h2>
                <p className="text-muted-foreground">Get AI-powered feedback to make your resume stand out.</p>
            </header>
            <ResumeOptimizerForm />
        </div>
    );
}
