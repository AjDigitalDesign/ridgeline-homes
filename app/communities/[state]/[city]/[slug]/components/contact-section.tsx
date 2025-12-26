"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitInquiry, type Community } from "@/lib/api";

interface SalesTeamMember {
  isPrimary: boolean;
  displayOrder: number;
  salesTeam: {
    id: string;
    name: string;
    title: string | null;
    email: string | null;
    phone: string | null;
    photo: string | null;
  };
}

interface ContactSectionProps {
  community: Community;
  salesTeams?: SalesTeamMember[];
  backgroundImage?: string;
}

export default function ContactSection({
  community,
  salesTeams,
  backgroundImage,
}: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiveTexts, setReceiveTexts] = useState(true);

  // Sort sales team by isPrimary then displayOrder
  const sortedTeam = salesTeams
    ? [...salesTeams].sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
        return a.displayOrder - b.displayOrder;
      })
    : [];

  // Get primary contact phone
  const primaryPhone =
    sortedTeam.find((m) => m.isPrimary)?.salesTeam.phone ||
    sortedTeam[0]?.salesTeam.phone ||
    community.phoneNumber;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const priceMin = formData.get("priceMin") as string;
    const priceMax = formData.get("priceMax") as string;
    const moveDate = formData.get("moveDate") as string;
    const appointmentDate = formData.get("appointmentDate") as string;
    const message = formData.get("message") as string;

    // Build a comprehensive message with all the form details
    const messageParts: string[] = [];
    if (priceMin || priceMax) {
      const priceRange = [
        priceMin ? `$${parseInt(priceMin).toLocaleString()}` : "",
        priceMax ? `$${parseInt(priceMax).toLocaleString()}` : "",
      ].filter(Boolean).join(" - ");
      if (priceRange) messageParts.push(`Price Range: ${priceRange}`);
    }
    if (moveDate) messageParts.push(`Move Timeline: ${moveDate}`);
    if (appointmentDate) messageParts.push(`Preferred Appointment: ${appointmentDate}`);
    if (receiveTexts) messageParts.push("Opt-in for text messages: Yes");
    if (message) messageParts.push(`\nComments: ${message}`);

    const fullMessage = messageParts.join("\n");

    try {
      await submitInquiry({
        type: "INQUIRY",
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        message: fullMessage || undefined,
        communityId: community.id,
      });

      setIsSubmitted(true);
      toast.success("Request submitted successfully!", {
        description: `Our team at ${community.name} will contact you shortly.`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your request", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Sales Team with Background Image */}
        <div className="relative lg:w-1/2 min-h-[500px] lg:min-h-[700px]">
          {/* Background Image */}
          {backgroundImage ? (
            <Image
              src={backgroundImage}
              alt={community.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-main-primary" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-main-primary/80" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
            {/* Sales Team Photos */}
            {sortedTeam.length > 0 && (
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                {sortedTeam.slice(0, 3).map((member, index) => (
                  <div
                    key={member.salesTeam.id}
                    className="relative"
                    style={{ zIndex: 3 - index }}
                  >
                    <div className="relative size-20 lg:size-24 rounded-full overflow-hidden border-4 border-white/20 bg-gray-200">
                      {member.salesTeam.photo ? (
                        <Image
                          src={member.salesTeam.photo}
                          alt={member.salesTeam.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-100">
                          {member.salesTeam.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <p className="text-white text-center text-sm mt-2 font-medium">
                      {member.salesTeam.name.split(" ")[0]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Heading */}
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white uppercase tracking-wide text-center lg:text-left">
              Have Questions?
            </h2>
            <p className="text-xl lg:text-2xl text-white uppercase tracking-wide mt-2 text-center lg:text-left">
              Ask Our New Home Consultants!
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-main-secondary my-6" />

            {/* Description */}
            <p className="text-white/90 text-lg text-center lg:text-left">
              Contact our New Home Consultants today to answer your questions or
              schedule your in-person or virtual appointment.
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-main-secondary my-6" />

            {/* Phone */}
            {primaryPhone && (
              <a
                href={`tel:${primaryPhone}`}
                className="flex items-center gap-3 text-main-secondary hover:text-white transition-colors justify-center lg:justify-start"
              >
                <Phone className="size-6" />
                <span className="text-2xl lg:text-3xl font-bold">
                  {primaryPhone}
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-12 xl:p-16">
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-1 h-16 bg-main-primary" />
              <div>
                <p className="text-sm font-semibold text-main-primary uppercase tracking-wide">
                  Want to Schedule a Tour? Need More Information?
                </p>
                <h3 className="text-3xl lg:text-4xl font-bold text-main-primary uppercase tracking-wide">
                  We&apos;re Here to Help!
                </h3>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="size-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-main-primary mb-2">
                Thank You!
              </h4>
              <p className="text-gray-600">
                We&apos;ve received your request and will be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder="First Name*"
                  required
                  className="h-12 border-gray-300"
                />
                <Input
                  name="lastName"
                  placeholder="Last Name*"
                  required
                  className="h-12 border-gray-300"
                />
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email*"
                  required
                  className="h-12 border-gray-300"
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  className="h-12 border-gray-300"
                />
              </div>

              {/* SMS Opt-in */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="receiveTexts"
                  checked={receiveTexts}
                  onCheckedChange={(checked) =>
                    setReceiveTexts(checked as boolean)
                  }
                />
                <label
                  htmlFor="receiveTexts"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Yes, I want to receive text messages.
                </label>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select name="priceMin">
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder="Price Minimum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="200000">$200,000</SelectItem>
                    <SelectItem value="300000">$300,000</SelectItem>
                    <SelectItem value="400000">$400,000</SelectItem>
                    <SelectItem value="500000">$500,000</SelectItem>
                    <SelectItem value="600000">$600,000</SelectItem>
                    <SelectItem value="700000">$700,000</SelectItem>
                    <SelectItem value="800000">$800,000+</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="priceMax">
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder="Price Maximum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300000">$300,000</SelectItem>
                    <SelectItem value="400000">$400,000</SelectItem>
                    <SelectItem value="500000">$500,000</SelectItem>
                    <SelectItem value="600000">$600,000</SelectItem>
                    <SelectItem value="700000">$700,000</SelectItem>
                    <SelectItem value="800000">$800,000</SelectItem>
                    <SelectItem value="1000000">$1,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select name="moveDate">
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder="When would you like to move?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="1-3months">1-3 Months</SelectItem>
                    <SelectItem value="3-6months">3-6 Months</SelectItem>
                    <SelectItem value="6-12months">6-12 Months</SelectItem>
                    <SelectItem value="12+months">12+ Months</SelectItem>
                    <SelectItem value="justlooking">Just Looking</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  name="appointmentDate"
                  type="date"
                  placeholder="Preferred Appointment Date"
                  className="h-12 border-gray-300"
                />
              </div>

              {/* Message */}
              <Textarea
                name="message"
                placeholder="Questions Or Comments"
                rows={4}
                className="border-gray-300 resize-none"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 h-12 bg-main-primary hover:bg-main-primary/90 text-white font-semibold uppercase tracking-wide"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>

              {/* reCAPTCHA Notice */}
              <p className="text-xs text-gray-500 text-center">
                This site is protected by reCAPTCHA and the Google{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="underline">
                  Terms of Service
                </Link>{" "}
                apply.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
