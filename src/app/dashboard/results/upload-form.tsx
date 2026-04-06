'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function UploadForm({ students, courses }: { students: any[], courses: any[] }) {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Helper to auto-calculate grade
  const calculateGrade = (numScore: number) => {
    if (numScore >= 70) return 'A';
    if (numScore >= 60) return 'B';
    if (numScore >= 50) return 'C';
    if (numScore >= 45) return 'D';
    if (numScore >= 40) return 'E';
    return 'F';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const numScore = parseInt(score);
    const grade = calculateGrade(numScore);

    const { error: insertError } = await supabase.from('results').insert([
      {
        student_id: studentId,
        course_id: courseId,
        score: numScore,
        grade: grade,
      },
    ]);

    if (insertError) {
      // Handle the "Unique" error gracefully if a score already exists
      if (insertError.code === '23505') {
        setError('A result for this student and course already exists!');
      } else {
        setError(insertError.message);
      }
      setLoading(false);
    } else {
      setStudentId('');
      setCourseId('');
      setScore('');
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 border border-border rounded-md">
      {error && (
        <div className="text-sm font-mono text-failure bg-failure/10 p-3 rounded border border-failure/20">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student">Select Student</Label>
          <select 
            id="student" 
            required 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="" disabled>-- Choose a Student --</option>
            {students?.map(s => (
              <option key={s.id} value={s.id}>{s.matric_no} - {s.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Select Course</Label>
          <select 
            id="course" 
            required 
            value={courseId} 
            onChange={(e) => setCourseId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="" disabled>-- Choose a Course --</option>
            {courses?.map(c => (
              <option key={c.id} value={c.id}>{c.course_code} - {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="score">Score (0-100)</Label>
        <div className="flex gap-4 items-center">
          <Input 
            id="score" 
            type="number" 
            min="0" 
            max="100" 
            required 
            value={score} 
            onChange={(e) => setScore(e.target.value)} 
            className="bg-background font-mono w-24" 
            placeholder="85" 
          />
          {score && (
            <div className="text-sm font-mono text-muted-foreground">
              Auto-Grade: <span className="font-bold text-success text-lg">{calculateGrade(parseInt(score))}</span>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full md:w-auto bg-info text-info-foreground hover:bg-info/90 font-bold">
        {loading ? 'Uploading...' : 'Upload Result'}
      </Button>
    </form>
  );
}