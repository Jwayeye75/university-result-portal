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

export const dynamic = 'force-dynamic';

// Helper to convert letter grade to points (Standard 5.0 Scale)
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

    // Calculate GPA
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

  return (
    <div className="space-y-6">
      
      {/* 1. Official Print-Only Header (Hidden on the website, visible on the PDF) */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-foreground pb-4">
        <h1 className="text-4xl font-serif font-bold tracking-widest uppercase">University Result Portal</h1>
        <p className="font-mono text-muted-foreground mt-1">Official Student Academic Transcript</p>
      </div>

      {/* 2. Web Header & Print Button */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-3xl font-serif tracking-tight text-success">My Results</h2>
          <p className="font-mono text-muted-foreground mt-2">View your academic performance and grades.</p>
        </div>
        {student && <PrintButton />}
      </div>

      {student ? (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="border-info/20 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 font-mono text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-bold text-info">{student.name}</span></div>
                <div><span className="text-muted-foreground">Matric No:</span> <span className="font-bold">{student.matric_no}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Standing Card */}
          <Card className="border-success/20 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Academic Standing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 font-mono">
                <div>
                  <div className="text-muted-foreground text-sm">Current GPA</div>
                  <div className="text-4xl font-bold text-success mt-1">{gpa} <span className="text-sm text-muted-foreground font-normal">/ 5.00</span></div>
                </div>
                <div className="mb-1">
                  <div className="text-muted-foreground text-xs">Total Units</div>
                  <div className="font-bold">{totalUnits}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-4 bg-warning/10 text-warning font-mono border border-warning/20 rounded-md print:hidden">
          Warning: Your email is not linked to any registered student profile. Please contact administration.
        </div>
      )}

      <div className="border border-border rounded-md bg-card mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono">Course Code</TableHead>
              <TableHead className="font-mono">Course Title</TableHead>
              <TableHead className="font-mono text-center">Units</TableHead>
              <TableHead className="font-mono text-center">Score</TableHead>
              <TableHead className="font-mono text-center">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length > 0 ? (
              results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-mono font-medium text-info uppercase">
                    {result.course?.course_code}
                  </TableCell>
                  <TableCell>{result.course?.title}</TableCell>
                  <TableCell className="text-center font-mono">{result.course?.units}</TableCell>
                  <TableCell className="text-center font-mono">{result.score}</TableCell>
                  <TableCell className="text-center font-bold font-mono text-success">{result.grade}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center font-mono text-muted-foreground">
                  No results published yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}