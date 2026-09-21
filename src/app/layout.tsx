import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.companyName} — Video Editing Studio`,
  description: "We turn footage into attention. Video editing, reels, commercials, motion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">{children}</body>
    </html>
  );
}
