
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Brain, Leaf, Fish, Carrot } from "lucide-react";

const mealPlan = {
    breakfast: {
        title: "Energy & Brain Boost",
        time: "7–9 AM",
        options: [
            "Overnight oats with chia, banana, and almond butter",
            "2 boiled eggs, avocado toast on whole grain, green tea",
        ],
        tags: ["Brain Fuel", "High Protein"],
        image: {
            url: "https://placehold.co/600x400.png",
            hint: "oats breakfast",
        },
    },
    morningSnack: {
        title: "Light & Anti-Crash",
        time: "10–11 AM",
        options: ["Apple or pear + handful of unsalted almonds", "Herbal tea (peppermint or ginger)"],
        tags: ["Light", "Low Sugar"],
        image: {
            url: "https://placehold.co/600x400.png",
            hint: "apple almonds",
        },
    },
    lunch: {
        title: "High Fiber & Balanced Carbs",
        time: "12–2 PM",
        options: [
            "Grilled chicken or tofu bowl with quinoa or brown rice",
            "Steamed veggies + olive oil drizzle",
        ],
        tags: ["Heart Healthy", "High Fiber"],
        image: {
            url: "https://placehold.co/600x400.png",
            hint: "chicken bowl",
        },
    },
    afternoonSnack: {
        title: "Focus Sustainer",
        time: "3–4 PM",
        options: ["Greek yogurt + berries", "Hummus + carrot sticks"],
        tags: ["Focus", "High Protein"],
        image: {
            url: "https://placehold.co/600x400.png",
            hint: "yogurt berries",
        },
    },
    dinner: {
        title: "Light, Clean & Sleep-Friendly",
        time: "6–8 PM",
        options: ["Baked salmon or lentil curry", "Steamed greens", "½ sweet potato"],
        tags: ["Sleep-Friendly", "Omega-3"],
        image: {
            url: "https://placehold.co/600x400.png",
            hint: "salmon dinner",
        },
    },
};

const getIconForTitle = (title: string) => {
    if (title.includes("Energy & Brain Boost")) return <Brain className="w-6 h-6 text-accent" />;
    if (title.includes("High Fiber & Balanced Carbs")) return <Utensils className="w-6 h-6 text-accent" />;
    if (title.includes("Light, Clean & Sleep-Friendly")) return <Fish className="w-6 h-6 text-accent" />;
    if (title.includes("Snack")) return <Carrot className="w-6 h-6 text-accent" />;
    return <Leaf className="w-6 h-6 text-accent" />;
}

export function MealPlan() {
    return (
        <div className="space-y-6">
            {Object.entries(mealPlan).map(([key, meal]) => (
                <Card key={key} className="overflow-hidden">
                    <div className="grid md:grid-cols-3">
                        <div className="md:col-span-1">
                            <Image
                                src={meal.image.url}
                                alt={meal.title}
                                width={600}
                                height={400}
                                className="object-cover w-full h-full"
                                data-ai-hint={meal.image.hint}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="flex items-center gap-3">
                                        {getIconForTitle(meal.title)}
                                        <div>
                                            {meal.title}
                                            <p className="text-sm font-normal text-muted-foreground">{meal.time}</p>
                                        </div>
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        {meal.tags.map(tag => (
                                            <Badge key={tag} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    {meal.options.map(option => (
                                        <li key={option}>{option}</li>
                                    ))}
                                </ul>
                                <p className="text-xs text-muted-foreground/80 mt-4 italic">
                                    AI Tip: This meal helps support focus and sustained energy.
                                </p>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
