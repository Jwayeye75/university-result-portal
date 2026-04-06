'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function BulkUpload({ students, courses }: { students: any[], courses: any[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage({ text: 'Processing CSV...', type: 'success' });

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        // Split file by new lines and remove any completely empty rows
        const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);
        
        const resultsToInsert = [];
        let errorCount = 0;

        // Start loop at index 1 to skip the "Header" row of the CSV
        for (let i = 1; i < lines.length; i++) {
          const columns = lines[i].split(',').map(s => s.trim());
          if (columns.length < 3) continue;

          const matric_no = columns[0];
          const course_code = columns[1];
          const score = parseInt(columns[2]);

          if (!matric_no || !course_code || isNaN(score)) continue;

          // Find the internal database IDs based on the text from the CSV
          const student = students.find(s => s.matric_no.toLowerCase() === matric_no.toLowerCase());
          const course = courses.find(c => c.course_code.toLowerCase() === course_code.toLowerCase());

          if (!student || !course) {
            errorCount++;
            continue; // Skip this row if student or course doesn't exist in the DB
          }

          resultsToInsert.push({
            student_id: student.id,
            course_id: course.id,
            score: score,
            grade: calculateGrade(score)
          });
        }

        if (resultsToInsert.length === 0) {
          setMessage({ text: `No valid results found. (Failed to match ${errorCount} rows)`, type: 'error' });
          setLoading(false);
          return;
        }

        // Send the entire array to Supabase in one go!
        const { error } = await supabase.from('results').insert(resultsToInsert);

        if (error) {
          if (error.code === '23505') {
            setMessage({ text: 'Error: One or more of these results already exist in the database!', type: 'error' });
          } else {
            setMessage({ text: error.message, type: 'error' });
          }
        } else {
          setMessage({ text: `Success! Uploaded ${resultsToInsert.length} results.`, type: 'success' });
          router.refresh(); // Refresh the table
        }
      } catch (err) {
        setMessage({ text: 'Failed to read the file. Ensure it is a valid CSV.', type: 'error' });
      }
      setLoading(false);
      
      // Reset the file input so you can upload another file immediately
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-card p-6 border border-border rounded-md">
      <h3 className="text-xl font-serif tracking-tight text-success mb-2">Bulk Upload (CSV)</h3>
      <p className="text-sm font-mono text-muted-foreground mb-4">
        Upload a file with columns: <strong>matric_no, course_code, score</strong>.
      </p>

      {message && (
        <div className={`p-3 rounded text-sm font-mono mb-4 border ${
          message.type === 'error' ? 'bg-failure/10 text-failure border-failure/20' : 'bg-success/10 text-success border-success/20'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="csv">Select CSV File</Label>
        <Input 
          id="csv" 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload} 
          disabled={loading} 
          className="cursor-pointer bg-background font-mono file:bg-info file:text-info-foreground file:border-0 file:mr-4 file:px-4 file:py-2 file:rounded hover:file:bg-info/90" 
        />
      </div>
    </div>
  );
}