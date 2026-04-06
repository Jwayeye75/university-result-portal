import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

  // Fetch the user's role from our public table
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = userData?.role || 'student';

  // Server Action for logging out
  const signOut = async () => {
    'use server';
    const supabaseServer = createClient();
    await supabaseServer.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Notice the print:hidden class here! */}
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header - Notice the print:hidden class here! */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6 print:hidden">
          <form action={signOut}>
            <Button variant="outline" size="sm" className="font-mono text-failure border-failure/50 hover:bg-failure/10 hover:text-failure">
              Sign Out
            </Button>
          </form>
        </header>
        <div className="p-6 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}