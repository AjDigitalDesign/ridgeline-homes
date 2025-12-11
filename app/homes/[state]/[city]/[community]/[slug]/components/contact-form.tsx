"use client";

import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms";
import type { Home } from "@/lib/api";

interface HomeContactFormProps {
  home: Home;
  isModal: boolean;
  type: "tour" | "info";
  onClose: () => void;
}

export default function HomeContactForm({
  home,
  isModal,
  type,
  onClose,
}: HomeContactFormProps) {
  const homeName = home.address || home.street || home.name;

  // Modal version - use the reusable ContactForm directly
  if (isModal) {
    return (
      <ContactForm
        type={type}
        homeId={home.id}
        communityId={home.community?.id}
        entityName={homeName}
        isModal={true}
        onClose={onClose}
      />
    );
  }

  // Inline version (for contact section on home detail page)
  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
          Contact Us
        </h2>
        <p className="text-gray-600 mt-1">
          Interested in {homeName}? Get in touch with our team.
        </p>
        <div className="w-16 h-1 bg-main-secondary mt-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-main-primary mb-4">
            Send Us a Message
          </h3>
          <ContactForm
            type={type}
            homeId={home.id}
            communityId={home.community?.id}
            entityName={homeName}
          />
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-main-secondary rounded-xl p-6">
            <h3 className="font-semibold text-main-primary mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full bg-main-primary hover:bg-main-primary/90">
                <Calendar className="size-4 mr-2" />
                Schedule a Showing
              </Button>
            </div>
          </div>

          {/* Home Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-main-primary mb-4">
              Home Information
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Address</dt>
                <dd className="font-medium text-main-primary">{homeName}</dd>
              </div>
              {home.city && home.state && (
                <div>
                  <dt className="text-gray-500">Location</dt>
                  <dd className="font-medium text-main-primary">
                    {home.city}, {home.state}
                  </dd>
                </div>
              )}
              {home.community && (
                <div>
                  <dt className="text-gray-500">Community</dt>
                  <dd className="font-medium text-main-primary">
                    {home.community.name}
                  </dd>
                </div>
              )}
              {home.price && (
                <div>
                  <dt className="text-gray-500">Price</dt>
                  <dd className="font-medium text-main-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(home.price)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
