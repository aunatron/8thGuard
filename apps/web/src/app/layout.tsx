import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "8thGuard",
  description: "Ghana-first crypto P2P fraud protection"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
