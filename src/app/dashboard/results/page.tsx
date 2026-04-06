import { createClient } from '@/lib/supabase/server';
import { UploadForm } from './upload-form';
import { BulkUpload } from './bulk-upload';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamic = 'force-dynamic';

export default async function UploadResultsPage() {
  const supabase = createClient();
  
  const [{ data: students }, { data: courses }, { data: results }] = await Promise.all([
    supabase.from('students').select('id, name, matric_no').order('matric_no'),
    supabase.from('courses').select('id, course_code, title').order('course_code'),
    supabase.from('results').select(`
      id,
      score,
      grade,
      student:students(name, matric_no),
      course:courses(course_code, title)
    `).order('created_at', { ascending: false })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif tracking-tight text-success">Upload Results</h2>
        <p className="font-mono text-muted-foreground mt-2">Publish grades manually or upload a batch CSV file.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UploadForm students={students || []} courses={courses || []} />
        <BulkUpload students={students || []} courses={courses || []} />
      </div>

      <div className="space-y-4 pt-6">
        <h3 className="text-xl font-serif tracking-tight">Recently Uploaded</h3>
        <div className="border border-border rounded-md bg-card overflow-x-auto w-full">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="font-mono">Student</TableHead>
                <TableHead className="font-mono">Course</TableHead>
                <TableHead className="font-mono text-center">Score</TableHead>
                <TableHead className="font-mono text-center">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results && results.length > 0 ? (
                results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="font-medium text-info font-mono">{result.student?.matric_no}</div>
                      <div className="text-xs text-muted-foreground">{result.student?.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium uppercase font-mono">{result.course?.course_code}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{result.course?.title}</div>
                    </TableCell>
                    <TableCell className="text-center font-mono">{result.score}</TableCell>
                    <TableCell className="text-center font-bold font-mono text-success">{result.grade}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center font-mono text-muted-foreground">
                    No results uploaded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}