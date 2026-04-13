'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()} 
      className="bg-success hover:bg-success/90 text-white font-semibold rounded-xl shadow-sm shadow-success/20 gap-2 print:hidden"
    >
      <Download className="h-4 w-4" />
      Download Transcript
    </Button>
  );
}