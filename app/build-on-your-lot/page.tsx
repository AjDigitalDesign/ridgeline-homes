import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Home, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchBOYLLocations, type BOYLLocation } from "@/lib/api";

export const metadata: Metadata = {
  title: "Build on Your Lot | Ridgeline Homes",
  description:
    "Build your dream home on your own land. Explore our build-on-your-lot program and available service areas.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Map state abbreviations to full names
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  MD: "Maryland",
  VA: "Virginia",
  DC: "District of Columbia",
  PA: "Pennsylvania",
  DE: "Delaware",
  WV: "West Virginia",
};

const getStateName = (abbr: string) => STATE_NAMES[abbr] || abbr;

// Group locations by state
function groupLocationsByState(
  locations: BOYLLocation[]
): { state: string; stateName: string; locations: BOYLLocation[] }[] {
  const grouped = locations.reduce(
    (acc, location) => {
      if (!acc[location.state]) {
        acc[location.state] = [];
      }
      acc[location.state].push(location);
      return acc;
    },
    {} as Record<string, BOYLLocation[]>
  );

  return Object.entries(grouped)
    .map(([state, locations]) => ({
      state,
      stateName: getStateName(state),
      locations: locations.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.stateName.localeCompare(b.stateName));
}

async function getBOYLLocations() {
  try {
    const response = await fetchBOYLLocations();
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}

interface LocationCardProps {
  location: BOYLLocation;
}

function LocationCard({ location }: LocationCardProps) {
  const stateName = getStateName(location.state);

  return (
    <Link
      href={`/build-on-your-lot/${location.state.toLowerCase()}/${location.slug}/lot-process`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {location.featuredImage ? (
          <Image
            src={location.featuredImage}
            alt={location.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Home className="size-12 text-gray-300" />
          </div>
        )}

        {/* Badge */}
        {location.floorplanCount > 0 && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-main-secondary text-main-primary text-sm font-medium rounded-full">
            {location.floorplanCount} Floor Plans
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-main-primary group-hover:text-main-primary/80 transition-colors mb-2">
          {location.name}
        </h3>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="size-4" />
          <span className="text-sm">
            {location.county}, {stateName}
          </span>
        </div>

        {location.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {location.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {location.radiusMiles > 0 && (
            <span className="text-sm text-gray-500">
              {location.radiusMiles} mile radius
            </span>
          )}
          <span className="flex items-center gap-1 text-main-primary font-medium text-sm group-hover:gap-2 transition-all">
            Learn More
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BuildOnYourLotPage() {
  const locations = await getBOYLLocations();
  const groupedLocations = groupLocationsByState(locations);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-main-primary pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 bg-main-secondary text-main-primary text-sm font-medium rounded-full mb-6">
              Build on Your Lot
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
              Your Land, Your Dream Home
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Already have the perfect piece of land? Let us help you build your
              dream home on your own property with our build-on-your-lot
              program.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-main-secondary text-main-primary hover:bg-main-secondary/90"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-main-primary"
              >
                <Link href="#locations">View Locations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-4">
              Why Build With Us?
            </h2>
            <p className="text-gray-600">
              We make building on your lot simple and stress-free with our
              proven process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Flexible Floor Plans",
                description:
                  "Choose from our collection of floor plans and customize to fit your lot and lifestyle.",
              },
              {
                title: "Expert Guidance",
                description:
                  "Our team helps you navigate permits, site prep, and construction every step of the way.",
              },
              {
                title: "Quality Construction",
                description:
                  "Built with the same quality and attention to detail as our community homes.",
              },
              {
                title: "Competitive Pricing",
                description:
                  "Transparent pricing with no hidden fees. Know what you're paying from day one.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center size-12 bg-main-secondary/20 rounded-full mb-4">
                  <CheckCircle2 className="size-6 text-main-primary" />
                </div>
                <h3 className="text-lg font-bold text-main-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-16 lg:py-24 scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-main-primary mb-4">
              Where We Build
            </h2>
            <p className="text-gray-600">
              Explore our build-on-your-lot service areas.
            </p>
            <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
          </div>

          {locations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="size-20 bg-main-secondary/20 rounded-full flex items-center justify-center">
                  <Home className="size-10 text-main-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-main-primary mb-4">
                Coming Soon
              </h3>
              <p className="text-gray-600 mb-8">
                We&apos;re preparing detailed information about our
                build-on-your-lot locations. Contact us to discuss how we can
                bring your vision to life on your property.
              </p>
              <Button
                asChild
                className="bg-main-primary hover:bg-main-primary/90"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {groupedLocations.map((group) => (
                <div key={group.state}>
                  <h3 className="text-2xl font-bold text-main-primary mb-6">
                    {group.stateName}
                  </h3>
                  <div
                    className={`grid gap-6 ${
                      group.locations.length === 1
                        ? "grid-cols-1 max-w-md"
                        : group.locations.length === 2
                          ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {group.locations.map((location) => (
                      <LocationCard key={location.id} location={location} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-main-primary">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about building on your lot. Our team
            is ready to help you bring your vision to life.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-main-secondary text-main-primary hover:bg-main-secondary/90"
          >
            <Link href="/contact">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
