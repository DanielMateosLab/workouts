import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeToggler } from "@/components/theme-toggler";
import { NavMenu } from "@/components/nav-menu";
import { Toaster } from "@/components/shadcn/sonner";

const inter = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Workouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="container h-14 flex items-center justify-between mb-8">
            <NavMenu />
            <ThemeToggler />
          </header>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
