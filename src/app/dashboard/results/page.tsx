import { createClient } from '@/lib/supabase/server';
import { UploadForm } from './upload-form';
import { BulkUpload } from './bulk-upload';
import { Upload, CheckCircle2, Clock } from 'lucide-react';

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
      created_at,
      student:students(name, matric_no),
      course:courses(course_code, title)
    `).order('created_at', { ascending: false }).limit(8)
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
          <Upload className="h-5 w-5 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Upload Results</h2>
          <p className="text-sm text-muted-foreground">Publish grades manually or upload a batch CSV file.</p>
        </div>
      </div>

      {/* Upload Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UploadForm students={students || []} courses={courses || []} />
        <BulkUpload students={students || []} courses={courses || []} />
      </div>

      {/* Recent Uploads — Card Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Recently Uploaded</h3>
        {results && results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((result) => (
              <div 
                key={result.id} 
                className="card-hover bg-white border border-border/60 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    result.grade === 'A' || result.grade === 'B' 
                      ? 'bg-success/10 text-success' 
                      : result.grade === 'C' || result.grade === 'D' 
                        ? 'bg-warning/10 text-warning' 
                        : 'bg-failure/10 text-failure'
                  }`}>
                    {result.grade}
                  </span>
                  <span className="text-sm font-bold text-foreground">{result.score}/100</span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">{result.student?.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">{result.student?.matric_no}</p>
                <div className="mt-3 pt-3 border-t border-border/40">
                  <p className="text-xs font-mono font-semibold text-success uppercase">{result.course?.course_code}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.course?.title}</p>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  <span className="text-[10px] font-semibold text-success">Published</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-border/60 rounded-xl p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No results uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}