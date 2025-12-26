"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  ArrowUp,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTenant,
  useTenantContact,
  useTenantSocial,
  useTenantAssets,
} from "@/components/providers/tenant-provider";
import {
  aboutUsDropdownItems,
  newsEventsDropdownItems,
} from "@/lib/constants/navigation";

// Navigation links derived from header navigation
const quickLinks = [
  { label: "Find Your Home", href: "/homes" },
  { label: "Communities", href: "/communities" },
  { label: "Build on Your Lot", href: "/build-on-your-lot" },
  { label: "Contact", href: "/contact" },
];

// Combine about us and news/events for explore section
const exploreLinks = [
  ...aboutUsDropdownItems.map((item) => ({ label: item.label, href: item.href })),
  ...newsEventsDropdownItems.map((item) => ({ label: item.label, href: item.href })),
];

export function FooterClassic() {
  const [email, setEmail] = useState("");
  const { tenant } = useTenant();
  const contact = useTenantContact();
  const social = useTenantSocial();
  const assets = useTenantAssets();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  // Build full address string
  const fullAddress = contact
    ? [
        contact.address.line1,
        contact.address.city,
        contact.address.state,
        contact.address.zip,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <footer className="bg-main-primary">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Left Column - Logo & Description */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block">
              {assets?.logo ? (
                <Image
                  src={assets.logo}
                  alt={contact?.companyName || "Logo"}
                  width={176}
                  height={60}
                  className="h-14 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {contact?.companyName || "Home Builder"}
                </span>
              )}
            </Link>
            <p className="mt-6 text-sm text-white/70 leading-relaxed">
              Building quality homes with passion, dedication, and resources to
              help our clients reach their buying goals. Your dream home awaits.
            </p>

            {/* Social Icons - Only show if social links exist */}
            <div className="flex items-center gap-3 mt-6">
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
                >
                  <Facebook className="size-4" />
                </a>
              )}
              {social?.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
                >
                  <Twitter className="size-4" />
                </a>
              )}
              {social?.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
                >
                  <Linkedin className="size-4" />
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
                >
                  <Youtube className="size-4" />
                </a>
              )}
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
                >
                  <Instagram className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* Get In Touch */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-6">
              Get In Touch
            </h3>
            <ul className="space-y-4">
              {fullAddress && (
                <li className="flex items-start gap-3">
                  <MapPin className="size-5 text-white/50 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/70">{fullAddress}</span>
                </li>
              )}
              {contact?.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="size-5 text-white/50 shrink-0 mt-0.5" />
                  <div className="text-sm text-white/70">
                    <a
                      href={`tel:${contact.phone}`}
                      className="hover:text-main-secondary transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="size-5 text-white/50 shrink-0 mt-0.5" />
                  <div className="text-sm text-white/70">
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-main-secondary transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-main-secondary transition-colors group"
                  >
                    <ChevronRight className="size-4 text-white/40 group-hover:text-main-secondary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-main-secondary transition-colors group"
                  >
                    <ChevronRight className="size-4 text-white/40 group-hover:text-main-secondary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to Top */}
          <div className="lg:col-span-2 flex lg:justify-end">
            <button
              onClick={scrollToTop}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-main-secondary transition-colors group"
            >
              <span className="text-lg font-semibold text-white group-hover:text-main-secondary">
                Top
              </span>
              <div className="size-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-main-secondary transition-colors">
                <ArrowUp className="size-5" />
              </div>
            </button>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-10 border-t border-white/10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="lg:max-w-md">
              <h3 className="text-2xl lg:text-3xl font-bold text-white">
                Newsletter To Get Updated
                <br />
                The Latest News
              </h3>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-0 max-w-md w-full"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Mail"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-md text-white placeholder:text-white/50 focus:outline-none focus:border-main-secondary"
              />
              <Button
                type="submit"
                className="rounded-l-none rounded-r-md bg-main-secondary text-main-primary hover:bg-main-secondary/90 px-6 py-3 h-auto"
              >
                Subscribe Now
                <Send className="size-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>
              Copyright © {new Date().getFullYear()}{" "}
              {contact?.companyName || "Home Builder"}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/terms-of-service"
                className="hover:text-main-secondary transition-colors"
              >
                Terms of service
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-main-secondary transition-colors"
              >
                Privacy policy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-main-secondary transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
