import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { ChatWidget } from "@/components/chat-widget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MaciHub | Agendamento Odontologico",
  description:
    "Reserve cadeiras odontologicas por hora, sem contrato. Plataforma #1 para dentistas.",
  keywords: [
    "agendamento odontologico",
    "cadeira odontologica por hora",
    "consultorio dentista",
    "aluguel consultorio odontologico",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
