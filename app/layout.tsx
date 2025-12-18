import type { Metadata } from "next";
import { Suspense } from "react";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { AdvancedAnalyticsProvider } from "@/components/advanced-analytics";
import { generateMetadata as generateSeoMetadata, siteConfig } from "@/lib/seo";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = generateSeoMetadata({
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased overflow-x-hidden`}
      >
        <QueryProvider>
          <AuthProvider>
            <FavoritesProvider>
              <Suspense fallback={null}>
                <AdvancedAnalyticsProvider>
                  <AnalyticsProvider />
                  <Header />
                  {children}
                  <Footer />
                  <Toaster />
                </AdvancedAnalyticsProvider>
              </Suspense>
            </FavoritesProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
