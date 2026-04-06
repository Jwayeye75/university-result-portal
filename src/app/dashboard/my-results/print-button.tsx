'use client';

import { Button } from '@/components/ui/button';

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()} 
      className="bg-info text-info-foreground hover:bg-info/90 font-bold print:hidden"
    >
      Download Transcript (PDF)
    </Button>
  );
}