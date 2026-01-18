import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thirukkural – A Day",
  description: "A daily Thirukkural (தமிழ்) with meaning and explanation. New kural every day (IST).",
  metadataBase: new URL("https://thirukural-a-day.com"),
  alternates: {
    canonical: "https://thirukural-a-day.com",
  },
  openGraph: {
    title: "Thirukkural – A Day",
    description: "A daily Thirukkural with meaning and explanation. New kural every day (IST).",
    url: "https://thirukural-a-day.com",
    siteName: "Thirukkural – A Day",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thirukkural – A Day",
    description: "A daily Thirukkural with meaning and explanation. New kural every day (IST).",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

