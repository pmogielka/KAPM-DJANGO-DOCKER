import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import "@/styles/infino/base.css";
import "@/styles/infino/components.css";
import "@/styles/infino/utilities.css";

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  display: 'swap',
  variable: '--font-open-sans'
});

export const metadata: Metadata = {
  title: "KAPM - Kancelaria Prawna | Prawo Upadłościowe i Restrukturyzacyjne",
  description: "Profesjonalna obsługa prawna w zakresie prawa upadłościowego i restrukturyzacyjnego. Doświadczeni prawnicy, indywidualne podejście.",
  keywords: "prawo upadłościowe, restrukturyzacja, upadłość konsumencka, doradztwo prawne, kancelaria prawna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${openSans.className} ${openSans.variable}`}>
        {children}
      </body>
    </html>
  );
}