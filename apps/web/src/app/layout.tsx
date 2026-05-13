import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "8thGuard — Crypto Wallet & Transaction Safety Checker",
    template: "%s | 8thGuard"
  },
  description:
    "Check any crypto wallet, transaction, or P2P agent for risk signals before sending funds. Multi-chain safety intelligence for Bitcoin, Ethereum, Solana, XRP, TRON, and TON.",
  keywords: [
    "crypto wallet checker",
    "wallet safety check",
    "crypto scam checker",
    "transaction risk review",
    "P2P agent verification",
    "8thGuard",
    "check before you send",
    "wallet intelligence",
    "crypto fraud detection",
    "Bitcoin wallet check",
    "Ethereum wallet safety",
    "Solana wallet check",
    "XRP wallet risk",
    "TRON wallet check",
    "TON wallet safety"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "8thGuard",
    title: "8thGuard — Check Before You Send",
    description:
      "Instant crypto wallet and transaction risk checks. Multi-chain intelligence across Bitcoin, Ethereum, Solana, XRP, TRON, and TON. Paid safety service.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "8thGuard — Crypto Safety Intelligence"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "8thGuard — Check Before You Send",
    description:
      "Instant crypto wallet and transaction risk checks. Multi-chain safety intelligence.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://8thguard.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
