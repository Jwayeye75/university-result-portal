import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/MobileNav';

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

  return (
    <div className="flex min-h-screen bg-background pb-16 md:pb-0">
      {/* DESKTOP SIDEBAR (Hidden on mobile) */}
      <aside className="w-64 border-r border-border bg-card hidden md:block print:hidden">
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
      </aside>

      {/* MOBILE BOTTOM NAVIGATION (Hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-16 z-50 print:hidden font-mono text-xs">
        <Link href="/dashboard" className="flex flex-col items-center p-2 text-muted-foreground hover:text-success">
          <span>Home</span>
        </Link>
        {role === 'admin' && (
          <Link href="/dashboard/students" className="flex flex-col items-center p-2 text-muted-foreground hover:text-success">
            <span>Students</span>
          </Link>
        )}
        {role === 'admin' && (
          <Link href="/dashboard/courses" className="flex flex-col items-center p-2 text-muted-foreground hover:text-success">
            <span>Courses</span>
          </Link>
        )}
        {(role === 'admin' || role === 'teacher') && (
          <Link href="/dashboard/results" className="flex flex-col items-center p-2 text-muted-foreground hover:text-success">
            <span>Results</span>
          </Link>
        )}
        {role === 'student' && (
          <Link href="/dashboard/my-results" className="flex flex-col items-center p-2 text-muted-foreground hover:text-success">
            <span>Grades</span>
          </Link>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col w-full max-w-full overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between md:justify-end px-4 md:px-6 print:hidden">
          {/* Mobile Only: Hamburger menu + title */}
          <div className="flex items-center gap-3 md:hidden">
            <MobileNav role={role} />
            <h2 className="text-xl font-serif text-success font-bold tracking-tight">Portal</h2>
          </div>
          
          <form action={signOut}>
            <Button variant="outline" size="sm" className="font-mono text-failure border-failure/50 hover:bg-failure/10 hover:text-failure">
              Sign Out
            </Button>
          </form>
        </header>
        
        <div className="p-4 md:p-6 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}