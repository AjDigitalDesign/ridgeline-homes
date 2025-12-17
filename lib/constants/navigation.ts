export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  type?: string;
  description?: string;
  children?: NavItem[];
};

// Main navigation items for desktop bottom row
export const mainNavItems = [
  {
    label: "Communities",
    href: "/communities",
  },
  {
    label: "Build on Your Lot",
    href: "/build-on-your-lot",
  },
  {
    label: "News & Events",
    href: "/blog",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
];

// Utility navigation items for desktop top row
export const utilityNavItems = [
  {
    label: "Contact",
    href: "/contact",
    icon: "mail",
  },
  {
    label: "Warranty",
    href: "/warranty",
    icon: "home",
  },
] as const;

// Mobile navigation items (expanded menu structure)
export const navigationItems = [
  {
    label: "Communities",
    href: "/communities",
    submenu: false,
  },
  {
    label: "Build on Your Lot",
    href: "/build-on-your-lot",
    submenu: false,
  },
  {
    label: "News & Events",
    href: "/blog",
    submenu: false,
  },
  {
    items: [
      {
        label: "Photos",
        href: "/photos",
        description: "View our photo gallery.",
      },
      {
        label: "Videos",
        href: "/videos",
        description: "Watch our video gallery.",
      },
      {
        label: "Virtual Tours",
        href: "/virtual-tours",
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
        href: "/our-process",
        description: "Learn about our home building process.",
      },
      {
        label: "Design Center",
        href: "/design-center",
        description: "Explore design options.",
      },
      {
        label: "Energy Efficiency",
        href: "/our-process/energy-efficiency",
        description: "Learn about energy-efficient homes.",
      },
    ],
    label: "Resources",
    submenu: true,
    type: "simple",
  },
  {
    items: [
      { href: "/about-us", label: "About Us" },
      { href: "/careers", label: "Careers" },
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
  {
    label: "Warranty",
    href: "/warranty",
    submenu: false,
  },
];
