'use client';

import { Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Header() {
  return (
    <div className="flex items-center p-4 border-b border-border bg-white md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden text-foreground">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-white border-r border-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex w-full justify-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-success" />
          <h1 className="text-xl font-bold text-foreground">
            Result<span className="text-success">Portal</span>
          </h1>
        </div>
      </div>
    </div>
  );
}