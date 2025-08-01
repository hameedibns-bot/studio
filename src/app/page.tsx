import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-4 flex justify-between items-center container mx-auto">
        <Logo />
        <Button asChild variant="ghost">
          <Link href="/auth">
            Login
          </Link>
        </Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Unlock Your Potential with AI
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            ProLife+ is your all-in-one AI coach for productivity, career, and wellness. Achieve your goals faster with personalized guidance.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/auth">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ProLife+ AI Coach. All rights reserved.</p>
      </footer>
    </div>
  );
}
