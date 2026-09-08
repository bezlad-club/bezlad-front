export const revalidate = 3600;

import type { Metadata } from "next";
import { Raleway, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import CallButton from "@/components/shared/callButton/CallButton";
import schemaOrgData from "@/constants/schemaOrgData.json";
import Script from "next/script";
import { CartProvider } from "@/contexts/CartContext";

const SITE_URL = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const azbuka = localFont({
  src: [
    {
      path: "../../../public/fonts/azbuka04.woff2",
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
        <CartProvider>
          <Header />
          <main className="flex-1 overflow-hidden"> {children}</main>
          <Footer />
          <CallButton />
        </CartProvider>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1556056652139643');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* Raw <img> is required by the Meta Pixel noscript fallback; it must not be optimized. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=1556056652139643&ev=PageView&noscript=1"
          />
        </noscript>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WDW5LF47');
            `,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WDW5LF47"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
