import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrintButton } from './print-button';
import { FileText, User, Award, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const getGradePoints = (grade: string) => {
  switch (grade.toUpperCase()) {
    case 'A': return 5;
    case 'B': return 4;
    case 'C': return 3;
    case 'D': return 2;
    case 'E': return 1;
    case 'F': return 0;
    default: return 0;
  }
};

const getGradeColor = (grade: string) => {
  switch (grade.toUpperCase()) {
    case 'A': return 'text-success bg-success/10';
    case 'B': return 'text-success/80 bg-success/10';
    case 'C': return 'text-warning bg-warning/10';
    case 'D': return 'text-warning bg-warning/10';
    case 'E': return 'text-orange-600 bg-orange-50';
    case 'F': return 'text-failure bg-failure/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

export default async function MyResultsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: student } = await supabase
    .from('students')
    .select('id, name, matric_no')
    .eq('email', user?.email)
    .single();

  let results: any[] = [];
  let gpa = "0.00";
  let totalUnits = 0;

  if (student) {
    const { data } = await supabase
      .from('results')
      .select(`
        id,
        score,
        grade,
        course:courses(course_code, title, units)
      `)
      .eq('student_id', student.id)
      .order('created_at', { ascending: false });
      
    results = data || [];

    if (results.length > 0) {
      let totalQualityPoints = 0;
      
      results.forEach(result => {
        const units = result.course?.units || 0;
        const points = getGradePoints(result.grade);
        
        totalUnits += units;
        totalQualityPoints += (points * units);
      });

      if (totalUnits > 0) {
        gpa = (totalQualityPoints / totalUnits).toFixed(2);
      }
    }
  }

  const gpaNum = parseFloat(gpa);
  const gpaColor = gpaNum >= 4.0 ? 'text-success' : gpaNum >= 3.0 ? 'text-blue-600' : gpaNum >= 2.0 ? 'text-warning' : 'text-failure';

  return (
    <div className="space-y-6">
      
      {/* Print header */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-foreground pb-4">
        <h1 className="text-4xl font-bold tracking-widest uppercase">University Result Portal</h1>
        <p className="text-muted-foreground mt-1">Official Student Academic Transcript</p>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">My Results</h2>
            <p className="text-sm text-muted-foreground">View your academic performance and grades.</p>
          </div>
        </div>
        {student && <PrintButton />}
      </div>

      {student ? (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Student Profile Card */}
          <Card className="border border-border/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                  <User className="h-7 w-7 text-success" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Student Profile</p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{student.name}</p>
                  <p className="text-sm font-mono text-success font-medium">{student.matric_no}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GPA Card */}
          <Card className="border border-border/60 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                  <Award className="h-7 w-7 text-success" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current GPA</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className={`text-3xl font-bold ${gpaColor}`}>{gpa}</span>
                    <span className="text-sm text-muted-foreground">/ 5.00</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalUnits} credit units • {results.length} courses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-5 bg-warning/5 text-foreground border border-warning/30 rounded-xl print:hidden flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Account Not Linked</p>
            <p className="text-sm text-muted-foreground mt-1">Your email is not linked to any registered student profile. Please contact administration.</p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="border border-border/60 rounded-xl bg-white shadow-sm overflow-hidden overflow-x-auto w-full">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-foreground">Course Code</TableHead>
              <TableHead className="font-semibold text-foreground">Course Title</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Units</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Score</TableHead>
              <TableHead className="font-semibold text-foreground text-center">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length > 0 ? (
              results.map((result) => (
                <TableRow key={result.id} className="hover:bg-success/5 transition-colors">
                  <TableCell>
                    <span className="font-mono text-sm font-bold text-success bg-success/10 px-2 py-1 rounded-md uppercase">
                      {result.course?.course_code}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{result.course?.title}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded-md">{result.course?.units}</span>
                  </TableCell>
                  <TableCell className="text-center font-medium text-foreground">{result.score}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No results published yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}