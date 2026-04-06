import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddStudentDialog } from './add-student-dialog';

export default async function StudentsPage() {
  const supabase = createClient();
  
  // Fetch students from the database
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('name');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif tracking-tight text-success">Manage Students</h2>
          <p className="font-mono text-muted-foreground mt-2">View and add university students to the registry.</p>
        </div>
        {/* Here is our new interactive client component! */}
        <AddStudentDialog />
      </div>

      <div className="border border-border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono">Matric No</TableHead>
              <TableHead className="font-mono">Name</TableHead>
              <TableHead className="font-mono">Department</TableHead>
              <TableHead className="font-mono">Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students && students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono font-medium text-info">{student.matric_no}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.level}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center font-mono text-muted-foreground">
                  No students found in the database.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}