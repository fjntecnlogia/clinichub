import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ClinicHub | Seu Espaco Profissional",
  description:
    "Alugue salas medicas e clinicas por hora, sem contrato. Plataforma completa para profissionais de saude.",
  keywords: [
    "aluguel sala medica",
    "clinica por hora",
    "consultorio compartilhado",
    "coworking medico",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
