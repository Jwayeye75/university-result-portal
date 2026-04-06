import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddCourseDialog } from './add-course-dialog';

export default async function CoursesPage() {
  const supabase = createClient();
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('course_code');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif tracking-tight text-success">Manage Courses</h2>
          <p className="font-mono text-muted-foreground mt-2">View and add academic courses.</p>
        </div>
        <AddCourseDialog />
      </div>

      <div className="border border-border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono">Course Code</TableHead>
              <TableHead className="font-mono">Title</TableHead>
              <TableHead className="font-mono text-right">Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-mono font-medium text-info uppercase">{course.course_code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell className="text-right font-mono">{course.units}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center font-mono text-muted-foreground">
                  No courses found in the database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
