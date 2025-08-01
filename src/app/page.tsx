import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center container mx-auto">
        <h1 className="text-2xl font-headline font-bold text-primary">ProLife+</h1>
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            Login
          </Link>
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-primary">
            Unlock Your Potential with AI
          </h2>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-body">
            ProLife+ is your all-in-one AI coach for productivity, career, and wellness. Achieve your goals faster with personalized guidance.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/dashboard">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} ProLife+ AI Coach. All rights reserved.</p>
      </footer>
    </div>
  );
}
