"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, Clock, Send, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitInquiry, type Tenant } from "@/lib/api";

interface ContactPageClientProps {
  tenant: Tenant | null;
}

export default function ContactPageClient({ tenant }: ContactPageClientProps) {
  const searchParams = useSearchParams();
  const showChat = searchParams.get("chat") === "true";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
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
        type: "GENERAL",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[350px] bg-main-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-main-primary to-main-primary/80" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl">
            Have questions about our homes or communities? We're here to help you find your perfect home.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="size-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      message: "",
                    });
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-main-primary hover:bg-main-primary/90 py-3"
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

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                {tenant?.builderAddress && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-main-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="size-6 text-main-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Office Address
                      </h3>
                      <p className="text-gray-600">
                        {tenant.builderAddress}
                        {tenant.builderCity && <>, {tenant.builderCity}</>}
                        {tenant.builderState && <>, {tenant.builderState}</>}
                        {tenant.builderZip && <> {tenant.builderZip}</>}
                      </p>
                    </div>
                  </div>
                )}

                {tenant?.builderPhone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-main-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="size-6 text-main-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <a
                        href={`tel:${tenant.builderPhone}`}
                        className="text-main-primary hover:underline"
                      >
                        {tenant.builderPhone}
                      </a>
                    </div>
                  </div>
                )}

                {tenant?.builderEmail && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-main-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="size-6 text-main-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a
                        href={`mailto:${tenant.builderEmail}`}
                        className="text-main-primary hover:underline"
                      >
                        {tenant.builderEmail}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-main-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="size-6 text-main-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Office Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 5:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: By Appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat Card */}
            {showChat && (
              <div className="bg-main-secondary rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-main-primary rounded-lg flex items-center justify-center">
                    <MessageCircle className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Live Chat</h3>
                    <p className="text-sm text-gray-600">Chat with our team now</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Our team is online and ready to help. Start a conversation and get answers to your questions in real-time.
                </p>
                <Button className="w-full bg-main-primary hover:bg-main-primary/90">
                  Start Chat
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
