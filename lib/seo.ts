import type { Metadata } from "next";

// Site-wide SEO constants
export const siteConfig = {
  name: "Ridgeline Homes",
  tagline: "Top Notch Living Space",
  description:
    "Bringing together a team with passion, dedication, and resources to help our clients reach their buying and selling goals.",
  url: "https://ridgelinehomes.com",
  locale: "en_US",
  twitter: {
    handle: "@ridgelinehomes",
    cardType: "summary_large_image" as const,
  },
};

// Default Open Graph image (must be absolute URL for social sharing)
const defaultOgImage = `${siteConfig.url}/og-image.jpg`;

/**
 * Parse keywords from string or array format
 */
function parseKeywords(keywords: string | string[] | null | undefined): string[] {
  if (!keywords) return [];
  if (Array.isArray(keywords)) return keywords.filter(Boolean);
  return keywords.split(",").map((k) => k.trim()).filter(Boolean);
}

interface GenerateMetadataOptions {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article";
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

/**
 * Generate consistent metadata for any page
 *
 * @example
 * // Static page
 * export const metadata = generateMetadata({
 *   title: "Communities",
 *   description: "Browse our new home communities in Maryland.",
 * });
 *
 * @example
 * // Dynamic page with generateMetadata function
 * export async function generateMetadata({ params }) {
 *   const community = await fetchCommunity(params.slug);
 *   return generateMetadata({
 *     title: community.name,
 *     description: community.description,
 *     image: community.gallery?.[0],
 *   });
 * }
 */
export function generateMetadata({
  title,
  description = siteConfig.description,
  keywords = [],
  image,
  noIndex = false,
  canonical,
  openGraph,
  twitter,
}: GenerateMetadataOptions): Metadata {
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  // Ensure we have a valid image URL (not empty string)
  const ogImage = (image && image.trim()) || (openGraph?.image && openGraph.image.trim()) || defaultOgImage;
  const ogTitle = openGraph?.title || title;
  const ogDescription = openGraph?.description || description;

  const twitterTitle = twitter?.title || ogTitle;
  const twitterDescription = twitter?.description || ogDescription;
  const twitterImage = (twitter?.image && twitter.image.trim()) || ogImage;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    ...(canonical && { alternates: { canonical } }),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: openGraph?.type || "website",
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: ogTitle,
          },
        ],
      }),
    },
    twitter: {
      card: siteConfig.twitter.cardType,
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImage && { images: [twitterImage] }),
    },
  };
}

/**
 * Generate metadata for community detail pages
 */
interface CommunityMetadataOptions {
  name: string;
  city?: string | null;
  state?: string | null;
  description?: string | null;
  priceMin?: number | null;
  gallery?: string[];
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | string[] | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
  } | null;
}

export function generateCommunityMetadata(
  community: CommunityMetadataOptions
): Metadata {
  const defaultDescription = `Explore ${community.name}${
    community.city ? ` in ${community.city}, ${community.state}` : ""
  }. New homes${
    community.priceMin
      ? ` starting from $${community.priceMin.toLocaleString()}`
      : ""
  }. Schedule a tour today!`;

  const keywords = parseKeywords(community.seo?.keywords) || [
    "new homes",
    community.name,
    community.city || "",
    community.state || "",
    "home builder",
  ].filter(Boolean);

  return generateMetadata({
    title: community.seo?.title || community.name,
    description:
      community.seo?.description || community.description || defaultDescription,
    keywords: keywords.length > 0 ? keywords : [
      "new homes",
      community.name,
      community.city || "",
      community.state || "",
      "home builder",
    ].filter(Boolean),
    image: community.seo?.ogImage || community.gallery?.[0],
    openGraph: {
      title: community.seo?.ogTitle || community.name,
      description:
        community.seo?.ogDescription ||
        community.description ||
        defaultDescription,
      image: community.seo?.ogImage || community.gallery?.[0],
    },
  });
}

/**
 * Generate metadata for home detail pages
 */
