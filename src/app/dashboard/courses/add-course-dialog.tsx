'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, BookOpen } from 'lucide-react';

export function AddCourseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [units, setUnits] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from('courses').insert([
      {
        course_code: code,
        title: title,
        units: parseInt(units),
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      setCode('');
      setTitle('');
      setUnits('');
      setOpen(false);
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-success hover:bg-success/90 text-white font-semibold rounded-xl shadow-sm shadow-success/20 gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-border/60 bg-white rounded-2xl shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-success" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">Add New Course</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Register a new academic course into the system.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-failure bg-failure/5 p-3 rounded-xl border border-failure/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-failure flex-shrink-0"></div>
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">Course Code</Label>
            <Input id="code" required value={code} onChange={(e) => setCode(e.target.value)} className="h-10 rounded-xl bg-white border-border/60 font-mono uppercase" placeholder="CPS 407" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Course Title</Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 rounded-xl bg-white border-border/60" placeholder="Net Centric Computing" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="units" className="text-sm font-medium">Credit Units</Label>
            <Input id="units" type="number" required value={units} onChange={(e) => setUnits(e.target.value)} className="h-10 rounded-xl bg-white border-border/60" placeholder="3" />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 bg-success hover:bg-success/90 text-white font-bold rounded-xl shadow-sm shadow-success/20 mt-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : 'Save Course'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
