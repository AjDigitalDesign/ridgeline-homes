"use client";

import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms";
import type { Community } from "@/lib/api";

interface CommunityContactFormProps {
  community: Community;
  isModal: boolean;
  type: "tour" | "info";
  onClose: () => void;
}

export default function CommunityContactForm({
  community,
  isModal,
  type,
  onClose,
}: CommunityContactFormProps) {
  // Modal version - use the reusable ContactForm directly
  if (isModal) {
    return (
      <ContactForm
        type={type}
        communityId={community.id}
        entityName={community.name}
        isModal={true}
        onClose={onClose}
      />
    );
  }

  // Inline version (for contact section on community detail page)
  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
          Contact Us
        </h2>
        <p className="text-gray-600 mt-1">
          Interested in {community.name}? Get in touch with our team.
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
            communityId={community.id}
            entityName={community.name}
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
                Schedule a Tour
              </Button>
              {community.phoneNumber && (
                <Button asChild variant="outline" className="w-full bg-white">
                  <a href={`tel:${community.phoneNumber}`}>
                    <Phone className="size-4 mr-2" />
                    Call {community.phoneNumber}
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Community Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-main-primary mb-4">
              Community Information
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Community</dt>
                <dd className="font-medium text-main-primary">
                  {community.name}
                </dd>
              </div>
              {community.city && community.state && (
                <div>
                  <dt className="text-gray-500">Location</dt>
                  <dd className="font-medium text-main-primary">
                    {community.city}, {community.state}
                  </dd>
                </div>
              )}
              {community.priceMin && (
                <div>
                  <dt className="text-gray-500">Starting Price</dt>
                  <dd className="font-medium text-main-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(community.priceMin)}
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
