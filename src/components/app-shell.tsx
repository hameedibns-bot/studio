
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { LayoutDashboard, CalendarCheck, Target, FileText, BookOpen, HeartPulse, Languages, ShieldCheck, Moon, Sparkles, Salad } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePrayerTime } from '@/hooks/use-prayer-time';
import { PrayerTimeOverlay } from './prayer-time-overlay';


const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/planner', label: 'Daily Planner', icon: CalendarCheck },
  { href: '/goals', label: 'Goals & Habits', icon: Target },
  { href: '/resume', label: 'Resume Optimizer', icon: FileText, pro: true },
  { href: '/study', label: 'Study Assistant', icon: BookOpen, pro: true },
  { href: '/journal', label: 'Mood Journal', icon: HeartPulse },
  { href: '/nutrition', label: 'Nutrition', icon: Salad },
  { href: '/vault', label: 'Data Vault', icon: ShieldCheck, pro: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isPrayerTime, currentPrayer, prayerTimes, error } = usePrayerTime();

  const getPageTitle = () => {
    // Find the item that matches the start of the path, but handle dashboard as an exact match
    const currentItem = navItems.find(item => {
        if (item.href === '/dashboard') return pathname === item.href;
        // check if other paths start with href, except for dashboard
        return pathname.startsWith(item.href) && item.href !== '/dashboard';
    }) ?? navItems.find(item => item.href === '/dashboard');
    return currentItem ? currentItem.label : 'ProLife+';
  }

  return (
    <>
      <PrayerTimeOverlay isVisible={isPrayerTime} prayerName={currentPrayer} />
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.href === '/dashboard' 
                  ? pathname === item.href 
                  : pathname.startsWith(item.href);
                return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                       {item.pro && <SidebarMenuBadge>Pro</SidebarMenuBadge>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )})}
            </SidebarMenu>
             {prayerTimes && (
              <div className="p-4 space-y-2 text-xs text-sidebar-foreground/70 group-data-[state=collapsed]:hidden">
                  <h4 className="font-semibold text-sidebar-foreground/90 flex items-center gap-2"><Moon className="w-4 h-4" /> Today's Prayers</h4>
                  <div className="space-y-1">
                      <div>Fajr: {prayerTimes.Fajr}</div>
                      <div>Dhuhr: {prayerTimes.Dhuhr}</div>
                      <div>Asr: {prayerTimes.Asr}</div>
                      <div>Maghrib: {prayerTimes.Maghrib}</div>
                      <div>Isha: {prayerTimes.Isha}</div>
                  </div>
                   {error && <div className="text-destructive text-xs">{error}</div>}
              </div>
            )}
          </SidebarContent>
          <SidebarFooter>
            <div className="flex flex-col gap-4 p-2">
               <div className="flex items-center gap-2 group-data-[state=collapsed]:justify-center">
                <Languages className="w-5 h-5 text-sidebar-foreground/70 shrink-0" />
                <div className="group-data-[state=collapsed]:hidden w-full">
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full border-none h-auto p-0 text-sm bg-transparent focus:ring-0">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="ur">اردو</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                      <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="person avatar" />
                      <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col group-data-[state=collapsed]:hidden">
                      <span className="text-sm font-medium text-sidebar-foreground">User</span>
                      <span className="text-xs text-sidebar-foreground/70">user@example.com</span>
                  </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-2xl font-headline font-semibold">
                {getPageTitle()}
              </h2>
            </div>
            <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90 border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro+
            </Button>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
