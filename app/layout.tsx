import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#090b10",
};

export const metadata: Metadata = {
  title: "Stiklų Tamsinimo Meistras | Profesionalus Auto ir Pastatų Tamsinimas su Garantija",
  description:
    "Sertifikuotas stiklų tamsinimas originaliomis JAV nano-keramikinėmis plėvelėmis (SunTek, Llumar, Global). 10 metų rašytinė garantija, 100% legalūs sertifikatai TA, nulinis defektų garantavimas. Užsakykite šiandien!",
  keywords: [
    "stiklu tamsinimas",
    "automobiliu stiklu tamsinimas",
    "nano keramika",
    "atermine plevele",
    "stiklu tamsinimas kaina",
    "stiklu tamsinimas vilnius",
    "stiklu tamsinimo meistras",
    "pastatu langu tamsinimas",
    "zibintu tamsinimas",
  ],
  authors: [{ name: "Stiklų Tamsinimo Meistras" }],
  openGraph: {
    title: "Stiklų Tamsinimo Meistras | 100% Rezultato Garantija",
    description:
      "Aukščiausio lygio automobilių ir pastatų stiklų tamsinimas. 10 metų garantija, iki 82% karščio atstūmimas, gamyklinė kokybė.",
    url: "https://stiklutamsinimas.eu",
    siteName: "Stiklų Tamsinimo Meistras",
    locale: "lt_LT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className="h-full antialiased scroll-smooth dark">
      <body className="min-h-full flex flex-col bg-[#090b10] text-slate-100 selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}

