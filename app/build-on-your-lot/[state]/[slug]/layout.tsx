interface LayoutProps {
  children: React.ReactNode;
}

export default function BOYLLocationLayout({ children }: LayoutProps) {
  // This layout is minimal - individual pages handle their own hero/nav
  // to allow floorplan detail pages to have a different layout
  return <>{children}</>;
}
