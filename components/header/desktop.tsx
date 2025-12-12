"use client";

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import findYourHome from "@/public/abouttwo.jpg";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Gallery",
    href: "/gallery",
    description: "Collection of images and videos.",
  },
  {
    title: "Videos",
    href: "/videos",
    description:
      "A series of recorded clips demonstrating features and functionalities.",
  },
  {
    title: "Virtual Tours",
    href: "/virtual-tours",
    description:
      "Interactive walkthroughs that provide an immersive experience.",
  },
];

const navigationItems: { title: string; href: string; description: string }[] =
  [
    {
      title: "Our Process",
      href: "/our-process",
      description: "Step-by-step guide to how we work.",
    },
    {
      title: "Design Center",
      href: "/design-center",
      description:
        "Explore design options to customize your home to your style.",
    },
    {
      title: "Energy Efficiency",
      href: "/energy-efficiency",
      description:
        "Learn about our commitment to building energy-efficient homes.",
    },
  ];

const aboutUsItems: { title: string; href: string; description: string }[] = [
  {
    title: "About US",
    href: "/about-us",
    description: "Step-by-step guide to how we work.",
  },
  {
    title: "Meet the Team",
    href: "/meet-the-team",
    description: "Explore design options to customize your home to your style.",
  },
  {
    title: "Careers",
    href: "/careers",
    description:
      "Learn about our commitment to building energy-efficient homes.",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Read the latest news and updates.",
  },
];

export default function DesktopNav() {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap text-white font-inter">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-base font-semibold leading-7">
            Find Your Home
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li
                className="relative row-span-3 overflow-hidden rounded-md bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${findYourHome.src})` }}
              >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Bottom gradient fade */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

                <NavigationMenuLink asChild>
                  <a
                    href="/"
                    className="flex h-full w-full flex-col justify-end rounded-md p-6 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${findYourHome})` }}
                  >
                    <div className="mb-2 text-lg font-semibold text-white sm:text-lg relative z-10">
                      Discover Your Next Home
                    </div>

                    <p className="max-w-sm text-xs leading-snug relative z-10 text-white">
                      Your home is where life’s best memories are made.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>

              <ListItem href="/communities" title="Communities">
                Discover the perfect community for your new home.
              </ListItem>
              <ListItem href="/plans" title="Plans">
                Explore our variety of home plans.
              </ListItem>
              <ListItem href="/homes" title="Quick Move-In Homes">
                Browse our Quick Move-In Homes.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger className="text-base font-semibold leading-7">
            Gallery
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3">
              {components.map((component) => (
                <li key={component.href}>
                  <NavigationMenuLink asChild>
                    <Link href={component.href}>
                      <div className="font-medium">{component.title}</div>
                      <div className="text-muted-foreground">
                        {component.description}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger className="text-base font-semibold leading-7">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3">
              {navigationItems.map((component) => (
                <li key={component.href}>
                  <NavigationMenuLink asChild>
                    <Link href={component.href}>
                      <div className="font-medium">{component.title}</div>
                      <div className="text-muted-foreground">
                        {component.description}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger className="text-base font-semibold leading-7">
            About Us
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3">
              {aboutUsItems.map((component) => (
                <li key={component.href}>
                  <NavigationMenuLink asChild>
                    <Link href={component.href}>
                      <div className="font-medium">{component.title}</div>
                      <div className="text-muted-foreground">
                        {component.description}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="leading-none text-base  font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2  leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
