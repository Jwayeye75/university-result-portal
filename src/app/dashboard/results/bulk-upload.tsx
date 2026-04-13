'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export function BulkUpload({ students, courses }: { students: any[], courses: any[] }) {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const processFile = async (file: File) => {
    setLoading(true);
    setMessage({ text: 'Processing CSV...', type: 'success' });

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);
        
        const resultsToInsert = [];
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const columns = lines[i].split(',').map(s => s.trim());
          if (columns.length < 3) continue;

          const matric_no = columns[0];
          const course_code = columns[1];
          const score = parseInt(columns[2]);

          if (!matric_no || !course_code || isNaN(score)) continue;

          const student = students.find(s => s.matric_no.toLowerCase() === matric_no.toLowerCase());
          const course = courses.find(c => c.course_code.toLowerCase() === course_code.toLowerCase());

          if (!student || !course) {
            errorCount++;
            continue;
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

        const { error } = await supabase.from('results').insert(resultsToInsert);

        if (error) {
          if (error.code === '23505') {
            setMessage({ text: 'Error: One or more of these results already exist!', type: 'error' });
          } else {
            setMessage({ text: error.message, type: 'error' });
          }
        } else {
          setMessage({ text: `Success! Uploaded ${resultsToInsert.length} results.`, type: 'success' });
          router.refresh();
        }
      } catch (err) {
        setMessage({ text: 'Failed to read the file. Ensure it is a valid CSV.', type: 'error' });
      }
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      await processFile(file);
    } else {
      setMessage({ text: 'Please upload a valid .csv file', type: 'error' });
    }
  };

  return (
    <div className="bg-white p-6 border border-border/60 rounded-xl shadow-sm space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
          <FileSpreadsheet className="h-4 w-4 text-success" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Bulk Upload (CSV)</h3>
      </div>

      {/* Template hint */}
      <div className="bg-success/5 border border-success/20 rounded-xl p-3 flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
        <p className="text-xs text-foreground">
          CSV format: <strong className="font-mono">matric_no, course_code, score</strong>
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-sm font-medium border flex items-center gap-2 ${
          message.type === 'error' 
            ? 'bg-failure/5 text-failure border-failure/20' 
            : 'bg-success/5 text-success border-success/20'
        }`}>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${message.type === 'error' ? 'bg-failure' : 'bg-success'}`}></div>
          {message.text}
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-success bg-success/5 scale-[1.02]' 
            : 'border-border/60 hover:border-success/50 hover:bg-success/5'
        } ${loading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
          isDragging ? 'bg-success/20' : 'bg-muted'
        }`}>
          <UploadCloud className={`h-6 w-6 ${isDragging ? 'text-success' : 'text-muted-foreground'}`} />
        </div>
        <p className="text-sm font-medium text-foreground">
          {loading ? 'Processing...' : 'Drag & drop your CSV here'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          or <span className="text-success font-semibold">browse files</span>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={loading}
          className="hidden"
        />
      </div>
    </div>
  );
}