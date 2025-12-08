import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { navigationItems } from "@/lib/constants/navigation";

// const navigationItems = [
//   {
//     items: [
//       {
//         label: "Communities",
//         href: "/communities",
//         description: "Discover the perfect community for your new home.",
//       },
//       {
//         label: "Plans",
//         href: "/plans",
//         description: "Explore our variety of home plans.",
//       },
//       {
//         label: "Homes",
//         href: "/homes",
//         description: "Browse our available homes.",
//       },
//     ],
//     label: "Find Your Home",
//     submenu: true,
//     type: "description",
//   },
//   {
//     items: [
//       {
//         label: "Photo",
//         href: "/gallery/photo",
//         description: "View our photo gallery.",
//       },
//       {
//         label: "Videos",
//         href: "/gallery/videos",
//         description: "Watch our video gallery.",
//       },
//       {
//         label: "Virtual Tours",
//         href: "/gallery/virtual-tours",
//         description: "Take virtual tours of our homes.",
//       },
//     ],
//     label: "Gallery",
//     submenu: true,
//     type: "simple",
//   },
//   {
//     items: [
//       {
//         label: "Our Process",
//         href: "/resources/our-process",
//         description: "Learn about our home building process.",
//       },
//       {
//         label: "Blog",
//         href: "/resources/blog",
//         description: "Read the latest news and updates.",
//       },
//       {
//         label: "FAQs",
//         href: "/resources/faqs",
//         description: "Find answers to common questions.",
//       },
//     ],
//     label: "Resources",
//     submenu: true,
//     type: "simple",
//   },
//   {
//     items: [
//       { href: "/about-us", icon: "InfoIcon", label: "About Us" },
//       { href: "/team", icon: "BookOpenIcon", label: "Our Team" },
//       { href: "/careers", icon: "LifeBuoyIcon", label: "Careers" },
//     ],
//     label: "About",
//     submenu: true,
//     type: "simple",
//   },
// ];

// Navigation links array to be used in both desktop and mobile menus
// const navigationLinks = [
//   { href: "#", label: "Home" },
//   {
//     items: [
//       {
//         description: "Browse all components in the library.",
//         href: "#",
//         label: "Components",
//       },
//       {
//         description: "Learn how to use the library.",
//         href: "#",
//         label: "Documentation",
//       },
//       {
//         description: "Pre-built layouts for common use cases.",
//         href: "#",
//         label: "Templates",
//       },
//     ],
//     label: "Features",
//     submenu: true,
//     type: "description",
//   },
//   {
//     items: [
//       { href: "#", label: "Product A" },
//       { href: "#", label: "Product B" },
//       { href: "#", label: "Product C" },
//       { href: "#", label: "Product D" },
//     ],
//     label: "Pricing",
//     submenu: true,
//     type: "simple",
//   },
//   {
//     items: [
//       { href: "#", icon: "BookOpenIcon", label: "Getting Started" },
//       { href: "#", icon: "LifeBuoyIcon", label: "Tutorials" },
//       { href: "#", icon: "InfoIcon", label: "About Us" },
//     ],
//     label: "About",
//     submenu: true,
//     type: "icon",
//   },
// ];

export default function DesktopNav() {
  return (
    <div className="hidden lg:block">
      {/* Navigation menu */}
      <NavigationMenu className="max-md:hidden" viewport={false}>
        <NavigationMenuList className="gap-2">
          {navigationItems.map((link) => (
            <NavigationMenuItem key={link.label}>
              {link.submenu && link.items ? (
                <>
                  <NavigationMenuTrigger className="*:[svg]:-me-0.5 bg-transparent px-4 py-1.5 font-inter leading-7 text-base hover:bg-transparent hover:text-main-secondary transition-colors *:[svg]:size-3.5 text-white">
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                    <ul
                      className={cn(
                        link.type === "description" ? "min-w-64" : "min-w-48"
                      )}
                    >
                      {link.items.map((item) => (
                        <li key={item.label}>
                          <NavigationMenuLink
                            className="py-1.5"
                            href={item.href}
                          >
                            {/* Display icon if present */}
                            {link.type === "icon" && "icon" in item && (
                              <div className="flex items-center gap-2">
                                {item.icon === "BookOpenIcon" && (
                                  <BookOpenIcon
                                    aria-hidden="true"
                                    className="text-foreground opacity-60"
                                    size={16}
                                  />
                                )}
                                {item.icon === "LifeBuoyIcon" && (
                                  <LifeBuoyIcon
                                    aria-hidden="true"
                                    className="text-foreground opacity-60"
                                    size={16}
                                  />
                                )}
                                {item.icon === "InfoIcon" && (
                                  <InfoIcon
                                    aria-hidden="true"
                                    className="text-foreground opacity-60"
                                    size={16}
                                  />
                                )}
                                <span>{item.label}</span>
                              </div>
                            )}

                            {/* Display label with description if present */}
                            {link.type === "description" &&
                            "description" in item ? (
                              <div className="space-y-1">
                                <div className="font-medium">{item.label}</div>
                                <p className="line-clamp-2 text-muted-foreground text-xs">
                                  {item.description}
                                </p>
                              </div>
                            ) : (
                              // Display simple label if not icon or description type
                              !link.type ||
                              (link.type !== "icon" &&
                                link.type !== "description" && (
                                  <span>{item.label}</span>
                                ))
                            )}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  className="px-4 py-1.5 font-inter leading-7 text-base text-white hover:text-main-secondary transition-colors"
                  href={link.href}
                >
                  {link.label}
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
