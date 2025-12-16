import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next"
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lectra | AI-Powered Study Companion",
  description:
    "Transform your study experience with Lectra. Upload and chat with course materials, access shared notes and past exams, and get instant AI-powered explanations. The smartest way to master your university courses.",
  keywords: [
    "Lectra",
    "AI study tool",
    "course notes",
    "exam preparation",
    "university study guide",
    "student resources",
    "AI tutor",
    "document chat",
    "study materials sharing",
    "RAG study platform"
  ],
  openGraph: {
    title: "Lectra - Your Intelligent Study Companion",
    description:
      "Upload course materials, chat with AI about your notes, and access a shared library of past exams and summaries. Master your courses with Lectra.",
    url: "https://lectraai.ca",
    siteName: "Lectra",
    images: [
      {
        url: "https://lectraai.ca/preview.png",
        width: 1200,
        height: 630,
        alt: "Lectra Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lectra - Master Your Courses with AI",
    description:
      "Chat with your course materials, find shared notes, and ace your exams with Lectra's AI-powered study platform.",
    images: ["https://lectraai.ca/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
      <Analytics />
    </html>
  );
}
