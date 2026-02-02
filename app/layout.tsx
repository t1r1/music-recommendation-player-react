import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EmotiFM - your vibe set by mood",
  description: "Music recommendations research project",
};

import { MoodProvider } from "@/context/MoodContext";

async function getMoodMaps() {
  const res = await fetch("http://127.0.0.1:8000/api/moods", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch mood maps");
  console.log(res);
  return res.json();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const moodMaps = await getMoodMaps();

  return (
    <html lang="en">
      <body>
        <MoodProvider initialMoodMaps={moodMaps}>{children}</MoodProvider>
      </body>
    </html>
  );
}
