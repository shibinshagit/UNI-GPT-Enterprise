import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uni-GPT Voice Assistant",
  description: "Professional voice-powered AI assistant for UniQube bathroom pods and kitchens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
