
import { Button } from "./ui/button";
import { Sparkles, Lock } from "lucide-react";

export function FeatureLock() {
    return (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg z-10 rounded-lg flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2">Unlock This Pro Feature</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
                Upgrade to Pro+ to access premium features like the Resume Optimizer, Study Assistant, and Data Vault to accelerate your growth and secure your data.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="w-5 h-5 mr-2" />
                Upgrade to Pro+
            </Button>
        </div>
    );
}
