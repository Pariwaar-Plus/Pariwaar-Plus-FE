// app/layout.tsx
import "@/app/globals.css";
import { Geist,DM_Sans,Playfair_Display } from "next/font/google";
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


const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
        <body className={`${dmSans.variable} ${playfair.variable} ${geist.variable} `}>
          <QueryProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem ={false}
            >
              {children}
              <Toaster position="top-right" richColors />
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    );
}