"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Menu,
  Phone,
  Mail,
  MessageCircle,
  User,
  BookOpenIcon,
  LifeBuoyIcon,
  InfoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import SalesPerson from "@/public/sales-person.png";
import Logo from "../main-logo";

type NavItemType = (typeof navigationItems)[number];

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpenIcon,
  LifeBuoyIcon,
  InfoIcon,
};

function MobileNavItem({
  item,
  onClose,
}: {
  item: NavItemType;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!("items" in item) || !item.items) {
    const href =
      "href" in item && typeof item.href === "string" ? item.href : "#";
    return (
      <Link
        href={href}
        onClick={onClose}
        className="block border-b border-slate-700/50 py-3 text-base font-medium text-white"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-slate-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-base font-medium text-white"
      >
        {item.label}
        <ChevronDown
          className={cn(
            "size-5 text-slate-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          {item.items.map((child) => {
            const Icon =
              "icon" in child && child.icon ? IconMap[child.icon] : null;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="flex items-center gap-2 py-2 pl-4 text-sm text-slate-300 transition-colors hover:text-amber-400"
              >
                {Icon && <Icon className="size-4 opacity-60" />}
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="rounded-md text-primary p-2 transition-colors hover:bg-zinc-100 lg:hidden">
          <Menu className="size-6 text-white" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 bg-main-primary border-slate-700"
        closeClassName="text-white"
      >
        {/* Header with Logo */}
        <SheetHeader className="border-b border-slate-700/50 px-6 py-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-44">
              <Logo />
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Items */}
        <div className="flex h-[calc(100%-180px)] flex-col overflow-y-auto px-6 py-4">
          {navigationItems.map((item) => (
            <MobileNavItem
              key={item.label}
              item={item}
              onClose={() => setOpen(false)}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-700/50 p-6 space-y-4">
          {/* Sign In Button */}
          <Button
            asChild
            variant="outline"
            className="w-full border-slate-600 bg-transparent text-white hover:bg-slate-700 hover:text-white"
          >
            <Link href="/sign-in" onClick={() => setOpen(false)}>
              <User className="size-4" />
              Sign In
            </Link>
          </Button>

          {/* Ask Kelly Contact Section */}
          <div className="flex w-full items-center justify-between gap-10 pt-2">
            {/* Profile Image with decorative lines */}
            <div className="flex items-center gap-3 flex-row">
              <div className="relative size-16 rounded-full overflow-hidden border border-white">
                <Image
                  src={SalesPerson}
                  alt="Kelly"
                  height={80}
                  width={80}
                  className="object-cover"
                />
              </div>
              {/* Text */}
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Questions?</span>
                <span className="text-sm font-bold text-white tracking-wide">
                  ASK KELLY
                </span>
              </div>
            </div>

            {/* Contact Icons */}
            <div className="flex items-center gap-3 ">
              <a
                href="tel:+1234567890"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Call Kelly"
              >
                <Phone className="size-5" />
              </a>
              <a
                href="sms:+1234567890"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Text Kelly"
              >
                <MessageCircle className="size-5" />
              </a>
              <a
                href="mailto:kelly@ridgelinehomes.com"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Email Kelly"
              >
                <Mail className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
