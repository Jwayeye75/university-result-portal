import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Result Management System",
  description: "University student result management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add suppressHydrationWarning right here!
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}