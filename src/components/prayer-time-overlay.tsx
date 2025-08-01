
'use client'

import { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';

interface PrayerTimeOverlayProps {
  isVisible: boolean;
  prayerName: string | null;
}

export function PrayerTimeOverlay({ isVisible, prayerName }: PrayerTimeOverlayProps) {
  const [countdown, setCountdown] = useState(15 * 60);

  useEffect(() => {
    if (isVisible) {
      setCountdown(15 * 60);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 bg-background/95 z-[200] flex flex-col items-center justify-center text-center p-4">
      <Moon className="w-24 h-24 text-primary animate-pulse" />
      <h2 className="mt-8 text-4xl font-headline font-bold text-primary">
        It's time for {prayerName} prayer.
      </h2>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        This app will be paused to allow for quiet reflection and prayer. Find yourself, understand your purpose, and go to prayer for your success.
      </p>
      <div className="mt-8 text-2xl font-semibold">
        App will resume in: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <p className="mt-12 text-sm text-muted-foreground italic">
        "ALLAH IS MOST MERCIFULL AND BENEFICIAL FIND YOUSELF WHO IS ACCTUALLY YOU WHY YOU ARE HERE FIND AND GO TO PRAYER ITS FOR YOUR SUCCES"
      </p>
    </div>
  );
}
