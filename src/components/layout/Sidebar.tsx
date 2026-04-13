'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Upload, 
  FileText,
  GraduationCap,
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Students", icon: Users, href: "/dashboard/students" },
  { label: "Courses", icon: BookOpen, href: "/dashboard/courses" },
  { label: "Upload Results", icon: Upload, href: "/dashboard/results" },
  { label: "Reports", icon: FileText, href: "/dashboard/my-results" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col overflow-y-auto border-r border-border bg-white px-3 py-4">
      <div className="mb-6 flex items-center gap-3 pl-3">
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-success" />
        </div>
        <h1 className="text-lg font-bold text-foreground">
          Result<span className="text-success">Portal</span>
        </h1>
      </div>
      
      <div className="flex flex-1 flex-col gap-1">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Menu</p>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex w-full items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              pathname === route.href 
                ? "bg-success/10 text-success border-l-2 border-success" 
                : "text-muted-foreground hover:text-success hover:bg-success/5"
            )}
          >
            <route.icon className={cn(
              "h-5 w-5 transition-colors",
              pathname === route.href ? "text-success" : "text-muted-foreground group-hover:text-success"
            )} />
            {route.label}
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <Link
          href="/settings"
          className="group flex w-full items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-success hover:bg-success/5 transition-all"
        >
          <Settings className="h-5 w-5 group-hover:text-success transition-colors" />
          Settings
        </Link>
      </div>
    </div>
  );
}