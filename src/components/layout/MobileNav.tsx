'use client';

import Link from 'next/link';
import { Menu, LayoutDashboard, Users, BookOpen, Upload, FileText, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

interface MobileNavProps {
  role: string;
}

export function MobileNav({ role }: MobileNavProps) {
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { href: '/dashboard/students', label: 'Students', icon: Users, show: role === 'admin' },
    { href: '/dashboard/courses', label: 'Courses', icon: BookOpen, show: role === 'admin' },
    { href: '/dashboard/results', label: 'Upload Results', icon: Upload, show: role === 'admin' || role === 'teacher' },
    { href: '/dashboard/my-results', label: 'My Results', icon: FileText, show: role === 'student' },
  ].filter(item => item.show);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-white border-r border-border">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-success" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">Result Portal</h2>
              <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full capitalize">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="px-3 py-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-success hover:bg-success/5 transition-all"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
