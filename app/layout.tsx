import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Josefin_Sans,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Toaster } from "sonner";
import { ProviderSession } from "@/components/ProviderSession";
import MetaPixel from "@/components/MetaPixel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "yodi-store Cosmetics",
  description:
    "Yodi-store vend des produits pharmaceutiques et cosmétiques, vous trouverez ici toute les sortes de produit cosmétiques",
  icons: {
    icon: "/logo.png",
  },

  keywords: [
    "yodi-store",
    "yodi-store Cosmetics",
    "yodi-store pharmaceutiques",
    "yodi-store cosmétiques",
    "dakar",
    "sénégal",
    "Tisane Detox",
    "Savon",
    "Tisane Digestive",
    "Baume à Barbe",
    "Cheveux",
    "Huile à Barbe",
  ],

  openGraph: {
    title: "yodi-store Cosmetics",
    description:
      "Yodi-store vend des produits parapharmaceutiques et cosmétiques, vous trouverez ici toute les sortes de produit cosmétiques",
    images: "/logo.png",
  },

  twitter: {
    title: "yodi-store Cosmetics",
    description:
      "Yodi-store vend des produits parapharmaceutiques et cosmétiques, vous trouverez ici toute les sortes de produit cosmétiques",
    images: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <MetaPixel />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${josefinSans.variable} ${playfairDisplay.variable} antialiased bg-white h-full`}
      >
        <ProviderSession>
          <Toaster />
          <Header />
          <Hero />
          {children}
          <Footer />
        </ProviderSession>
      </body>
    </html>
  );
}
