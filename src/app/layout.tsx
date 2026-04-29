import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookly eBooks",
  description: "Browse and read curated eBooks from Bookly.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
        { children }
      </body>
    </html>
  );
}
