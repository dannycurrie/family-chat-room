import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Chat Room",
  description: "A fun family chat room for talking across the house!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
