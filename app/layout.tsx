import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/constants/brand";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-var",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — Beautiful Digital Wedding Invitations`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Create a beautiful digital wedding invitation and share it with one simple link. Track RSVPs in real time. Malaysian couples love WALIMATUL.",
  keywords: [
    "digital wedding invitation",
    "Malaysian wedding",
    "e-invite",
    "RSVP",
    "kad kahwin digital",
    "walimatul",
  ],
  authors: [{ name: BRAND.signature }],
  creator: BRAND.name,
  metadataBase: new URL(BRAND.url),
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: BRAND.url,
    siteName: BRAND.name,
    title: `${BRAND.name} — Beautiful Digital Wedding Invitations`,
    description:
      "Create a beautiful digital wedding invitation and share it with one simple link.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Beautiful Digital Wedding Invitations`,
    description:
      "Create a beautiful digital wedding invitation and share it with one simple link.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
