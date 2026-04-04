import type { Metadata } from "next";
import { 
  Playfair_Display, 
  Montserrat, 
  Inter,
  Outfit
} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";

// Core 4 fonts — covers site defaults + admin + most popular Theme Lab choice
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings() || {};
  const favicon = settings.siteFavicon || "/favicon.ico";

  return {
    metadataBase: new URL('https://insightdesign.com'),
    title: settings.brandName ? `${settings.brandName} | Ultra-Premium Architecture` : "Insight Design & Construction",
    description: settings.footerDescription || "Insight Design and Construction offers breathtaking, elegant, and luxurious interior design and construction services.",
    keywords: ["Interior Design", "Construction", "Luxury Homes", "Dubai Interior Design", "Insight Design"],
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title: settings.brandName || "Insight Design & Construction",
      description: settings.footerDescription || "Breathtaking, elegant, and luxurious interior design and construction services.",
      url: "https://insightdesign.com",
      siteName: settings.brandName || "Insight Design & Construction",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: settings.brandName || "Insight Design & Construction",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.brandName || "Insight Design & Construction",
      description: settings.footerDescription || "Breathtaking, elegant, and luxurious interior design and construction services.",
      images: ["/og-image.jpg"],
    },
  };
}

import Navbar from "@/components/Navbar";
import TypographyManager from "@/components/TypographyManager";
import FaviconManager from "@/components/FaviconManager";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ThemeManager from "@/components/ThemeManager";
import MotionProvider from "@/components/MotionProvider";
import { EditModeProvider } from "@/context/EditModeContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { PublishBar } from "@/components/EditModeControls";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getSettings, getCategories, getProjects } from "@/lib/data";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settingsData, categoriesData, projectsData] = await Promise.all([
    getSettings(),
    getCategories(),
    getProjects()
  ]);

  const settings = settingsData || {};
  const categories = categoriesData || [];
  const projects = projectsData || [];
  
  // Dynamic Schema Generation
  const schema = settings?.schema || {};
  const org = settings?.organization || {};
  
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": settings.brandName,
      "url": "https://insightdesign.com",
      "description": schema.description || settings.heroDescription
    },
    {
      "@context": "https://schema.org",
      "@type": schema.type || "Organization",
      "name": org.legalName || settings.brandName,
      "legalName": org.legalName,
      "url": "https://insightdesign.com",
      "logo": schema.logo || settings.siteLogo,
      "foundingDate": org.foundingOrder,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": org.street,
        "addressLocality": org.locality,
        "postalCode": org.postalCode,
        "addressCountry": "AE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": org.phone || settings.phone,
        "contactType": "customer service"
      },
      "sameAs": [
        schema.facebook,
        schema.instagram,
        schema.linkedin,
        schema.twitter,
        schema.youtube
      ].filter(Boolean)
    }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`
          ${playfair.variable} 
          ${montserrat.variable} 
          ${inter.variable}
          ${outfit.variable}
          antialiased font-sans
        `}
        suppressHydrationWarning
      >
        <ThemeManager />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <EditModeProvider>
          <SettingsProvider initialSettings={settings} initialCategories={categories} initialProjects={projects}>
            <CustomCursor />
            <TypographyManager />
            <FaviconManager />
            <FloatingWhatsApp />
            <MotionProvider>
            <Navbar key="global-navbar" initialSettings={settings} />
            
            {/* ═══ Google Analytics 4 (GA4) ═══ */}
            {settings.ga4Id && (
              <div key="ga4-wrapper">
                <Script
                  id="ga4-gtag-src"
                  strategy="afterInteractive"
                  src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4Id}`}
                />
                <Script id="ga4-gtag-init" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${settings.ga4Id}');
                    ${settings.gadsConversionId ? `gtag('config', '${settings.gadsConversionId}');` : ''}
                  `}
                </Script>
              </div>
            )}

            {/* ═══ Google Ads (standalone if no GA4) ═══ */}
            {!settings.ga4Id && settings.gadsConversionId && (
              <div key="gads-wrapper">
                <Script
                  id="gads-gtag-src"
                  strategy="afterInteractive"
                  src={`https://www.googletagmanager.com/gtag/js?id=${settings.gadsConversionId}`}
                />
                <Script id="gads-gtag-init" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${settings.gadsConversionId}');
                  `}
                </Script>
              </div>
            )}

            {/* ═══ Meta (Facebook) Pixel ═══ */}
            {settings.metaPixelId && (
              <div key="meta-pixel-wrapper">
                <Script id="facebook-pixel" strategy="afterInteractive">
                  {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${settings.metaPixelId}');
                    fbq('track', 'PageView');
                  `}
                </Script>
                <noscript>
                  <img 
                    height="1" 
                    width="1" 
                    style={{ display: 'none' }} 
                    src={`https://www.facebook.com/tr?id=${settings.metaPixelId}&ev=PageView&noscript=1`} 
                  />
                </noscript>
              </div>
            )}

            {/* ═══ TikTok Pixel ═══ */}
            {settings.tiktokPixelId && (
              <div key="tiktok-pixel-wrapper">
                <Script id="tiktok-pixel" strategy="afterInteractive">
                  {`
                    !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                    ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
                    ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                    for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                    ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                    ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
                    ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e+\"_\"+Date.now()]={};
                    var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
                    var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                    ttq.load('${settings.tiktokPixelId}');
                    ttq.page();
                  }(window, document, 'ttq');
                  `}
                </Script>
              </div>
            )}

            {/* ═══ Snapchat Pixel ═══ */}
            {settings.snapchatPixelId && (
              <div key="snapchat-pixel-wrapper">
                <Script id="snapchat-pixel" strategy="afterInteractive">
                  {`
                    (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
                    {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
                    a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
                    r.src=n;var u=t.getElementsByTagName(s)[0];
                    u.parentNode.insertBefore(r,u);})(window,document,
                    'https://sc-static.net/scevent.min.js');
                    snaptr('init', '${settings.snapchatPixelId}', {});
                    snaptr('track', 'PAGE_VIEW');
                  `}
                </Script>
              </div>
            )}

            {/* ═══ Expose Google Ads Conversion Config ═══ */}
            {settings.gadsConversionId && (
              <Script id="gads-config-expose" strategy="afterInteractive">
                {`
                  window.__GADS_CONVERSION_ID = '${settings.gadsConversionId}';
                  window.__GADS_CONVERSION_LABEL = '${settings.gadsConversionLabel || ''}';
                `}
              </Script>
            )}

            <main key="main-content" className="min-h-screen">
              {children}
            </main>
            
            <Footer key="global-footer" initialSettings={settings} />
            <PublishBar key="admin-publish-bar" />
          </MotionProvider>
        </SettingsProvider>
      </EditModeProvider>
    </body>
  </html>
);
}
