import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import WhatsAppButton from "@/components/WhatsAppButton";


export const metadata: Metadata = {
  title: {
    default: "KartFusion — Construtor de sites profissional",
    template: "%s · KartFusion",
  },
  description:
    "KartFusion é a plataforma brasileira para criar, personalizar e publicar sites profissionais sem programar. Editor visual drag and drop, templates premium e publicação em um clique.",
  keywords: [
    "criador de sites",
    "construtor de sites",
    "site profissional",
    "landing page",
    "editor visual",
    "KartFusion",
  ],
  openGraph: {
    title: "KartFusion — Construtor de sites profissional",
    description:
      "Crie sites profissionais com editor visual drag and drop, templates premium e publicação instantânea.",
    type: "website",
    locale: "pt_BR",
  },
};


export const viewport: Viewport = {
  themeColor: "#04060c",
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <html lang="pt-BR">

      <body
        className="
        min-h-screen
        bg-ink-950
        font-sans
        text-slate-200
        antialiased
        "
      >

        {children}


        <WhatsAppButton />


      </body>

    </html>
  );

}