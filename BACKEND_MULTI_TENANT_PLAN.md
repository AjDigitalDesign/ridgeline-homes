# Backend Multi-Tenant Configuration Plan

## Overview

This document outlines the backend implementation required to support multi-tenant branding and templating for the Ridgeline Homes frontend application. The super-admin will configure each tenant's branding (colors, fonts, logo) and home page template through the admin panel, and the frontend will consume this configuration via a public API endpoint.

---

## 1. Database Schema

### TenantBranding Table

```sql
CREATE TABLE tenant_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Primary Colors
  primary_color VARCHAR(7) NOT NULL DEFAULT '#1e3a5f',      -- e.g., "#1e3a5f"
  primary_light VARCHAR(7) NOT NULL DEFAULT '#2d4a6f',
  primary_dark VARCHAR(7) NOT NULL DEFAULT '#0f2a4f',

  -- Secondary Colors
  secondary_color VARCHAR(7) NOT NULL DEFAULT '#c9a227',
  secondary_light VARCHAR(7) NOT NULL DEFAULT '#d4b342',
  secondary_dark VARCHAR(7) NOT NULL DEFAULT '#b8911c',

  -- Accent Colors
  accent_color VARCHAR(7) NOT NULL DEFAULT '#4a90a4',
  accent_light VARCHAR(7) NOT NULL DEFAULT '#5ba0b4',
  accent_dark VARCHAR(7) NOT NULL DEFAULT '#3a8094',

  -- Neutral Colors
  background_color VARCHAR(7) NOT NULL DEFAULT '#ffffff',
  surface_color VARCHAR(7) NOT NULL DEFAULT '#f8f9fa',
  text_primary VARCHAR(7) NOT NULL DEFAULT '#1a1a1a',
  text_secondary VARCHAR(7) NOT NULL DEFAULT '#6b7280',

  -- Typography
  font_heading VARCHAR(100) NOT NULL DEFAULT 'Playfair Display',
  font_body VARCHAR(100) NOT NULL DEFAULT 'Open Sans',
  font_accent VARCHAR(100),  -- Optional accent font

  -- Logo & Assets
  logo_url TEXT,
  logo_dark_url TEXT,        -- Logo for dark backgrounds
  favicon_url TEXT,

  -- Footer/Header specific
  header_bg_color VARCHAR(7),
  footer_bg_color VARCHAR(7),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(tenant_id)
);
```

### TenantTemplate Table

```sql
CREATE TABLE tenant_template (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Template Selection
  home_template VARCHAR(50) NOT NULL DEFAULT 'modern',  -- 'modern', 'traditional', 'luxury', 'minimal', 'bold'

  -- Hero Section Configuration
  hero_type VARCHAR(20) NOT NULL DEFAULT 'image',       -- 'image', 'video', 'slider'
  hero_media_url TEXT,                                   -- Primary image or video URL
  hero_media_urls TEXT[],                                -- For slider: array of image URLs
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_cta_text VARCHAR(50) DEFAULT 'Explore Homes',
  hero_cta_link VARCHAR(255) DEFAULT '/homes',
  hero_overlay_opacity DECIMAL(3,2) DEFAULT 0.4,        -- 0.0 to 1.0

  -- Section Visibility & Order
  sections_order TEXT[] DEFAULT ARRAY['featured-communities', 'featured-homes', 'about', 'testimonials', 'cta'],
  show_featured_communities BOOLEAN DEFAULT true,
  show_featured_homes BOOLEAN DEFAULT true,
  show_about_section BOOLEAN DEFAULT true,
  show_testimonials BOOLEAN DEFAULT true,
  show_cta_section BOOLEAN DEFAULT true,

  -- About Section
  about_title TEXT,
  about_description TEXT,
  about_image_url TEXT,

  -- CTA Section
  cta_title TEXT,
  cta_description TEXT,
  cta_button_text VARCHAR(50),
  cta_button_link VARCHAR(255),
  cta_background_url TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(tenant_id)
);
```

### TenantSocialLinks Table

