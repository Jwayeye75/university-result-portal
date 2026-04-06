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

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Form input states
  const [name, setName] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Insert the new student into Supabase
    const { error: insertError } = await supabase.from('students').insert([
      {
        name,
        matric_no: matricNo,
        department,
        level: parseInt(level),
        email,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      // Clear the form and close the modal
      setName('');
      setMatricNo('');
      setDepartment('');
      setLevel('');
      setEmail('');
      setOpen(false);
      setLoading(false);
      
      // Force the page to refresh so the new student appears in the table immediately
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-info text-info-foreground hover:bg-info/90 font-bold">
          + Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-info/20 bg-card">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-success tracking-tight">Add New Student</DialogTitle>
          <DialogDescription className="font-mono text-muted-foreground">
            Enter the student's details to register them in the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="text-sm font-mono text-failure bg-failure/10 p-2 rounded border border-failure/20">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="bg-background font-mono" placeholder="John Doe" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricNo">Matric Number</Label>
              <Input id="matricNo" required value={matricNo} onChange={(e) => setMatricNo(e.target.value)} className="bg-background font-mono" placeholder="CPS/2026/001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input id="level" type="number" required value={level} onChange={(e) => setLevel(e.target.value)} placeholder="100" className="bg-background font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" required value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-background font-mono" placeholder="Computer Science" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background font-mono" placeholder="student@university.edu" />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-success text-success-foreground hover:bg-success/90 font-bold mt-4">
            {loading ? 'Saving...' : 'Save Student'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
