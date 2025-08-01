
import { MealPlan } from "@/components/meal-plan";

export default function NutritionPage() {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-headline font-bold">AI Nutrition Plan</h2>
                <p className="text-muted-foreground">A balanced meal plan crafted for your general wellness.</p>
            </header>
            <MealPlan />
        </div>
    );
}
