import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Soko Tanzania - Buy & Sell Online in Tanzania",
    template: "%s | Soko Tanzania",
  },
  description:
    "Tanzania's leading online marketplace. Buy and sell electronics, vehicles, property, fashion, and more. Nunua na Uza mtandaoni.",
  keywords: [
    "Tanzania",
    "marketplace",
    "buy",
    "sell",
    "online shopping",
    "classified ads",
    "Dar es Salaam",
    "Soko",
  ],
  authors: [{ name: "Soko Tanzania" }],
  openGraph: {
    type: "website",
    locale: "sw_TZ",
    url: "https://sokotanzania.co.tz",
    siteName: "Soko Tanzania",
    title: "Soko Tanzania - Buy & Sell Online",
    description: "Tanzania's leading online marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soko Tanzania",
    description: "Buy & Sell Online in Tanzania",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0eb" },
    { media: "(prefers-color-scheme: dark)", color: "#2d2418" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} bg-background`}
    >
      <body
        className="font-sans antialiased min-h-screen"
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
