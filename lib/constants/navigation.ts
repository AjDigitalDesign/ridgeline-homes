import { Label } from "radix-ui";

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  type?: string;
  description?: string;
  children?: NavItem[];
};

export const navigationItems = [
  {
    items: [
      {
        label: "Communities",
        href: "/communities",
        description: "Discover the perfect community for your new home.",
      },
      {
        label: "Plans",
        href: "/plans",
        description: "Explore our variety of home plans.",
      },
      {
        label: "Homes",
        href: "/homes",
        description: "Browse our available homes.",
      },
    ],
    label: "Find Your Home",
    submenu: true,
    type: "description",
  },
  {
    items: [
      {
        label: "Photo",
        href: "/gallery/photo",
        description: "View our photo gallery.",
      },
      {
        label: "Videos",
        href: "/gallery/videos",
        description: "Watch our video gallery.",
      },
      {
        label: "Virtual Tours",
        href: "/gallery/virtual-tours",
        description: "Take virtual tours of our homes.",
      },
    ],
    label: "Gallery",
    submenu: true,
    type: "simple",
  },
  {
    items: [
      {
        label: "Our Process",
        href: "/resources/our-process",
        description: "Learn about our home building process.",
      },
      {
        label: "Blog",
        href: "/resources/blog",
        description: "Read the latest news and updates.",
      },
      {
        label: "FAQs",
        href: "/resources/faqs",
        description: "Find answers to common questions.",
      },
    ],
    label: "Resources",
    submenu: true,
    type: "simple",
  },
  {
    items: [
      { href: "/about-us", icon: "InfoIcon", label: "About Us" },
      { href: "/team", icon: "BookOpenIcon", label: "Our Team" },
      { href: "/careers", icon: "LifeBuoyIcon", label: "Careers" },
    ],
    label: "About",
    submenu: true,
    type: "simple",
  },
  {
    label: "Contact",
    href: "/contact",
    submenu: false,
  },
];
