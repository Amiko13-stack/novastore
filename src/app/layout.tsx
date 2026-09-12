import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: {
    default: "NovaStore — Modern everyday essentials",
    template: "%s | NovaStore",
  },
  description: "A premium full-stack e-commerce experience built with Next.js and AWS DynamoDB.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f6f3] text-zinc-950 antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
