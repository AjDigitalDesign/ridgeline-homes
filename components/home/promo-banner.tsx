import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface PromoBannerProps {
  description: string;
  link?: string | null;
}

export default function PromoBanner({ description, link }: PromoBannerProps) {
  // Split description by newline to handle multi-line text
  const lines = description.split("\n");

  const content = (
    <div className="py-6 space-y-1 lg:flex lg:items-center lg:justify-between lg:space-y-0">
      <div>
        {lines[0] && (
          <h4 className="font-semibold text-xl lg:text-2xl text-main-primary sm:text-base">
            {lines[0]}
          </h4>
        )}
        {lines[1] && (
          <p className="text-base text-main-primary sm:text-base">{lines[1]}</p>
        )}
      </div>
      {link && (
        <div className="mt-4 lg:mt-0">
          <Button
            asChild
            className="group h-auto rounded-md bg-white px-4 py-3 text-base font-medium text-main-primary hover:text-white transition-colors hover:bg-main-primary"
          >
            <Link href={link} className="">
              Learn More <ArrowRight className="inline-block size-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full px-4 lg:px-6 bg-main-secondary rounded-md">
      {content}
    </div>
  );
}
