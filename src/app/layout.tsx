import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {ClerkProvider} from '@clerk/nextjs'
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};  



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
          <Header></Header>
          {children}
          <Footer></Footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