```sql
CREATE TABLE tenant_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  pinterest_url TEXT,
  tiktok_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(tenant_id)
);
```

### TenantContact Table

```sql
CREATE TABLE tenant_contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  company_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip VARCHAR(20),

  -- Business Hours (stored as JSON for flexibility)
  business_hours JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(tenant_id)
);
```

---

## 2. API Endpoints

### Public Endpoint: Get Tenant Configuration

This is the main endpoint the frontend will call on every page load to get the tenant's branding and configuration.

**Endpoint:** `GET /api/public/tenant/config`

**Authentication:** None required (public endpoint)

**Tenant Resolution:** The tenant is identified by either:
1. **Subdomain:** Extract from request header `Host` (e.g., `ridgeline.yourdomain.com`)
2. **Custom Domain:** Look up domain in `tenant_domains` table
3. **Header:** `X-Tenant-Slug` header (for development/testing)

**Response:**

```json
{
  "success": true,
  "data": {
    "tenant": {
      "id": "uuid",
      "slug": "ridgeline",
      "name": "Ridgeline Homes",
      "domain": "ridgelinehomes.com"
    },
    "branding": {
      "colors": {
        "primary": "#1e3a5f",
        "primaryLight": "#2d4a6f",
        "primaryDark": "#0f2a4f",
        "secondary": "#c9a227",
        "secondaryLight": "#d4b342",
        "secondaryDark": "#b8911c",
        "accent": "#4a90a4",
        "accentLight": "#5ba0b4",
        "accentDark": "#3a8094",
        "background": "#ffffff",
        "surface": "#f8f9fa",
        "textPrimary": "#1a1a1a",
        "textSecondary": "#6b7280",
        "headerBg": "#1e3a5f",
        "footerBg": "#1e3a5f"
      },
      "fonts": {
        "heading": "Playfair Display",
        "body": "Open Sans",
        "accent": null
      },
      "assets": {
        "logo": "https://cdn.example.com/tenants/ridgeline/logo.png",
        "logoDark": "https://cdn.example.com/tenants/ridgeline/logo-dark.png",
        "favicon": "https://cdn.example.com/tenants/ridgeline/favicon.ico"
      }
    },
    "template": {
      "homeTemplate": "modern",
      "hero": {
        "type": "video",
        "mediaUrl": "https://cdn.example.com/tenants/ridgeline/hero-video.mp4",
        "mediaUrls": null,
        "title": "Build Your Dream Home",
        "subtitle": "Discover exceptional new homes in Maryland's finest communities",
        "ctaText": "Explore Homes",
        "ctaLink": "/homes",
        "overlayOpacity": 0.4
      },
      "sections": {
        "order": ["featured-communities", "featured-homes", "about", "testimonials", "cta"],
        "featuredCommunities": { "visible": true },
        "featuredHomes": { "visible": true },
        "about": {
          "visible": true,
          "title": "About Ridgeline Homes",
          "description": "For over 20 years, we've been building quality homes...",
          "imageUrl": "https://cdn.example.com/tenants/ridgeline/about.jpg"
        },
        "testimonials": { "visible": true },
        "cta": {
          "visible": true,
          "title": "Ready to Find Your Dream Home?",
          "description": "Contact us today to schedule a tour",
          "buttonText": "Contact Us",
          "buttonLink": "/contact",
          "backgroundUrl": "https://cdn.example.com/tenants/ridgeline/cta-bg.jpg"
        }
      }
    },
    "contact": {
      "companyName": "Ridgeline Homes",
      "phone": "(301) 555-0123",
      "email": "info@ridgelinehomes.com",
      "address": {
        "line1": "123 Builder Way",
        "line2": "Suite 100",
        "city": "Bethesda",
        "state": "MD",
        "zip": "20814"
      },
      "businessHours": {
        "monday": { "open": "9:00 AM", "close": "5:00 PM" },
        "tuesday": { "open": "9:00 AM", "close": "5:00 PM" },
        "wednesday": { "open": "9:00 AM", "close": "5:00 PM" },
        "thursday": { "open": "9:00 AM", "close": "5:00 PM" },
        "friday": { "open": "9:00 AM", "close": "5:00 PM" },
        "saturday": { "open": "10:00 AM", "close": "3:00 PM" },
        "sunday": null
      }
    },
    "social": {
      "facebook": "https://facebook.com/ridgelinehomes",
      "instagram": "https://instagram.com/ridgelinehomes",
      "twitter": null,
      "linkedin": "https://linkedin.com/company/ridgelinehomes",
      "youtube": null,
      "pinterest": null,
      "tiktok": null
    }
  }
}
```

