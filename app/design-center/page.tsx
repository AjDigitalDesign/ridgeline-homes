import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Palette, Lightbulb, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Design Center | Ridgeline Homes",
  description: "Visit the Ridgeline Homes Design Center to personalize your new home with premium finishes, fixtures, and design options.",
};

const features = [
  {
    icon: Palette,
    title: "Premium Selections",
    description: "Choose from hundreds of premium finishes, flooring, countertops, cabinetry, and fixtures.",
  },
  {
    icon: Lightbulb,
    title: "Expert Guidance",
    description: "Our design consultants will guide you through every selection to create your dream home.",
  },
  {
    icon: Users,
    title: "Personal Appointment",
    description: "Schedule a private appointment to explore options at your own pace.",
  },
];

const designCategories = [
  {
    title: "Flooring",
    description: "Hardwood, tile, carpet, and luxury vinyl options",
    image: "/placeholder-flooring.jpg",
  },
  {
    title: "Countertops",
    description: "Granite, quartz, marble, and solid surface selections",
    image: "/placeholder-countertops.jpg",
  },
  {
    title: "Cabinetry",
    description: "Custom cabinet styles, colors, and hardware",
    image: "/placeholder-cabinetry.jpg",
  },
  {
    title: "Lighting & Fixtures",
    description: "Modern and traditional lighting packages",
    image: "/placeholder-lighting.jpg",
  },
  {
    title: "Appliances",
    description: "Premium kitchen appliance packages",
    image: "/placeholder-appliances.jpg",
  },
  {
    title: "Exterior Options",
    description: "Siding, stone, brick, and landscaping choices",
    image: "/placeholder-exterior.jpg",
  },
];

export default function DesignCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] lg:h-[500px] bg-main-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-main-primary via-main-primary/90 to-main-primary/70" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
            Design Center
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl mb-8">
            Make your new home uniquely yours. Visit our Design Center to explore premium finishes and personalize every detail.
          </p>
          <Link href="/contact">
            <Button className="bg-main-secondary text-main-primary hover:bg-main-secondary/90 px-8 py-3">
              Schedule a Visit
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-main-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="size-8 text-main-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explore Your Options
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From flooring to fixtures, discover the wide range of selections available to personalize your new home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designCategories.map((category, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-main-primary/20 group-hover:bg-main-primary/30 transition-colors" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Design Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes personalizing your home easy and enjoyable.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Schedule Your Appointment",
                  description: "Contact us to book a private design consultation at our Design Center.",
                },
                {
                  step: 2,
                  title: "Meet Your Design Consultant",
                  description: "Work one-on-one with an expert who will guide you through all available options.",
                },
                {
                  step: 3,
                  title: "Explore & Select",
                  description: "Browse our extensive selection of finishes, fixtures, and upgrades.",
                },
                {
                  step: 4,
                  title: "Finalize Your Choices",
                  description: "Review your selections and receive a detailed summary of your personalized home.",
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
            Ready to Start Designing?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Schedule your Design Center appointment today and take the first step toward creating your dream home.
          </p>
          <Link href="/contact">
            <Button className="bg-main-secondary text-main-primary hover:bg-main-secondary/90 px-8 py-3">
              Schedule an Appointment
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
