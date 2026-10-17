import type { Metadata } from "next";
import { Urbanist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/core/redux/provider";
import { GymStoreProvider } from "@/context/GymStoreContext";
import { ToastProvider } from "@/context/ToastContext";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apex Gym Admin — Modern Gym Management System",
  description: "Next.js + Tailwind CSS v4 Gym Management System with full member management, attendance, plans, scheduling, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${urbanist.variable} ${geistMono.variable} antialiased bg-background text-text-primary min-h-screen`}
      >
        <ReduxProvider>
          <GymStoreProvider>
            <ToastProvider>{children}</ToastProvider>
          </GymStoreProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
