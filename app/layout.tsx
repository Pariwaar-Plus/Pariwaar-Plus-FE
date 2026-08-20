// app/layout.tsx
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { DM_Sans, Geist, Playfair_Display } from "next/font/google";

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
  title: "Pariwaar Plus",
  description: "Fully Managed Care Coordination",
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