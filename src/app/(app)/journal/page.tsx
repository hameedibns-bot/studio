import { MoodJournalForm } from "@/components/mood-journal-form";

export default function JournalPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <MoodJournalForm showTitle={true} />
        </div>
    );
}
