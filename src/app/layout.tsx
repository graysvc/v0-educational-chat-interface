import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
