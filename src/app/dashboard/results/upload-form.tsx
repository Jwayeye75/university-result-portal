'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp } from 'lucide-react';

export function UploadForm({ students, courses }: { students: any[], courses: any[] }) {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

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

  const gradeColor = score ? (() => {
    const g = calculateGrade(parseInt(score));
    if (g === 'A' || g === 'B') return 'text-success bg-success/10';
    if (g === 'C' || g === 'D') return 'text-warning bg-warning/10';
    return 'text-failure bg-failure/10';
  })() : '';

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-border/60 rounded-xl shadow-sm space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
          <FileUp className="h-4 w-4 text-success" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Manual Entry</h3>
      </div>

      {error && (
        <div className="text-sm text-failure bg-failure/5 p-3 rounded-xl border border-failure/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-failure flex-shrink-0"></div>
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="student" className="text-sm font-medium">Select Student</Label>
          <select 
            id="student" 
            required 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none transition-all"
          >
            <option value="" disabled>-- Choose a Student --</option>
            {students?.map(s => (
              <option key={s.id} value={s.id}>{s.matric_no} - {s.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="course" className="text-sm font-medium">Select Course</Label>
          <select 
            id="course" 
            required 
            value={courseId} 
            onChange={(e) => setCourseId(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-sm focus:border-success focus:ring-2 focus:ring-success/20 focus:outline-none transition-all"
          >
            <option value="" disabled>-- Choose a Course --</option>
            {courses?.map(c => (
              <option key={c.id} value={c.id}>{c.course_code} - {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="score" className="text-sm font-medium">Score (0-100)</Label>
        <div className="flex gap-3 items-center">
          <Input 
            id="score" 
            type="number" 
            min="0" 
            max="100" 
            required 
            value={score} 
            onChange={(e) => setScore(e.target.value)} 
            className="h-10 rounded-xl bg-white border-border/60 w-24" 
            placeholder="85" 
          />
          {score && (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${gradeColor}`}>
              Grade: {calculateGrade(parseInt(score))}
            </span>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full md:w-auto bg-success hover:bg-success/90 text-white font-bold rounded-xl shadow-sm shadow-success/20 h-10 px-6">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Uploading...
          </div>
        ) : 'Upload Result'}
      </Button>
    </form>
  );
}