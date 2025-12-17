"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";

interface FavoritesLinkProps {
  className?: string;
  showLabel?: boolean;
}

export function FavoritesLink({ className, showLabel = true }: FavoritesLinkProps) {
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <Link
        href="/account/favorites"
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide transition-colors whitespace-nowrap",
          className
        )}
      >
        <Heart className="size-4" fill="currentColor" />
        {showLabel && <span>Favorites</span>}
      </Link>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
