import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from '@/context';
import Link from "next/link";
import { TrendingUp } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Forex Platform",
  description: "Trade forex pairs with blockchain-powered stablecoins",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">CryptoForex</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                    Dashboard
                  </Link>
                  <Link href="/trade" className="text-gray-600 hover:text-gray-900 font-medium">
                    Trade
                  </Link>
                  <Link href="/markets" className="text-gray-600 hover:text-gray-900 font-medium">
                    Markets
                  </Link>
                  <Link href="/wallet" className="text-gray-600 hover:text-gray-900 font-medium">
                    Wallet
                  </Link>
                </nav>
                <div className="flex items-center gap-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="text-gray-600 hover:text-gray-900 font-medium">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-medium text-sm h-10 px-5 cursor-pointer transition-all">
                        Get Started
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
