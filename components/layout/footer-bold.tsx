"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
} from "lucide-react";
import MainLogo from "../main-logo";
import {
  useTenantContact,
  useTenantSocial,
} from "@/components/providers/tenant-provider";

// Bold template footer - distinct structure from classic
// TODO: Customize with actual bold template footer design
export function FooterBold() {
  const contact = useTenantContact();
  const social = useTenantSocial();

  // Bold template navigation - can differ from classic
  const quickLinks = [
    { label: "Communities", href: "/communities" },
    { label: "Available Homes", href: "/homes" },
    { label: "Floor Plans", href: "/plans" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact", href: "/contact" },
  ];

  const resourceLinks = [
    { label: "Our Process", href: "/our-process" },
    { label: "Financing", href: "/financing" },
    { label: "Design Center", href: "/design-center" },
    { label: "Warranty", href: "/warranty" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <footer className="bg-gray-900">
      {/* CTA Section */}
      <div className="bg-main-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-main-primary">
                Ready to Find Your Dream Home?
              </h3>
              <p className="text-main-primary/80 mt-1">
                Let us help you get started on your home buying journey.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-main-primary text-white font-semibold rounded-md hover:bg-main-primary/90 transition-colors"
            >
              Contact Us
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="w-48 mb-6">
              <MainLogo />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building quality homes with craftsmanship and attention to detail.
              Your trusted partner in finding the perfect home.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-main-secondary hover:text-main-primary transition-colors"
                >
                  <Facebook className="size-4" />
                </a>
              )}
              {social?.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-main-secondary hover:text-main-primary transition-colors"
                >
                  <Twitter className="size-4" />
                </a>
              )}
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-main-secondary hover:text-main-primary transition-colors"
                >
                  <Instagram className="size-4" />
                </a>
              )}
              {social?.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-main-secondary hover:text-main-primary transition-colors"
                >
                  <Linkedin className="size-4" />
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-main-secondary hover:text-main-primary transition-colors"
                >
                  <Youtube className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-main-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-main-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contact?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="size-5 text-main-secondary shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">
                    {contact.address.line1}
                    {contact.address.city && (
                      <>
                        <br />
                        {contact.address.city}, {contact.address.state}{" "}
                        {contact.address.zip}
                      </>
                    )}
                  </span>
                </li>
              )}
              {contact?.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="size-5 text-main-secondary shrink-0 mt-0.5" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-gray-400 hover:text-main-secondary transition-colors"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="size-5 text-main-secondary shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-gray-400 hover:text-main-secondary transition-colors"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} {contact?.companyName || "Ridgeline Homes"}. All
              rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/terms-of-service"
                className="hover:text-main-secondary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-main-secondary transition-colors"
              >
                Privacy
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
