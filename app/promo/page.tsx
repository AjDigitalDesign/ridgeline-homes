import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Tag, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTenant } from "@/lib/api";

export const metadata: Metadata = {
  title: "Current Promotions | Ridgeline Homes",
  description: "Explore current promotions and special offers from Ridgeline Homes. Limited-time incentives on new homes.",
};

export default async function PromoPage() {
  const tenantRes = await fetchTenant().catch(() => ({ data: null }));
  const tenant = tenantRes.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[350px] lg:h-[400px] bg-main-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-main-primary via-main-primary/90 to-main-primary/70" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="size-8 text-main-secondary" />
            <span className="text-main-secondary font-semibold uppercase tracking-wider">
              Special Offers
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
            Current Promotions
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl">
            Take advantage of our limited-time offers and incentives. Make your dream home more affordable.
          </p>
        </div>
      </section>

      {/* Featured Promo */}
      {tenant?.promoBannerEnabled && tenant?.promoBannerDescription && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-main-secondary rounded-2xl p-8 lg:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-main-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="size-6 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-main-primary uppercase tracking-wider">
                    Featured Offer
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Current Promotion
                  </h2>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                {tenant.promoBannerDescription}
              </p>
              {tenant.promoBannerLink && (
                <Link href={tenant.promoBannerLink}>
                  <Button className="bg-main-primary hover:bg-main-primary/90">
                    Learn More
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* General Incentives */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Available Incentives
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a variety of incentives to help make your new home purchase easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Closing Cost Assistance",
                description: "We may be able to help with closing costs when you use our preferred lender.",
                terms: "Subject to lender approval and property eligibility.",
              },
              {
                title: "Design Center Credit",
                description: "Receive a credit toward upgrades and personalization in our Design Center.",
                terms: "Credit amount varies by community and home price.",
              },
              {
                title: "Rate Buydown Options",
                description: "Ask about our rate buydown programs to lower your monthly payment.",
                terms: "Programs vary by lender and are subject to qualification.",
              },
            ].map((incentive, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {incentive.title}
                </h3>
                <p className="text-gray-600 mb-4">{incentive.description}</p>
                <p className="text-sm text-gray-500 italic">{incentive.terms}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Qualify */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How to Take Advantage
              </h2>
              <p className="text-lg text-gray-600">
                Follow these simple steps to access our current promotions.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Contact Our Team",
                  description: "Reach out to our sales team to learn about current offers in your preferred community.",
                },
                {
                  step: 2,
                  title: "Get Pre-Approved",
                  description: "Work with our preferred lender to understand your financing options and eligibility.",
                },
                {
                  step: 3,
                  title: "Select Your Home",
                  description: "Choose your home and floor plan. Our team will help you apply available incentives.",
                },
                {
                  step: 4,
                  title: "Close & Move In",
                  description: "Complete your purchase with your incentives applied and start enjoying your new home.",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-main-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-main-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Don't Miss Out
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Promotions are limited and subject to change. Contact us today to learn about current offers in your desired community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-main-secondary text-main-primary hover:bg-main-secondary/90 px-8 py-3">
                Contact Us
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
            <Link href="/communities">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                Browse Communities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-500 text-center max-w-4xl mx-auto">
            *All promotions and incentives are subject to change without notice. Offers may vary by community and are subject to availability. See a sales representative for complete details and eligibility requirements. Cannot be combined with other offers unless specifically stated. Ridgeline Homes reserves the right to modify or discontinue promotions at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
