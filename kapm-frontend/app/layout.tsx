import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}