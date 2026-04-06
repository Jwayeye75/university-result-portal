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
        <Button className="bg-info text-info-foreground hover:bg-info/90 font-bold">
          + Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-info/20 bg-card">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-success tracking-tight">Add New Course</DialogTitle>
          <DialogDescription className="font-mono text-muted-foreground">
            Register a new academic course into the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="text-sm font-mono text-failure bg-failure/10 p-2 rounded border border-failure/20">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="code">Course Code</Label>
            <Input id="code" required value={code} onChange={(e) => setCode(e.target.value)} className="bg-background font-mono uppercase" placeholder="CPS 407" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background font-mono" placeholder="Net Centric Computing" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="units">Credit Units</Label>
            <Input id="units" type="number" required value={units} onChange={(e) => setUnits(e.target.value)} className="bg-background font-mono" placeholder="3" />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-success text-success-foreground hover:bg-success/90 font-bold mt-4">
            {loading ? 'Saving...' : 'Save Course'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
