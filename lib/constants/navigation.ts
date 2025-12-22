export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  type?: string;
  description?: string;
  children?: NavItem[];
};

// Main navigation items for desktop bottom row
// Note: "Find Your Home" and "Build on Your Lot" are rendered separately as dropdown components
export const mainNavItems = [
  {
    label: "Build on Your Lot",
    href: "/build-on-your-lot",
    hasDropdown: true,
  },
  {
    label: "News & Events",
    href: "/blog",
    hasDropdown: true,
  },
  {
    label: "About Us",
    href: "/about-us",
    hasDropdown: true,
  },
];

// About Us dropdown items
export const aboutUsDropdownItems = [
  {
    label: "About Us",
    href: "/about-us",
    description: "Learn more about our company.",
  },
  {
    label: "Gallery",
    href: "/photos",
    description: "View our photo gallery.",
  },
  {
    label: "Our Process",
    href: "/our-process",
    description: "Learn about our home building process.",
  },
  {
    label: "Energy Efficiency",
    href: "/our-process/energy-efficiency",
    description: "Learn about energy-efficient homes.",
  },
  {
    label: "Financing",
    href: "/financing",
    description: "Explore financing options.",
  },
];

// News & Events dropdown items
export const newsEventsDropdownItems = [
  {
    label: "Blog",
    href: "/blog",
    description: "Read our latest news and updates.",
  },
  {
    label: "Events",
    href: "/events",
    description: "View upcoming events.",
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
// Note: "Find Your Home" and "Build on Your Lot" are rendered separately as dynamic components
export const navigationItems = [
  {
    label: "News & Events",
    href: "/blog",
    submenu: true,
    type: "simple",
    items: [
      {
        label: "Blog",
        href: "/blog",
        description: "Read our latest news and updates.",
      },
      {
        label: "Events",
        href: "/events",
        description: "View upcoming events.",
      },
    ],
  },
  {
    label: "About Us",
    href: "/about-us",
    submenu: true,
    type: "simple",
    items: [
      {
        label: "About Us",
        href: "/about-us",
        description: "Learn more about our company.",
      },
      {
        label: "Gallery",
        href: "/photos",
        description: "View our photo gallery.",
      },
      {
        label: "Our Process",
        href: "/our-process",
        description: "Learn about our home building process.",
      },
      {
        label: "Energy Efficiency",
        href: "/our-process/energy-efficiency",
        description: "Learn about energy-efficient homes.",
      },
      {
        label: "Financing",
        href: "/financing",
        description: "Explore financing options.",
      },
    ],
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
