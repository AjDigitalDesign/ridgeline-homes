"use client";

import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms";
import type { Tenant } from "@/lib/api";

interface ContactPageClientProps {
  tenant: Tenant | null;
}

export default function ContactPageClient({ tenant }: ContactPageClientProps) {
  const searchParams = useSearchParams();
  const showChat = searchParams.get("chat") === "true";

  return (
    <div className="min-h-screen bg-gray-50 pt-16 xl:pt-20">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[350px] bg-main-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-main-primary to-main-primary/80" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl">
            Have questions about our homes or communities? We&apos;re here to
            help you find your perfect home.
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
            <ContactForm type="general" />
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
                    <div className="w-12 h-12 bg-main-primary/10 rounded-lg flex items-center justify-center shrink-0">
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
                    <div className="w-12 h-12 bg-main-primary/10 rounded-lg flex items-center justify-center shrink-0">
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
                    <div className="w-12 h-12 bg-main-primary/10 rounded-lg flex items-center justify-center shrink-0">
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
                  <div className="w-12 h-12 bg-main-primary/10 rounded-lg flex items-center justify-center shrink-0">
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
                    <p className="text-sm text-gray-600">
                      Chat with our team now
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Our team is online and ready to help. Start a conversation and
                  get answers to your questions in real-time.
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
