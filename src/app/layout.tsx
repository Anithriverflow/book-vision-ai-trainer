import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Book Vision AI Trainer - Powered by Fal AI",
  description:
    "Train AI models on your favorite books and generate stunning visualizations using Fal AI's Flux models.",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Fal AI Footer */}
        <footer className="fixed bottom-4 right-4 text-xs text-gray-500 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1">
            <span>Powered by</span>
            <a
              href="https://fal.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Fal AI
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}

export default RootLayout;
