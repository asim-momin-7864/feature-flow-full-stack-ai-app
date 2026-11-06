import type { Metadata } from "next";
import { Geist, Roboto_Slab, Public_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/auth/theme-provider";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/custome/navbar";
import { Footer } from "@/components/custome/footer";

const publicSansHeading = Public_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-serif",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Feature Flow",
  description:
    "A product feedback and roadmap board with AI duplicate detection.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-serif",
        robotoSlab.variable,
        publicSansHeading.variable,
      )}
    >
      <body
        className={`${geistSans.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="flex flex-col min-h-[calc(100vh-64px)]">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
