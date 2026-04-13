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
import { Users, Search } from 'lucide-react';

export default async function StudentsPage() {
  const supabase = createClient();
  
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .order('name');

  // Generate avatar color from name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-success/10 text-success',
      'bg-blue-50 text-blue-600',
      'bg-purple-50 text-purple-600',
      'bg-orange-50 text-orange-600',
      'bg-rose-50 text-rose-600',
      'bg-teal-50 text-teal-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Manage Students</h2>
            <p className="text-sm text-muted-foreground">View and add university students to the registry.</p>
          </div>
        </div>
        <AddStudentDialog />
      </div>

      {/* Table Card */}
      <div className="border border-border/60 rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold text-foreground">Student</TableHead>
              <TableHead className="font-semibold text-foreground">Matric No</TableHead>
              <TableHead className="font-semibold text-foreground">Department</TableHead>
              <TableHead className="font-semibold text-foreground">Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students && students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-success/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(student.name)}`}>
                        {getInitials(student.name)}
                      </div>
                      <span className="font-medium text-foreground">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-md">
                      {student.matric_no}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{student.department}</TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground bg-muted px-2.5 py-1 rounded-md">
                      Level {student.level}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No students found in the database.</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Click &quot;Add Student&quot; to get started.</p>
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