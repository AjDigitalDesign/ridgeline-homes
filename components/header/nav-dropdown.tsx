"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
  className?: string;
}

export function NavDropdown({ label, items, className }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1 text-sm font-semibold uppercase tracking-wide transition-colors whitespace-nowrap",
            className
          )}
        >
          {label}
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[220px] p-0 shadow-xl border-0 bg-main-primary rounded-none"
        sideOffset={20}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-600">
          <p className="text-sm font-semibold text-white uppercase tracking-wide">
            {label}
          </p>
          <div className="mt-1.5 w-12 h-0.5 bg-main-secondary" />
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="block px-4 py-2.5 text-sm text-slate-300 hover:text-main-secondary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
