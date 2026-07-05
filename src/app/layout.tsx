import type { Metadata } from "next";
import { Montserrat, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-montserrat",
});

// Retro pixel font (the original site loads this from Google Fonts).
const pixel = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: {
    default: "Bill Generator Online — Free Invoice & Receipt Maker",
    template: "%s | Bill Generator",
  },
  description:
    "Create professional bills, invoices and receipts online in minutes. 22+ generators, multiple templates, themes and currencies. Download as PDF or email instantly.",
  keywords: [
    "bill generator",
    "invoice generator",
    "receipt maker",
    "fuel bill",
    "rent receipt",
    "GST invoice",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${pixel.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Product Sans — not on Google Fonts; loaded from its public web CDN. */}
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/product-sans" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
