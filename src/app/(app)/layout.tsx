
'use client'

import { AppShell } from "@/components/app-shell";
import { PrayerTimeProvider } from "@/hooks/use-prayer-time";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrayerTimeProvider>
      <AppShell>{children}</AppShell>
    </PrayerTimeProvider>
  );
}
