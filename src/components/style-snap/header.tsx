'use client';

import { Camera } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Camera className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl font-headline">
          StyleSnap
        </h1>
      </div>
    </header>
  );
}
