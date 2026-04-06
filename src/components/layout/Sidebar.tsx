'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileSpreadsheet, 
  FileText, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-info" },
  { label: "Students", icon: Users, href: "/students", color: "text-primary" },
  { label: "Courses", icon: BookOpen, href: "/courses", color: "text-primary" },
  { label: "Enter Results", icon: FileSpreadsheet, href: "/results/enter", color: "text-success" },
  { label: "Reports", icon: FileText, href: "/reports", color: "text-primary" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col overflow-y-auto border-r border-border bg-card px-3 py-4">
      <div className="mb-8 flex items-center pl-3">
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Uni<span className="text-info">Result</span>
        </h1>
      </div>
      
      <div className="flex flex-1 flex-col gap-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex w-full justify-start cursor-pointer rounded-lg p-3 text-sm font-medium transition-colors hover:bg-white/10",
              pathname === route.href ? "bg-white/10 text-white" : "text-zinc-400"
            )}
          >
            <div className="flex items-center gap-x-3">
              <route.icon className={cn("h-5 w-5", route.color)} />
              {route.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <Link
          href="/settings"
          className="group flex w-full justify-start cursor-pointer rounded-lg p-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <div className="flex items-center gap-x-3">
            <Settings className="h-5 w-5" />
            Settings
          </div>
        </Link>
      </div>
    </div>
  );
}