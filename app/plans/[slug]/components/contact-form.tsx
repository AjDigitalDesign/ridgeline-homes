"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms";
import type { Floorplan } from "@/lib/api";

interface FloorplanContactFormProps {
  floorplan: Floorplan;
  isModal: boolean;
  type: "tour" | "info";
  onClose: () => void;
}

export default function FloorplanContactForm({
  floorplan,
  isModal,
  type,
  onClose,
}: FloorplanContactFormProps) {
  // Get first community for context
  const firstCommunity = floorplan.communityFloorplans?.[0]?.community;

  // Modal version - use the reusable ContactForm directly
  if (isModal) {
    return (
      <ContactForm
        type={type}
        floorplanId={floorplan.id}
        communityId={firstCommunity?.id}
        entityName={floorplan.name}
        isModal={true}
        onClose={onClose}
      />
    );
  }

  // Inline version (for contact section on floorplan detail page)
  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
          Contact Us
        </h2>
        <p className="text-gray-600 mt-1">
          Interested in the {floorplan.name}? Get in touch with our team.
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
            floorplanId={floorplan.id}
            communityId={firstCommunity?.id}
            entityName={floorplan.name}
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
            </div>
          </div>

          {/* Floorplan Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-main-primary mb-4">
              Floor Plan Information
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Floor Plan</dt>
                <dd className="font-medium text-main-primary">{floorplan.name}</dd>
              </div>
              {floorplan.modelNumber && (
                <div>
                  <dt className="text-gray-500">Model Number</dt>
                  <dd className="font-medium text-main-primary">
                    {floorplan.modelNumber}
                  </dd>
                </div>
              )}
              {floorplan.baseSquareFeet && (
                <div>
                  <dt className="text-gray-500">Square Feet</dt>
                  <dd className="font-medium text-main-primary">
                    {floorplan.baseSquareFeet.toLocaleString()} sq ft
                  </dd>
                </div>
              )}
              {floorplan.basePrice && (
                <div>
                  <dt className="text-gray-500">Starting Price</dt>
                  <dd className="font-medium text-main-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(floorplan.basePrice)}
                  </dd>
                </div>
              )}
              {floorplan.communityFloorplans.length > 0 && (
                <div>
                  <dt className="text-gray-500">Available In</dt>
                  <dd className="font-medium text-main-primary">
                    {floorplan.communityFloorplans.length} {floorplan.communityFloorplans.length === 1 ? "Community" : "Communities"}
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
