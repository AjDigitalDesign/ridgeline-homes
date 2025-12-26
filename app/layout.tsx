import type { Metadata } from "next";
import { Suspense } from "react";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { LocationProvider } from "@/components/providers/location-provider";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { AdvancedAnalyticsProvider } from "@/components/advanced-analytics";
import { ChatWidgetWrapper } from "@/components/ai-chat";
import { FlyoutBannerPopup } from "@/components/flyout-banner";
import { generateMetadata as generateSeoMetadata, siteConfig } from "@/lib/seo";
import { fetchTenant } from "@/lib/api";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  // Fetch tenant data for dynamic favicon
  let faviconUrl: string | undefined;
  try {
    const response = await fetchTenant();
    faviconUrl = response.data?.favicon || undefined;
  } catch {
    // Use default favicon if tenant fetch fails
  }

  return {
    metadataBase: new URL(siteConfig.url),
    ...generateSeoMetadata({
      title: `${siteConfig.name} | ${siteConfig.tagline}`,
      description: siteConfig.description,
      image: `${siteConfig.url}/og-image.jpg`,
      openGraph: {
        title: siteConfig.name,
        description: siteConfig.description,
        image: `${siteConfig.url}/og-image.jpg`,
      },
      twitter: {
        title: siteConfig.name,
        description: siteConfig.description,
        image: `${siteConfig.url}/og-image.jpg`,
      },
    }),
    icons: faviconUrl
      ? {
          icon: faviconUrl,
          shortcut: faviconUrl,
          apple: faviconUrl,
        }
      : undefined,
  };
}

async function getTenantData() {
  try {
    const response = await fetchTenant();
    return response.data;
  } catch {
    // Return null if tenant not available - TenantProvider will use defaults
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenantData();

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased overflow-x-hidden`}
      >
        <QueryProvider>
          <TenantProvider initialTenant={tenant}>
            <AuthProvider>
              <FavoritesProvider>
                <LocationProvider>
                  <Suspense fallback={null}>
                    <AdvancedAnalyticsProvider>
                      <AnalyticsProvider />
                      <Header />
                      {children}
                      <Footer />
                      <Toaster />
                      <ChatWidgetWrapper />
                      <FlyoutBannerPopup />
                    </AdvancedAnalyticsProvider>
                  </Suspense>
                </LocationProvider>
              </FavoritesProvider>
            </AuthProvider>
          </TenantProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
