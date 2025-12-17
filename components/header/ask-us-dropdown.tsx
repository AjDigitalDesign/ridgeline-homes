"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Send, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { submitInquiry } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function AskUsDropdown() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitInquiry({
        type: "GENERAL",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message || undefined,
      });

      setIsSubmitted(true);
      toast.success("Message sent successfully!", {
        description: "Our team will contact you shortly.",
      });

      // Reset after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
        setOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 h-full px-6 transition-colors",
            "bg-main-secondary hover:bg-main-secondary/90",
            open && "bg-main-secondary/90"
          )}
        >
          <div className="relative size-10 rounded-full overflow-hidden border-2 border-white">
            <Image
              src="/sales-person.png"
              alt="Sales representative"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white uppercase tracking-wide">
              Have Questions?
            </p>
            <p className="text-sm font-bold text-white uppercase tracking-wide">
              Ask Us!
            </p>
          </div>
          <ChevronDown
            className={cn(
              "size-5 text-white transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[360px] p-0 shadow-xl border-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="bg-main-primary px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative size-10 rounded-full overflow-hidden border-2 border-main-secondary">
                <Image
                  src="/sales-person.png"
                  alt="Sales representative"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Quick Question?
                </p>
                <p className="text-xs text-white/70">
                  We&apos;re here to help!
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Form or Success State */}
        <div className="p-4 bg-white rounded-b-lg">
          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="size-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="size-6 text-green-600" />
              </div>
              <p className="font-semibold text-main-primary mb-1">
                Message Sent!
              </p>
              <p className="text-sm text-gray-500">
                We&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name*"
                  required
                  className="h-10"
                />
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name*"
                  required
                  className="h-10"
                />
              </div>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email*"
                required
                className="h-10"
              />
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="h-10"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="How can we help?"
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-main-primary/20 focus:border-main-primary resize-none"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-main-primary hover:bg-main-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
