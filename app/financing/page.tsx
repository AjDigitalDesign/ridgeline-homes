import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financing | Ridgeline Homes",
  description: "Explore financing options for your new home with Ridgeline Homes.",
};

export default function FinancingPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16 xl:pt-20">
      {/* Hero Section */}
      <section className="bg-main-primary py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <h1 className="text-3xl lg:text-5xl font-bold text-white">
            Financing Options
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            We offer a variety of financing options to help make your dream home a reality.
          </p>
          <div className="mt-6 w-16 h-1 bg-main-secondary" />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
              Coming Soon
            </h2>
            <p className="mt-4 text-gray-600">
              We&apos;re working on bringing you comprehensive financing information.
              Please check back soon or contact us for more details about financing your new home.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
