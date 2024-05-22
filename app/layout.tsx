import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import SimpleLayoutWrapper from "@/components/SimpleLayoutWrapper";
import ProgressBarProviders from "@/components/progress-bar-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Pendataan Peralatan CV. Satya",
  description:
    "Aplikasi Inventaris CV Satya adalah aplikasi yang digunakan untuk mengelola data inventaris barang yang ada di CV Satya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-white dark:bg-zinc-950  antialiased")}
      >
        {/* <body className="bg-background text-foreground"> */}
        {/* <main className="flex flex-col items-center min-h-screen">
          {children}
        </main> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressBarProviders>
            <SimpleLayoutWrapper>{children}</SimpleLayoutWrapper>
          </ProgressBarProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
