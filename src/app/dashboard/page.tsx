import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single();

  const role = userData?.role || 'student';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif tracking-tight text-success">Welcome to the Portal</h2>
        <p className="font-mono text-muted-foreground mt-2">Here is your account overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-serif">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info capitalize">{role}</div>
            <p className="text-sm font-mono text-muted-foreground mt-1 truncate">{user?.email}</p>
          </CardContent>
        </Card>

        {role === 'admin' ? (
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-sm text-muted-foreground flex flex-col gap-2">
              <p>→ Manage Student Records</p>
              <p>→ Update Course Catalog</p>
              <p>→ Publish Official Results</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-sm text-muted-foreground flex flex-col gap-2">
              <p>→ View Academic Standing</p>
              <p>→ Check Course Grades</p>
              <p>→ Download Official Transcript</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}