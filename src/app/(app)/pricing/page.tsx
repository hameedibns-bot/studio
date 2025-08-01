
import { PricingCard } from "@/components/pricing-card";

export default function PricingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-full p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-headline font-bold">Upgrade to Pro+</h1>
                <p className="text-muted-foreground mt-2">Unlock your full potential with our premium AI features.</p>
            </div>
            <PricingCard />
        </div>
    );
}