---

## 3. Admin Endpoints (Super-Admin Only)

### Update Tenant Branding

**Endpoint:** `PUT /api/admin/tenants/:tenantId/branding`

**Request Body:**
```json
{
  "colors": {
    "primary": "#1e3a5f",
    "primaryLight": "#2d4a6f",
    "primaryDark": "#0f2a4f",
    "secondary": "#c9a227",
    "secondaryLight": "#d4b342",
    "secondaryDark": "#b8911c",
    "accent": "#4a90a4",
    "accentLight": "#5ba0b4",
    "accentDark": "#3a8094",
    "background": "#ffffff",
    "surface": "#f8f9fa",
    "textPrimary": "#1a1a1a",
    "textSecondary": "#6b7280"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Open Sans"
  }
}
```

### Upload Tenant Assets

**Endpoint:** `POST /api/admin/tenants/:tenantId/assets`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `logo` - Logo file (PNG, SVG preferred)
- `logoDark` - Dark version of logo
- `favicon` - Favicon (ICO, PNG)

**Response:**
```json
{
  "success": true,
  "data": {
    "logo": "https://cdn.example.com/tenants/ridgeline/logo.png",
    "logoDark": "https://cdn.example.com/tenants/ridgeline/logo-dark.png",
    "favicon": "https://cdn.example.com/tenants/ridgeline/favicon.ico"
  }
}
```

### Update Tenant Template

**Endpoint:** `PUT /api/admin/tenants/:tenantId/template`

**Request Body:**
```json
{
  "homeTemplate": "luxury",
  "hero": {
    "type": "slider",
    "mediaUrls": [
      "https://cdn.example.com/tenants/ridgeline/hero-1.jpg",
      "https://cdn.example.com/tenants/ridgeline/hero-2.jpg",
      "https://cdn.example.com/tenants/ridgeline/hero-3.jpg"
    ],
    "title": "Luxury Living Awaits",
    "subtitle": "Discover our exclusive home collection",
    "ctaText": "View Collection",
    "ctaLink": "/homes",
    "overlayOpacity": 0.5
  },
  "sections": {
    "order": ["featured-homes", "featured-communities", "about", "cta"],
    "featuredCommunities": { "visible": true },
    "featuredHomes": { "visible": true },
    "about": { "visible": true },
    "testimonials": { "visible": false },
    "cta": { "visible": true }
  }
}
```

### Upload Hero Media

**Endpoint:** `POST /api/admin/tenants/:tenantId/hero-media`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `heroMedia` - Image or video file
- `heroImages[]` - Multiple images for slider

---

## 4. Template Types

The frontend will support these home page templates. Each template has a different layout and style:

| Template | Description | Best For |
|----------|-------------|----------|
| `modern` | Clean lines, bold typography, full-width hero, card-based sections | Contemporary builders |
| `traditional` | Classic layout, serif fonts, elegant feel | Established builders |
| `luxury` | Premium feel, large imagery, sophisticated typography | High-end homes |
| `minimal` | Simple, lots of whitespace, focused on content | Clean brand identity |
| `bold` | Strong colors, dynamic sections, attention-grabbing | Builders wanting standout presence |

---

## 5. Caching Strategy

### Recommended Caching

The tenant configuration should be cached to reduce database load:

1. **Application-level cache:** Cache the tenant config for 5-10 minutes
2. **CDN/Edge cache:** Add cache headers for static assets

**Cache Headers for `/api/public/tenant/config`:**
```
Cache-Control: public, max-age=300, stale-while-revalidate=60
```

### Cache Invalidation

