"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import { HeaderClassic } from "./header-classic";
import { HeaderBold } from "./header-bold";

export function Header() {
  const { tenant } = useTenant();
  const template = tenant?.homepageTemplate || "MODERN";

  switch (template) {
    case "BOLD":
      return <HeaderBold />;
    case "MODERN":
    default:
      return <HeaderClassic />;
  }
}
