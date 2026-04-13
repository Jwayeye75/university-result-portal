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
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const supabase = createClient();
  
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('course_code');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Manage Courses</h2>
            <p className="text-sm text-muted-foreground">View and add academic courses.</p>
          </div>
        </div>
        <AddCourseDialog />
      </div>

      {/* Table Card */}
      <div className="border border-border/60 rounded-xl bg-white shadow-sm overflow-hidden overflow-x-auto w-full">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-foreground">Course Code</TableHead>
              <TableHead className="font-semibold text-foreground">Title</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Credit Units</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-success/5 transition-colors">
                  <TableCell>
                    <span className="font-mono text-sm font-bold text-success bg-success/10 px-2.5 py-1 rounded-md uppercase">
                      {course.course_code}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{course.title}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm font-semibold text-foreground bg-muted px-2.5 py-1 rounded-md">
                      {course.units}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No courses found in the database.</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Click &quot;Add Course&quot; to get started.</p>
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