"use client";

import { useState } from "react";
import { X, Send, Loader2, Calendar, MessageSquare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitInquiry, type Community } from "@/lib/api";

interface ContactFormProps {
  community: Community;
  isModal: boolean;
  type: "tour" | "info";
  onClose: () => void;
}

export default function ContactForm({
  community,
  isModal,
  type,
  onClose,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitInquiry({
        type: type === "tour" ? "TOUR" : "INQUIRY",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message:
          type === "tour" && formData.preferredDate
            ? `Preferred tour date: ${formData.preferredDate}\n\n${formData.message}`
            : formData.message,
        communityId: community.id,
      });
      setSubmitted(true);
    } catch {
      setError("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      preferredDate: "",
    });
    setError(null);
  };

  const formContent = submitted ? (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="size-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {type === "tour" ? "Tour Request Sent!" : "Message Sent!"}
      </h3>
      <p className="text-gray-600 mb-6">
        Thank you for your interest in {community.name}. Our team will contact
        you shortly.
      </p>
      <Button onClick={resetForm} variant="outline">
        Send Another Message
      </Button>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            First Name *
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Last Name *
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email *
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
          placeholder="(555) 123-4567"
        />
      </div>

      {type === "tour" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Preferred Tour Date
          </label>
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) =>
              setFormData({ ...formData, preferredDate: e.target.value })
            }
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Message {type === "info" && "*"}
        </label>
        <textarea
          required={type === "info"}
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none resize-none"
          placeholder={
            type === "tour"
              ? "Any questions or special requests for your tour?"
              : "How can we help you?"
          }
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-main-primary hover:bg-main-primary/90 py-2.5"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4 mr-2" />
            {type === "tour" ? "Request Tour" : "Send Message"}
          </>
        )}
      </Button>
    </form>
  );

  // Modal version
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {type === "tour" ? (
                <Calendar className="size-6 text-main-primary" />
              ) : (
                <MessageSquare className="size-6 text-main-primary" />
              )}
              <div>
                <h2 className="text-lg font-semibold text-main-primary">
                  {type === "tour" ? "Schedule a Tour" : "Request Information"}
                </h2>
                <p className="text-sm text-gray-500">{community.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="size-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">{formContent}</div>
        </div>
      </div>
    );
  }

  // Inline version (for contact section)
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
          {formContent}
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-main-secondary rounded-xl p-6">
            <h3 className="font-semibold text-main-primary mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  resetForm();
                  setFormData((prev) => ({ ...prev }));
                }}
                className="w-full bg-main-primary hover:bg-main-primary/90"
              >
                <Calendar className="size-4 mr-2" />
                Schedule a Tour
              </Button>
              {community.phoneNumber && (
                <Button asChild variant="outline" className="w-full bg-white">
                  <a href={`tel:${community.phoneNumber}`}>
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
                <dd className="font-medium text-main-primary">{community.name}</dd>
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
