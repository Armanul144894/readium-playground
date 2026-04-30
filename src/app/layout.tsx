import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./home.css";
import SiteChrome from "./SiteChrome";

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookly eBooks",
  description: "Browse and read curated eBooks from Bookly.",
  icons: {
    icon: "/images/bookly_512.png",
    shortcut: "/images/bookly_512.png",
    apple: "/images/bookly_512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ inter.className }>
        <SiteChrome>
          { children }
        </SiteChrome>
      </body>
    </html>
  );
}
