import "./globals.css";
import type { Metadata } from "next";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "Peluquería - Referidos QR",
  description: "Sistema de promoción de referidos por QR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <main className="app-container">
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  );
}
