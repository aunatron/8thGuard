import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "8thGuard",
  description: "Global crypto fraud intelligence and transaction safety"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