When super-admin updates branding or template:
1. Invalidate the cache for that tenant
2. If using Redis/Memcached: Delete the key `tenant:config:{tenantId}`
3. If using CDN: Purge the URL pattern for that tenant

---

## 6. Tenant Resolution Logic

The backend should resolve the tenant in this order:

```
1. Check X-Tenant-Slug header (for development)
2. Extract subdomain from Host header
   - e.g., "ridgeline.app.com" → tenant slug = "ridgeline"
3. Look up custom domain in tenant_domains table
   - e.g., "www.ridgelinehomes.com" → tenant_id from mapping
4. Return 404 if no tenant found
```

### Tenant Domains Table

```sql
CREATE TABLE tenant_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL UNIQUE,
  is_primary BOOLEAN DEFAULT false,
  ssl_status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'active', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 7. Default Values

When creating a new tenant, create default branding and template records:

```sql
-- On tenant creation, create default branding
INSERT INTO tenant_branding (tenant_id) VALUES (:newTenantId);

-- On tenant creation, create default template
INSERT INTO tenant_template (tenant_id) VALUES (:newTenantId);

-- On tenant creation, create default contact
INSERT INTO tenant_contact (tenant_id, company_name)
VALUES (:newTenantId, :tenantName);

-- On tenant creation, create empty social links
INSERT INTO tenant_social_links (tenant_id) VALUES (:newTenantId);
```

---

## 8. Validation Rules

### Color Validation
- Must be valid hex color: `/^#[0-9A-Fa-f]{6}$/`

### Font Validation
- Must be from approved Google Fonts list or system fonts
- Suggested fonts to support:
  - Headings: Playfair Display, Merriweather, Lora, Cormorant, Libre Baskerville
  - Body: Open Sans, Roboto, Lato, Source Sans Pro, Nunito

### Media Validation
- Images: JPG, PNG, WebP (max 5MB)
- Videos: MP4, WebM (max 50MB)
- Logo: PNG, SVG (max 2MB)
- Favicon: ICO, PNG (max 500KB)

### URL Validation
- Hero media URLs must be valid URLs
- Social links must be valid URLs matching their platform

---

## 9. Migration/Seeding

For existing tenants, run a migration to create default records:

```sql
-- Backfill branding for existing tenants
INSERT INTO tenant_branding (tenant_id)
SELECT id FROM tenants t
WHERE NOT EXISTS (
  SELECT 1 FROM tenant_branding tb WHERE tb.tenant_id = t.id
);

-- Similar for template, contact, social_links
```

---

## 10. Frontend Integration Summary

The frontend will:

1. Call `GET /api/public/tenant/config` on app initialization
2. Apply colors as CSS custom properties (`:root { --color-primary: #xxx; }`)
3. Load Google Fonts dynamically based on `fonts.heading` and `fonts.body`
4. Render the appropriate home page template based on `template.homeTemplate`
5. Show/hide sections based on `template.sections.*.visible`
6. Order sections based on `template.sections.order`
7. Populate footer with `contact` and `social` data

---

## 11. Environment Variables

The frontend will use these environment variables per deployment:

```env
# Tenant identifier - determines which tenant config to load
NEXT_PUBLIC_TENANT_SLUG=ridgeline

# Backend API URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Optional: Override for development
NEXT_PUBLIC_TENANT_DOMAIN=localhost:3000
```

---

## Questions for Discussion

1. **Asset Storage:** Where will tenant assets (logos, hero images/videos) be stored? Recommended: S3/CloudFlare R2 with CDN
2. **Font Loading:** Should fonts be self-hosted or loaded from Google Fonts?
3. **Versioning:** Should we version the tenant config for rollback capability?
4. **Preview Mode:** Should there be a preview mode for super-admin to see changes before publishing?

---

## Implementation Priority

1. **Phase 1:** Tenant branding (colors, fonts, logo) - Core theming
2. **Phase 2:** Template configuration (hero, sections) - Home page customization
3. **Phase 3:** Contact and social links - Footer/header data
4. **Phase 4:** Custom domains support - Production deployments
