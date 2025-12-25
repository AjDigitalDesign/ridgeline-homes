"use client";

import Link from "next/link";
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

function FooterLogo() {
  return (
    <Link href="/">
      <svg viewBox="0 0 200 60" className="w-44 h-auto">
        {/* Abstract ridge/rooflines */}
        <path
          d="M10 35 L25 15 L40 35"
          stroke="#D4AF37"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M20 35 L35 20 L50 35"
          stroke="#D4AF37"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <text
          x="60"
          y="26"
          fill="#FFFFFF"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="17"
          fontWeight="700"
          letterSpacing="1"
        >
          RIDGELINE
        </text>
        <text
          x="60"
          y="42"
          fill="#D4AF37"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="11"
          letterSpacing="4"
        >
          HOMES
        </text>
      </svg>
    </Link>
  );
}

const usefulLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Communities", href: "/communities" },
  { label: "Our Best Services", href: "/services" },
  { label: "Request Visit", href: "/contact" },
  { label: "FAQ", href: "/resources/faqs" },
];

const exploreLinks = [
  { label: "All Properties", href: "/homes" },
  { label: "Our Agents", href: "/team" },
  { label: "All Projects", href: "/communities" },
  { label: "Our Process", href: "/resources/our-process" },
  { label: "Neighborhood", href: "/communities" },
];

export function FooterClassic() {
  const [email, setEmail] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="bg-main-primary">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Left Column - Logo & Description */}
          <div className="lg:col-span-3">
            <FooterLogo />
            <p className="mt-6 text-sm text-white/70 leading-relaxed">
              Building quality homes with passion, dedication, and resources to
              help our clients reach their buying goals. Your dream home awaits.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
              >
                <Youtube className="size-4" />
              </a>
              <a
                href="#"
                className="size-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-main-secondary hover:border-main-secondary hover:text-main-primary transition-colors"
              >
                <Instagram className="size-4" />
              </a>
            </div>
          </div>

          {/* Get In Touch */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-6">
              Get In Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="size-5 text-white/50 shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">
                  789 Inner Lane, Holy park,
                  <br />
                  Maryland, USA
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="size-5 text-white/50 shrink-0 mt-0.5" />
                <div className="text-sm text-white/70">
                  <a
                    href="tel:+1234567890"
                    className="hover:text-main-secondary transition-colors"
                  >
                    +01 234 567 890
                  </a>
                  <br />
                  <a
                    href="tel:+09876543210"
                    className="hover:text-main-secondary transition-colors"
                  >
                    +09 876 543 210
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="size-5 text-white/50 shrink-0 mt-0.5" />
                <div className="text-sm text-white/70">
                  <a
                    href="mailto:info@ridgelinehomes.com"
                    className="hover:text-main-secondary transition-colors"
                  >
                    info@ridgelinehomes.com
                  </a>
                  <br />
                  <a
                    href="mailto:support@ridgelinehomes.com"
                    className="hover:text-main-secondary transition-colors"
                  >
                    support@ridgelinehomes.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Useful Link */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6">
              Useful Link
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
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
              Copyright © {new Date().getFullYear()} Ridgeline Homes. All rights
              reserved.
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
