// app/layout.tsx
import "@/app/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth/providers/auth-provider";
import { AuthGuard } from "@/features/auth/guards/auth-guard";

// ─────────────────────────────────────────────────────
// Fonts
// ─────────────────────────────────────────────────────

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

// ─────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────

export const metadata = {
  title: "CareConnect | Assignment System",
  description: "Management system for Care Agents and Receivers",
};

// ─────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
      <html
        lang="en"
        suppressHydrationWarning
        className={cn("font-sans", geist.variable)}
      >
        <body className={geist.variable}>
          <QueryProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
            >
              {children}
              <Toaster position="top-right" richColors />
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    );
}