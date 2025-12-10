"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  X,
  Send,
  Loader2,
  Calendar,
  MessageSquare,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitInquiry } from "@/lib/api";

// Zod schema for contact form validation
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  preferredDate: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Props for the reusable contact form
export interface ContactFormProps {
  /** Type of inquiry - determines which fields are shown */
  type: "tour" | "info" | "general";
  /** Community ID for community-specific inquiries */
  communityId?: string;
  /** Home ID for home-specific inquiries */
  homeId?: string;
  /** Floorplan ID for floorplan-specific inquiries */
  floorplanId?: string;
  /** Display name for the entity (community, home, or floorplan name) */
  entityName?: string;
  /** Whether to show as a modal */
  isModal?: boolean;
  /** Callback when modal should close */
  onClose?: () => void;
  /** Callback after successful submission */
  onSuccess?: () => void;
  /** Custom class name for the form container */
  className?: string;
}

export function ContactForm({
  type,
  communityId,
  homeId,
  floorplanId,
  entityName,
  isModal = false,
  onClose,
  onSuccess,
  className,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      preferredDate: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Determine inquiry type for API
      const inquiryType =
        type === "tour" ? "TOUR" : type === "info" ? "INQUIRY" : "GENERAL";

      // Build message with preferred date if tour
      const message =
        type === "tour" && data.preferredDate
          ? `Preferred tour date: ${data.preferredDate}\n\n${data.message || ""}`
          : data.message;

      await submitInquiry({
        type: inquiryType,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        message: message || undefined,
        communityId,
        homeId,
        floorplanId,
      });

      setSubmitted(true);
      toast.success(
        type === "tour"
          ? "Tour request sent successfully!"
          : "Message sent successfully!",
        {
          description: entityName
            ? `Our team at ${entityName} will contact you shortly.`
            : "Our team will contact you shortly.",
        }
      );
      onSuccess?.();
    } catch {
      toast.error("Failed to send your request", {
        description: "Please try again or contact us directly.",
      });
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    reset();
  };

  // Success state
  if (submitted) {
    return (
      <div className={`text-center py-8 ${className || ""}`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="size-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {type === "tour" ? "Tour Request Sent!" : "Message Sent!"}
        </h3>
        <p className="text-gray-600 mb-6">
          {entityName
            ? `Thank you for your interest in ${entityName}. Our team will contact you shortly.`
            : "Thank you for reaching out. Our team will contact you shortly."}
        </p>
        <Button onClick={resetForm} variant="outline">
          Send Another Message
        </Button>
      </div>
    );
  }

  // Form content
  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            First Name *
          </label>
          <Input
            {...register("firstName")}
            placeholder="John"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Last Name *
          </label>
          <Input
            {...register("lastName")}
            placeholder="Doe"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email *
        </label>
        <Input
          type="email"
          {...register("email")}
          placeholder="john@example.com"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone
        </label>
        <Input
          type="tel"
          {...register("phone")}
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Preferred Date (Tour only) */}
      {type === "tour" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Preferred Tour Date
          </label>
          <Input
            type="date"
            {...register("preferredDate")}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Message {type === "info" || type === "general" ? "*" : ""}
        </label>
        <textarea
          {...register("message", {
            required:
              type === "info" || type === "general"
                ? "Message is required"
                : false,
          })}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none resize-none"
          placeholder={
            type === "tour"
              ? "Any questions or special requests for your tour?"
              : "How can we help you?"
          }
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
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
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

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
                {entityName && (
                  <p className="text-sm text-gray-500">{entityName}</p>
                )}
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

  // Inline version
  return <div className={className}>{formContent}</div>;
}

// Export schema for reuse in other forms
export { contactFormSchema };
