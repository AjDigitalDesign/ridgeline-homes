"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import { TestimonialsClassic } from "./testimonials-classic";
import { TestimonialsBold } from "./testimonials-bold";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  companyName?: string;
  description: string;
}

interface TestimonialsSectionProps {
  title?: string | null;
  testimonials?: Testimonial[];
  image1?: string | null;
  image2?: string | null;
}

export function TestimonialsSection({
  title,
  testimonials,
  image1,
  image2,
}: TestimonialsSectionProps) {
  const { tenant } = useTenant();
  const template = tenant?.homepageTemplate || "MODERN";

  const props = { title, testimonials, image1, image2 };

  switch (template) {
    case "BOLD":
      return <TestimonialsBold {...props} />;
    case "MODERN":
    default:
      return <TestimonialsClassic {...props} />;
  }
}

// Default export for backward compatibility
export default TestimonialsSection;