interface HomeMetadataOptions {
  name: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFeet?: number | null;
  gallery?: string[];
  community?: { name: string } | null;
  floorplan?: { name: string } | null;
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | string[] | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
  } | null;
}

export function generateHomeMetadata(home: HomeMetadataOptions): Metadata {
  const address = home.street || home.name;
  const location = [home.city, home.state].filter(Boolean).join(", ");

  const specs = [
    home.bedrooms ? `${home.bedrooms} beds` : "",
    home.bathrooms ? `${home.bathrooms} baths` : "",
    home.squareFeet ? `${home.squareFeet.toLocaleString()} sq ft` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const defaultDescription = `${address}${location ? ` in ${location}` : ""}${
    home.price ? ` - $${home.price.toLocaleString()}` : ""
  }${specs ? `. ${specs}` : ""}. Schedule a tour today!`;

  const keywords = parseKeywords(home.seo?.keywords);

  return generateMetadata({
    title: home.seo?.title || address,
    description: home.seo?.description || defaultDescription,
    keywords: keywords.length > 0 ? keywords : [
      "home for sale",
      home.community?.name || "",
      home.city || "",
      home.state || "",
      home.floorplan?.name || "",
    ].filter(Boolean),
    image: home.seo?.ogImage || home.gallery?.[0],
    openGraph: {
      title: home.seo?.ogTitle || address,
      description: home.seo?.ogDescription || defaultDescription,
      image: home.seo?.ogImage || home.gallery?.[0],
    },
  });
}

/**
 * Generate metadata for floorplan detail pages
 */
interface FloorplanMetadataOptions {
  name: string;
  basePrice?: number | null;
  baseBedrooms?: number | null;
  baseBathrooms?: number | null;
  baseSquareFeet?: number | null;
  elevationGallery?: string[];
  gallery?: string[];
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | string[] | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
  } | null;
}

export function generateFloorplanMetadata(
  floorplan: FloorplanMetadataOptions
): Metadata {
  const specs = [
    floorplan.baseBedrooms ? `${floorplan.baseBedrooms} beds` : "",
    floorplan.baseBathrooms ? `${floorplan.baseBathrooms} baths` : "",
    floorplan.baseSquareFeet
      ? `${floorplan.baseSquareFeet.toLocaleString()} sq ft`
      : "",
  ]
    .filter(Boolean)
    .join(", ");

  const defaultDescription = `The ${floorplan.name} floor plan${
    floorplan.basePrice
      ? ` starting at $${floorplan.basePrice.toLocaleString()}`
      : ""
  }${specs ? `. ${specs}` : ""}. View details and schedule a tour.`;

  const image =
    floorplan.seo?.ogImage ||
    floorplan.elevationGallery?.[0] ||
    floorplan.gallery?.[0];

  const keywords = parseKeywords(floorplan.seo?.keywords);

  return generateMetadata({
    title: floorplan.seo?.title || `The ${floorplan.name}`,
    description: floorplan.seo?.description || defaultDescription,
    keywords: keywords.length > 0 ? keywords : [
      "floor plan",
      floorplan.name,
      "new home",
      "home design",
    ],
    image,
    openGraph: {
      title: floorplan.seo?.ogTitle || `The ${floorplan.name}`,
      description: floorplan.seo?.ogDescription || defaultDescription,
      image,
    },
  });
}

/**
 * Generate metadata for blog post pages
 */
interface BlogPostMetadataOptions {
  title: string;
  excerpt?: string | null;
  featureImage?: string | null;
  categories?: { name: string; slug: string }[];
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
    twitterTitle?: string | null;
    twitterDescription?: string | null;
    twitterImage?: string | null;
    canonicalUrl?: string | null;
    index?: boolean;
    follow?: boolean;
  } | null;
}

