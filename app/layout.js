import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const montserrat = localFont({
  src: "./fonts/montserrat.woff2",
  weight: "100 900",
  variable: "--font-montserrat",
  display: "swap",
});

const abhayaLibre = localFont({
  src: [
    { path: "./fonts/abhaya-libre-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/abhaya-libre-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/abhaya-libre-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/abhaya-libre-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/abhaya-libre-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-abhaya-libre",
  display: "swap",
});

const cinzel = localFont({
  src: "./fonts/cinzel.woff2",
  weight: "400 900",
  variable: "--font-cinzel",
  display: "swap",
});

const josefinSans = localFont({
  src: "./fonts/josefin-sans.woff2",
  weight: "100 700",
  variable: "--font-josefin-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | UAE Real Estate`,
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | UAE Real Estate`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | UAE Real Estate`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "bS8cPqTspZbfg9ceOd4osJsZuJ4UO23tnzkLf4kBktA",
    other: {
      "msvalidate.01": "02BF0119E5143FFD526467316C5DD062",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${abhayaLibre.variable} ${cinzel.variable} ${josefinSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "yr9hnhr6ao");`}
        </Script>
      </body>
    </html>
  );
}
