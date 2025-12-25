"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type {
  Tenant,
  TenantThemeColors,
  TenantThemeFonts,
  TenantSectionConfig,
} from "@/lib/api";

interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: Error | null;
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  isLoading: true,
  error: null,
});

// Default colors matching the current hardcoded theme (from globals.css)
// --color-main-primary: #1c2d37, --color-main-secondary: #eed26e
const defaultColors: TenantThemeColors = {
  primary: "#1c2d37",
  secondary: "#eed26e",
  accent: "#364440",
  background: "#ffffff",
  foreground: "#1a1a1a",
};

const defaultFonts: TenantThemeFonts = {
  heading: "Playfair Display",
  body: "Open Sans",
};

// Border radius mapping
const borderRadiusMap = {
  none: "0",
  small: "0.25rem",
  medium: "0.5rem",
  large: "1rem",
};

// Apply CSS custom properties for theming
// Maps to existing Tailwind theme variables (--color-main-primary, --color-main-secondary, etc.)
function applyThemeColors(colors: TenantThemeColors) {
  const root = document.documentElement;

  // Main brand colors (matches existing Tailwind @theme in globals.css)
  root.style.setProperty("--color-main-primary", colors.primary);
  root.style.setProperty("--color-main-secondary", colors.secondary);
  root.style.setProperty("--color-main-accent", colors.accent);

  // Background and foreground
  root.style.setProperty("--color-background", colors.background);
  root.style.setProperty("--color-foreground", colors.foreground);
}

// Apply border radius
function applyBorderRadius(borderRadius: "none" | "small" | "medium" | "large") {
  const root = document.documentElement;
  root.style.setProperty("--radius", borderRadiusMap[borderRadius]);
}

// Load Google Fonts dynamically
function loadGoogleFonts(fonts: TenantThemeFonts) {
  const fontFamilies = [fonts.heading, fonts.body].filter(Boolean) as string[];

  if (fontFamilies.length === 0) return;

  // Check if fonts are already loaded
  const existingLink = document.querySelector(
    'link[data-tenant-fonts="true"]'
  );
  if (existingLink) {
    existingLink.remove();
  }

  // Build Google Fonts URL
  const fontParams = fontFamilies
    .map((font) => `family=${encodeURIComponent(font)}:wght@400;500;600;700`)
    .join("&");

  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
  link.rel = "stylesheet";
  link.setAttribute("data-tenant-fonts", "true");
  document.head.appendChild(link);

  // Apply font CSS variables
  const root = document.documentElement;
  root.style.setProperty("--font-heading", `"${fonts.heading}", serif`);
  root.style.setProperty("--font-body", `"${fonts.body}", sans-serif`);
}

interface TenantProviderProps {
  children: React.ReactNode;
  initialTenant?: Tenant | null;
}

export function TenantProvider({
  children,
  initialTenant = null,
}: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant);
  const [isLoading, setIsLoading] = useState(!initialTenant);
  const [error, setError] = useState<Error | null>(null);

  // Apply theme when tenant changes
  const applyTheme = useCallback((tenantData: Tenant | null) => {
    const colors = tenantData?.themePublished?.colors || defaultColors;
    const fonts = tenantData?.themePublished?.fonts || defaultFonts;
    const borderRadius = tenantData?.themePublished?.borderRadius || "medium";

    applyThemeColors(colors);
    loadGoogleFonts(fonts);
    applyBorderRadius(borderRadius);
  }, []);

  // Apply theme on mount and when tenant changes
  useEffect(() => {
    applyTheme(tenant);
  }, [tenant, applyTheme]);

  // If no initial tenant, apply defaults on mount
  useEffect(() => {
    if (!initialTenant) {
      applyThemeColors(defaultColors);
      loadGoogleFonts(defaultFonts);
      applyBorderRadius("medium");
      setIsLoading(false);
    }
  }, [initialTenant]);

  const value = useMemo(
    () => ({
      tenant,
      isLoading,
      error,
    }),
    [tenant, isLoading, error]
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

// Hook to get theme (colors, fonts, borderRadius)
export function useTenantTheme() {
  const { tenant } = useTenant();
  return tenant?.themePublished || null;
}

// Hook to get homepage template type
export function useHomepageTemplate(): "MODERN" | "BOLD" {
  const { tenant } = useTenant();
  return tenant?.homepageTemplate || "MODERN";
}

// Hook to get section configuration
export function useSectionConfig(): TenantSectionConfig[] {
  const { tenant } = useTenant();
  return tenant?.sectionConfigPublished?.sections || [];
}

// Get ordered and enabled sections for home page
export function useOrderedSections(): TenantSectionConfig[] {
  const sections = useSectionConfig();

  // Default sections if none configured
  if (sections.length === 0) {
    return [
      { type: "hero", enabled: true, order: 0 },
      { type: "promo", enabled: true, order: 1 },
      { type: "about", enabled: true, order: 2 },
      { type: "marketAreas", enabled: true, order: 3 },
      { type: "designCenter", enabled: true, order: 4 },
      { type: "featured", enabled: true, order: 5 },
      { type: "smartHome", enabled: true, order: 6 },
      { type: "testimonials", enabled: true, order: 7 },
      { type: "cta", enabled: true, order: 8 },
    ];
  }

  // Sort by order and filter enabled
  return [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);
}

// Helper to check if a section is enabled
export function useSectionEnabled(sectionType: string): boolean {
  const sections = useSectionConfig();

  // If no sections configured, default to enabled
  if (sections.length === 0) return true;

  const section = sections.find((s) => s.type === sectionType);
  return section?.enabled ?? false;
}

// Hook to get tenant contact info
export function useTenantContact() {
  const { tenant } = useTenant();
  if (!tenant) return null;

  return {
    companyName: tenant.builderName,
    phone: tenant.builderPhone,
    email: tenant.builderEmail,
    address: {
      line1: tenant.builderAddress,
      city: tenant.builderCity,
      county: tenant.builderCounty,
      state: tenant.builderState,
      zip: tenant.builderZip,
    },
    coordinates: {
      latitude: tenant.builderLatitude,
      longitude: tenant.builderLongitude,
    },
  };
}

// Hook to get tenant social links
export function useTenantSocial() {
  const { tenant } = useTenant();
  if (!tenant) return null;

  return {
    facebook: tenant.facebookUrl,
    twitter: tenant.twitterUrl,
    instagram: tenant.instagramUrl,
    linkedin: tenant.linkedinUrl,
    youtube: tenant.youtubeUrl,
  };
}

// Hook to get tenant branding assets
export function useTenantAssets() {
  const { tenant } = useTenant();
  if (!tenant) return null;

  return {
    logo: tenant.logo,
    favicon: tenant.favicon,
  };
}
