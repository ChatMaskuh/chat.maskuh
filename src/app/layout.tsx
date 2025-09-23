import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "600"] 
});

export const metadata: Metadata = {
  title: "Chat.Maskuh",
  description: "A friendly chatbot to assist you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.className} bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
