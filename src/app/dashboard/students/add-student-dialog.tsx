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
import { Plus, UserPlus } from 'lucide-react';

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      setName('');
      setMatricNo('');
      setDepartment('');
      setLevel('');
      setEmail('');
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
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-border/60 bg-white rounded-2xl shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-success" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">Add New Student</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Enter the student&apos;s details to register them.
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
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-xl bg-white border-border/60" placeholder="John Doe" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricNo" className="text-sm font-medium">Matric Number</Label>
              <Input id="matricNo" required value={matricNo} onChange={(e) => setMatricNo(e.target.value)} className="h-10 rounded-xl bg-white border-border/60 font-mono" placeholder="CPS/2026/001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium">Level</Label>
              <Input id="level" type="number" required value={level} onChange={(e) => setLevel(e.target.value)} placeholder="100" className="h-10 rounded-xl bg-white border-border/60" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">Department</Label>
            <Input id="department" required value={department} onChange={(e) => setDepartment(e.target.value)} className="h-10 rounded-xl bg-white border-border/60" placeholder="Computer Science" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-xl bg-white border-border/60" placeholder="student@university.edu" />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 bg-success hover:bg-success/90 text-white font-bold rounded-xl shadow-sm shadow-success/20 mt-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : 'Save Student'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
