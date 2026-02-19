import Navbar from "./components/Navbar";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kenya District Y's Men - District Conference 2026 Registration",
  description:
    "Register for the Kenya District Y's Men International District Conference 2026.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />

        <main className="min-h-screen bg-gray-50">{children}</main>

        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Y&apos;s Men International - Kenya District. All
              rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}