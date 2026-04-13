'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-white via-green-50/30 to-white relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-success/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-success/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <Card className="w-full max-w-md border border-border/50 shadow-xl shadow-success/5 bg-white/80 backdrop-blur-sm rounded-2xl relative z-10">
        <CardHeader className="space-y-4 text-center pb-2">
          {/* Graduation cap icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-2">
            <GraduationCap className="h-8 w-8 text-success" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Student Result Portal</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Enter your credentials to access the system
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-failure bg-failure/5 border border-failure/20 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-failure flex-shrink-0"></div>
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@university.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl bg-white border-border/60 focus:border-success text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-11 rounded-xl bg-white border-border/60 focus:border-success pr-10 text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-sm text-success hover:text-success-dark font-medium transition-colors">
                Forgot password?
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 bg-success hover:bg-success-dark text-white font-bold rounded-xl shadow-lg shadow-success/25 hover:shadow-success/40 transition-all" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
