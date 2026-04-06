import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif tracking-tight">Welcome to the Portal</h2>
        <p className="font-mono text-muted-foreground mt-2">
          Select an option from the sidebar to manage university records.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="border-info/20 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-mono font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-success">Online</div>
            <p className="text-xs text-muted-foreground font-mono mt-1">Database connected securely</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}