import type { Metadata } from "next";
import { Roboto, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// meno-display/meno-text (requested) are commercial Type Network fonts only
// available via a licensed Adobe Fonts kit. Source Serif 4 is a free look-alike
// for headings; Roboto is used for body/UI text as requested.
const sourceSerif = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Pekka + Liina 90v — Tehtävälista",
  description: "Jaettu tehtävälista Pekka + Liina 90v -juhlille",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
