'use client';

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Header() {
  return (
    <div className="flex items-center p-4 border-b border-border bg-card md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden text-foreground">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-card border-r-border">
          {/* Required for screen readers */}
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          
          {/* We reuse the Sidebar inside the sliding drawer! */}
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex w-full justify-center">
         <h1 className="text-xl font-serif font-bold text-foreground">
          Uni<span className="text-info">Result</span>
        </h1>
      </div>
    </div>
  );
}