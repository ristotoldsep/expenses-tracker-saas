import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/vendor/ph-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rahavoog - Jälgi oma raha liikumist!",
  description: "Rahavoog on nutikas rakendus, mis aitab Sul oma sissetulekuid ja kulutusi hallata, et saavutada parem finantskontroll ja selgus.",
  icons: {
    icon: "/favicon.png", // Default favicon
    shortcut: "/favicon.png", // Shortcut icon
    apple: "/favicon.png", // Apple touch icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0E1420]">
      {/* <head> */}
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
        {/* rest of your scripts go under */}
      {/* </head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-800 to-black`}
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
