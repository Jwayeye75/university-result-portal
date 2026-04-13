import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/MobileNav';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Upload, 
  GraduationCap,
  LogOut,
  Bell,
  FileText
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = userData?.role || 'student';

  const signOut = async () => {
    'use server';
    const supabaseServer = createClient();
    await supabaseServer.auth.signOut();
    redirect('/login');
  };

  // Get user initials for avatar
  const email = user.email || '';
  const initials = email.substring(0, 2).toUpperCase();

  // Build nav items based on role
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { href: '/dashboard/students', label: 'Students', icon: Users, show: role === 'admin' },
    { href: '/dashboard/courses', label: 'Courses', icon: BookOpen, show: role === 'admin' },
    { href: '/dashboard/results', label: 'Upload Results', icon: Upload, show: role === 'admin' || role === 'teacher' },
    { href: '/dashboard/my-results', label: 'My Results', icon: FileText, show: role === 'student' },
  ].filter(item => item.show);

  return (
    <div className="flex min-h-screen bg-background pb-16 md:pb-0">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="w-64 border-r border-border bg-white hidden md:flex md:flex-col print:hidden">
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

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-success hover:bg-success/5 transition-all group"
            >
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-success transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-3 border-t border-border">
          <form action={signOut}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-medium"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around items-center h-16 z-50 print:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-success transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col w-full max-w-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 md:px-6 print:hidden">
          {/* Mobile: Hamburger + title */}
          <div className="flex items-center gap-3 md:hidden">
            <MobileNav role={role} />
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-success" />
              <h2 className="text-lg font-bold text-foreground">Portal</h2>
            </div>
          </div>

          {/* Desktop: Page title area */}
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">Welcome back</p>
          </div>

          {/* Right side: notification + avatar + sign out */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-success rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center text-success font-bold text-sm">
              {initials}
            </div>
            <form action={signOut} className="hidden md:block">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </header>
        
        <div className="p-4 md:p-6 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}