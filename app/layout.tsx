import type { Metadata } from "next";
import { Caveat, Crimson_Pro, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import { getSyllabus } from "./lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grit · Python Syllabus",
  description:
    "A complete Python learning path — from prerequisites to advanced patterns.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sections = await getSyllabus();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${crimson.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#fbfaf4] text-slate-900">
        <div className="flex min-h-screen">
          <Sidebar sections={sections} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
