import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});
const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
    title: "Ritual Dorado | Spa Tántrico Profesional Lima",
    description:
        "Experiencia de masaje tántrico profesional en Lima. Energía, bienestar y conexión en un ambiente de lujo nocturno.",
    generator: "v0.app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                {/* Preconnect / DNS-prefetch for Firebase & Google APIs to reduce handshake time */}
                <link
                    rel="preconnect"
                    href="https://landings-5bef0.firebaseapp.com"
                    crossOrigin=""
                />
                <link
                    rel="preconnect"
                    href="https://www.googleapis.com"
                    crossOrigin=""
                />
                <link
                    rel="preconnect"
                    href="https://firestore.googleapis.com"
                    crossOrigin=""
                />
                <link
                    rel="dns-prefetch"
                    href="https://landings-5bef0.firebaseapp.com"
                />
                {/* Nota: El preload del video se maneja dinámicamente por el navegador con preload="auto" */}
            </head>
            <body
                className={`${playfair.variable} ${montserrat.variable} font-sans antialiased bg-background text-foreground`}
            >
                {children}
                {/* <Analytics /> */}
            </body>
        </html>
    );
}