export function generateBlogPostMetadata(post: BlogPostMetadataOptions): Metadata {
  const defaultDescription = post.excerpt || `Read "${post.title}" on our blog.`;
  const categoryNames = post.categories?.map(c => c.name) || [];

  return generateMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || defaultDescription,
    keywords: post.seo?.keywords?.split(",").map(k => k.trim()) || [
      "blog",
      ...categoryNames,
      "home building",
    ],
    image: post.seo?.ogImage || post.featureImage || undefined,
    noIndex: post.seo?.index === false,
    canonical: post.seo?.canonicalUrl || undefined,
    openGraph: {
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription || defaultDescription,
      image: post.seo?.ogImage || post.featureImage || undefined,
      type: "article",
    },
    twitter: {
      title: post.seo?.twitterTitle || post.seo?.ogTitle || post.title,
      description: post.seo?.twitterDescription || post.seo?.ogDescription || defaultDescription,
      image: post.seo?.twitterImage || post.seo?.ogImage || post.featureImage || undefined,
    },
  });
}

/**
 * Generate metadata for blog listing page
 */
interface BlogPageMetadataOptions {
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
    twitterTitle?: string | null;
    twitterDescription?: string | null;
    twitterImage?: string | null;
    canonicalUrl?: string | null;
    index?: boolean;
    follow?: boolean;
  } | null;
}

export function generateBlogPageMetadata(page: BlogPageMetadataOptions): Metadata {
  const defaultDescription = "Read the latest news, tips, and insights about home building.";

  return generateMetadata({
    title: page.seo?.title || "Blog",
    description: page.seo?.description || defaultDescription,
    keywords: page.seo?.keywords?.split(",").map(k => k.trim()) || [
      "home building blog",
      "real estate news",
      "home tips",
      "Maryland homes",
    ],
    image: page.seo?.ogImage || undefined,
    noIndex: page.seo?.index === false,
    canonical: page.seo?.canonicalUrl || undefined,
    openGraph: {
      title: page.seo?.ogTitle || "Blog",
      description: page.seo?.ogDescription || defaultDescription,
      image: page.seo?.ogImage || undefined,
    },
    twitter: {
      title: page.seo?.twitterTitle || page.seo?.ogTitle || "Blog",
      description: page.seo?.twitterDescription || page.seo?.ogDescription || defaultDescription,
      image: page.seo?.twitterImage || page.seo?.ogImage || undefined,
    },
  });
}

/**
 * JSON-LD structured data for blog posts (Article schema)
 */
export function generateBlogPostJsonLd(post: {
  title: string;
  excerpt?: string | null;
  featureImage?: string | null;
  publishDate?: string | null;
  createdAt?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.featureImage || undefined,
    datePublished: post.publishDate || post.createdAt,
    dateModified: post.publishDate || post.createdAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

/**
 * JSON-LD structured data for communities (LocalBusiness schema)
 */
export function generateCommunityJsonLd(community: {
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  gallery?: string[];
  priceMin?: number | null;
  priceMax?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: `${community.name} by ${siteConfig.name}`,
    description: community.description || undefined,
    image: community.gallery?.[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: community.address || undefined,
      addressLocality: community.city || undefined,
      addressRegion: community.state || undefined,
      postalCode: community.zipCode || undefined,
      addressCountry: "US",
    },
    ...(community.latitude &&
      community.longitude && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: community.latitude,
          longitude: community.longitude,
        },
      }),
    ...(community.priceMin && {
      priceRange: community.priceMax
        ? `$${community.priceMin.toLocaleString()} - $${community.priceMax.toLocaleString()}`
        : `From $${community.priceMin.toLocaleString()}`,
    }),
  };
}

/**
 * JSON-LD structured data for homes (Product schema)
 */
export function generateHomeJsonLd(home: {
  name: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFeet?: number | null;
  gallery?: string[];
  status: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: home.street || home.name,
    description: `${home.bedrooms || 0} bed, ${home.bathrooms || 0} bath home${
      home.squareFeet ? ` with ${home.squareFeet.toLocaleString()} sq ft` : ""
    }`,
    image: home.gallery?.[0],
    offers: {
      "@type": "Offer",
      price: home.price || undefined,
      priceCurrency: "USD",
      availability:
        home.status === "AVAILABLE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}
