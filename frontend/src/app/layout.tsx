import type { Metadata } from "next";
import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/lib/providers";

const fira_sans = Fira_Sans({ subsets: ["latin"], weight: ["200", "400", "600", "800"], variable: "--font-sans" });
const fira_code = Fira_Code({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Parcha",
  description: "Parcha is a brain-dump and a tool for thought.",
  icons: [
    {
      url: "/logo256-2.png",
      type: "image/png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(fira_code.variable, fira_sans.variable)}>
      <body className={cn("bg-zinc-50", "text-zinc-800")}>
        <Providers>
          <div className="w-full max-w-[1200px] mx-auto px-6">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
