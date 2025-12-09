import { Metadata } from "next";
import Link from "next/link";
import {
  Smartphone,
  Thermometer,
  Lock,
  Lightbulb,
  Speaker,
  Shield,
  Wifi,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Smart Home Technology | Ridgeline Homes",
  description: "Discover the smart home technology included in every Ridgeline home. Control your home from anywhere with our integrated smart systems.",
};

const smartFeatures = [
  {
    icon: Smartphone,
    title: "Smart Home Hub",
    description: "Control all your smart devices from one central app. Manage everything from your phone, tablet, or voice.",
  },
  {
    icon: Thermometer,
    title: "Smart Thermostat",
    description: "Intelligent climate control that learns your preferences and optimizes energy efficiency automatically.",
  },
  {
    icon: Lock,
    title: "Smart Locks",
    description: "Keyless entry with smart locks. Grant access remotely and monitor who comes and goes.",
  },
  {
    icon: Lightbulb,
    title: "Smart Lighting",
    description: "Automated lighting that adjusts to your schedule. Set scenes, schedules, and control remotely.",
  },
  {
    icon: Speaker,
    title: "Voice Control",
    description: "Compatible with Alexa, Google Home, and Apple HomeKit for hands-free control.",
  },
  {
    icon: Shield,
    title: "Security System",
    description: "Integrated security with smart cameras, motion sensors, and 24/7 monitoring options.",
  },
];

const benefits = [
  "Energy savings through intelligent automation",
  "Enhanced security and peace of mind",
  "Convenience and comfort at your fingertips",
  "Increased home value and appeal",
  "Future-ready infrastructure",
  "Professional installation included",
];

export default function SmartHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] lg:h-[500px] bg-main-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-main-primary via-main-primary/90 to-main-primary/70" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <Wifi className="size-8 text-main-secondary" />
            <span className="text-main-secondary font-semibold uppercase tracking-wider">
              Smart Living
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4">
            Smart Home Technology
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl mb-8">
            Every Ridgeline home comes equipped with cutting-edge smart home technology, giving you control, convenience, and peace of mind.
          </p>
          <Link href="/communities">
            <Button className="bg-main-secondary text-main-primary hover:bg-main-secondary/90 px-8 py-3">
              Explore Our Homes
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Included Smart Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our homes come pre-wired and equipped with the latest smart home technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {smartFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-main-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="size-7 text-main-primary" />
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

      {/* Benefits Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Smart Home Technology?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Smart home technology isn't just about convenience—it's about creating a better way of living. From energy savings to enhanced security, the benefits are tangible and lasting.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="size-5 text-main-primary flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="aspect-video bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                <Smartphone className="size-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Control From Anywhere
              </h3>
              <p className="text-gray-600">
                Whether you're at work, on vacation, or just in bed, you have full control of your home right from your smartphone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Works With Your Favorite Platforms
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our smart home systems integrate seamlessly with the platforms you already use.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {["Amazon Alexa", "Google Home", "Apple HomeKit", "Samsung SmartThings"].map((platform) => (
              <div
                key={platform}
                className="text-center px-6 py-4 bg-gray-50 rounded-lg"
              >
                <span className="font-semibold text-gray-700">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-main-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Experience Smart Living
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Visit one of our model homes to see our smart home technology in action. Our team will show you how easy it is to control your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/communities">
              <Button className="bg-main-secondary text-main-primary hover:bg-main-secondary/90 px-8 py-3">
                Find a Community
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
