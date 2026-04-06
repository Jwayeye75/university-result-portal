'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

interface MobileNavProps {
  role: string;
}

export function MobileNav({ role }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-card border-r-border">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-serif text-success font-bold tracking-tight">Result Portal</h2>
          <p className="text-sm font-mono text-info mt-1 capitalize bg-info/10 inline-block px-2 py-0.5 rounded">
            Role: {role}
          </p>
        </div>
        <nav className="px-4 space-y-2 mt-6 flex flex-col font-mono text-sm">
          <Link href="/dashboard" className="px-4 py-2 hover:bg-muted hover:text-success rounded-md transition-colors">Overview</Link>
          {role === 'admin' && (
            <>
              <Link href="/dashboard/students" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">Manage Students</Link>
              <Link href="/dashboard/courses" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">Manage Courses</Link>
            </>
          )}
          {(role === 'admin' || role === 'teacher') && (
            <Link href="/dashboard/results" className="px-4 py-2 hover:bg-muted rounded-md transition-colors">Upload Results</Link>
          )}
          {role === 'student' && (
            <Link href="/dashboard/my-results" className="px-4 py-2 hover:bg-muted hover:text-info rounded-md transition-colors">My Results</Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
