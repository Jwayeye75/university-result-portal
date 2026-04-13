import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Users, BookOpen, Upload, BarChart3, Award, Bell,
  TrendingUp, TrendingDown, CheckCircle2, Clock, UserPlus, FileUp
} from 'lucide-react';

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

  // Fetch real counts
  const [
    { count: studentCount },
    { count: courseCount },
    { count: resultCount },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('results').select('*', { count: 'exact', head: true }),
  ]);

  // Fetch grade distribution
  const { data: gradeData } = await supabase
    .from('results')
    .select('grade');

  const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  gradeData?.forEach(r => {
    const g = r.grade?.toUpperCase();
    if (g && gradeCounts.hasOwnProperty(g)) gradeCounts[g]++;
  });
  const maxGradeCount = Math.max(...Object.values(gradeCounts), 1);

  // Fetch recent results for activity feed
  const { data: recentResults } = await supabase
    .from('results')
    .select(`
      id,
      score,
      grade,
      created_at,
      student:students(name, matric_no),
      course:courses(course_code)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    {
      title: 'Total Students',
      value: studentCount || 0,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Courses Active',
      value: courseCount || 0,
      icon: BookOpen,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+3',
      trendUp: true,
    },
    {
      title: 'Results Published',
      value: resultCount || 0,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
      trend: '+24',
      trendUp: true,
    },
    {
      title: 'Pending Uploads',
      value: 0,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: 'None',
      trendUp: false,
    },
  ];

  const quickActions = [
    { label: 'Add Student', icon: UserPlus, href: '/dashboard/students', color: 'text-success', bgColor: 'bg-success/10', hoverBg: 'hover:bg-success/15' },
    { label: 'Manage Courses', icon: BookOpen, href: '/dashboard/courses', color: 'text-blue-600', bgColor: 'bg-blue-50', hoverBg: 'hover:bg-blue-100' },
    { label: 'Upload Results', icon: FileUp, href: '/dashboard/results', color: 'text-purple-600', bgColor: 'bg-purple-50', hoverBg: 'hover:bg-purple-100' },
    { label: 'View Reports', icon: BarChart3, href: '/dashboard', color: 'text-orange-600', bgColor: 'bg-orange-50', hoverBg: 'hover:bg-orange-100' },
    { label: 'Transcripts', icon: Award, href: '/dashboard/my-results', color: 'text-emerald-600', bgColor: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100' },
    { label: 'Notifications', icon: Bell, href: '/dashboard', color: 'text-rose-600', bgColor: 'bg-rose-50', hoverBg: 'hover:bg-rose-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Plan, prioritize, and accomplish your tasks with ease.</p>
      </div>

      {/* ─── STATS ROW ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-hover border border-border/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {stat.trendUp ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-success' : 'text-muted-foreground'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground">this semester</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── QUICK ACTIONS ─── */}
      {role === 'admin' && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card className={`card-hover border border-border/40 bg-white shadow-sm cursor-pointer ${action.hoverBg} transition-all group`}>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <p className="text-xs font-semibold text-foreground">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ─── CHARTS + ACTIVITY ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Chart */}
        <Card className="border border-border/60 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-foreground">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-end gap-3 h-48 mt-4">
              {Object.entries(gradeCounts).map(([grade, count]) => {
                const height = maxGradeCount > 0 ? (count / maxGradeCount) * 100 : 0;
                const colors: Record<string, string> = {
                  A: 'bg-success',
                  B: 'bg-success/80',
                  C: 'bg-success/60',
                  D: 'bg-warning',
                  E: 'bg-warning/70',
                  F: 'bg-failure/70',
                };
                return (
                  <div key={grade} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{count}</span>
                    <div className="w-full relative" style={{ height: '160px' }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-lg ${colors[grade] || 'bg-success'} transition-all duration-500`}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-foreground">{grade}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-border/60 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentResults && recentResults.length > 0 ? (
              <div className="space-y-4 mt-2">
                {recentResults.map((result, index) => (
                  <div key={result.id} className="flex items-start gap-3">
                    {/* Timeline dot and line */}
                    <div className="flex flex-col items-center min-h-full">
                      <div className="w-3 h-3 rounded-full bg-success ring-4 ring-success/10 mt-0.5"></div>
                      {index < (recentResults.length - 1) && (
                        <div className="w-0.5 flex-1 bg-border mt-1 min-h-[24px]"></div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{result.student?.name || 'Unknown'}</span>
                        {' '}received grade{' '}
                        <span className={`font-bold ${
                          result.grade === 'A' || result.grade === 'B' ? 'text-success' : 
                          result.grade === 'C' || result.grade === 'D' ? 'text-warning' : 'text-failure'
                        }`}>{result.grade}</span>
                        {' '}in{' '}
                        <span className="font-semibold uppercase">{result.course?.course_code || ''}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Score: {result.score}/100 • {result.created_at ? new Date(result.created_at).toLocaleDateString() : ''}
                      </p>
                    </div>
                    {/* Grade badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      result.grade === 'A' || result.grade === 'B' 
                        ? 'bg-success/10 text-success' 
                        : result.grade === 'C' || result.grade === 'D' 
                          ? 'bg-warning/10 text-warning' 
                          : 'bg-failure/10 text-failure'
                    }`}>
                      {result.grade}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No recent activity yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}