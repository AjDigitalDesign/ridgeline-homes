import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ridgeline Homes | Top Notch Living Space",
  description: "Bringing together a team with passion, dedication, and resources to help our clients reach their buying and selling goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
      >
        <QueryProvider>
          <FavoritesProvider>
            <Header />
            {children}
            <Footer />
          </FavoritesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
