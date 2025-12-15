export const revalidate = 60;

import type { Metadata } from "next";
import { Raleway, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import CallButton from "@/components/shared/callButton/CallButton";
import schemaOrgData from "@/constants/schemaOrgData.json";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bezlad.com";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const azbuka = localFont({
  src: [
    {
      path: "../../public/fonts/azbuka04.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-azbuka",
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bezlad Club - дитячий центр з найбільшою пісочницею в Україні",
  description:
    "Дитячий центр на Подолі, Правий берег: найбільша пісочниця, інтерактивні та ігрові зони. Гра, розвиток і спокій для дітей та батьків.",
  openGraph: {
    images: [
      {
        url: `${SITE_URL}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Діти грають у найбільшій пісочниці України у дитячому центрі Bezlad Club на Подолі, Київ",
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
    <html lang="uk" className="scroll-smooth">
      <body
        className={`${raleway.variable} ${azbuka.variable} ${montserrat.variable} flex min-h-screen flex-col text-[16px] font-normal leading-[120%] antialiased`}
      >
        <Header />
        <main className="flex-1 overflow-hidden"> {children}</main>
        <Footer />
        <CallButton />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaOrgData),
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "uc717g6iu1");
            `,
          }}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XHFLMQD4M9"
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XHFLMQD4M9');
            `,
          }}
        />
      </body>
    </html>
  );
}
