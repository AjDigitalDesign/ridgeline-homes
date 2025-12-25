"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import { FooterClassic } from "./footer-classic";
import { FooterBold } from "./footer-bold";

export function Footer() {
  const { tenant } = useTenant();
  const template = tenant?.homepageTemplate || "MODERN";

  switch (template) {
    case "BOLD":
      return <FooterBold />;
    case "MODERN":
    default:
      return <FooterClassic />;
  }
}
