import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Token Listener",
  description:
    "Listens for 'now serving token number…' announcements and alerts you when your number is called.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
