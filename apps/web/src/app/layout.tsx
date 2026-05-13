import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "8thGuard | Check before you send",
  description: "Paid crypto safety, wallet intelligence, transaction review, and protected payment flow readiness."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
