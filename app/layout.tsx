import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";
import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tecnologieevolutive.it"),
  title: "Tecnologie Evolutive | Fotovoltaico, Condizionatori, Caldaie e VMC a Roma",
  description:
    "Tecnologie Evolutive realizza impianti fotovoltaici, climatizzazione, caldaie e ventilazione meccanica controllata a Roma e provincia.",
  keywords: [
    "Tecnologie Evolutive",
    "fotovoltaico Roma",
    "installazione condizionatori Roma",
    "caldaie Roma",
    "ventilazione meccanica controllata Roma",
    "VMC Roma",
    "impianti tecnologici Roma",
  ],

  openGraph: {
    title:
      "Tecnologie Evolutive | Fotovoltaico, Condizionatori, Caldaie e VMC a Roma",
  
    description:
      "Tecnologie Evolutive realizza impianti fotovoltaici, climatizzazione, caldaie e ventilazione meccanica controllata a Roma e provincia.",
  
    url: "https://tecnologieevolutive.it",
  
    siteName: "Tecnologie Evolutive",
  
    locale: "it_IT",
  
    type: "website",
  
    images: [
      {
        url: "/og/tecnologie-evolutive.png",
        width: 1200,
        height: 630,
        alt: "Tecnologie Evolutive",
      },
    ],
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
    lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  {children}
  <CookieBanner />
  <GoogleAnalytics />
</body>
    </html>
  );
}
