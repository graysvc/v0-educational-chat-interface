import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Volver a Preguntar",
  description:
    "Un espacio para practicar con inteligencia artificial. Sin complicaciones.",
};

export const viewport: Viewport = {
  themeColor: "#f7f4f0",
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-99RGC7DP46" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-99RGC7DP46');`}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
