import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Warranty | Ridgeline Homes",
  description: "Learn about our comprehensive home warranty coverage and protection for your new home.",
};

export default function WarrantyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-32">
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-main-primary hover:text-main-primary/80 mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="size-20 bg-main-secondary/20 rounded-full flex items-center justify-center">
              <Shield className="size-10 text-main-primary" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-main-primary mb-4">
            Home Warranty
          </h1>
          <p className="text-xl text-gray-600">
            Your peace of mind is our priority. Every Ridgeline home comes with comprehensive warranty coverage.
          </p>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-main-primary mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600 mb-8">
            We&apos;re preparing detailed information about our warranty coverage. In the meantime, please contact us for any warranty-related questions.
          </p>
          <Button asChild className="bg-main-primary hover:bg-main-primary/90">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
