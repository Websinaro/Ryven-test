import type { Metadata } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Effects from "@/components/Effects";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/data/site";

const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-chakra" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jbmono" });

export const metadata: Metadata = {
  title: `${site.companyName} — Video Editing Studio`,
  description: "We turn footage into attention. Video editing, reels, commercials, motion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`bg-background ${chakra.variable} ${inter.variable} ${jbmono.variable}`}>
      <body className="font-body antialiased">
        <SmoothScroll />
        <Effects />
        {children}
      </body>
    </html>
  );
}
