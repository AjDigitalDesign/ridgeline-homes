"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritesContext } from "@/components/providers/favorites-provider";
import type { FavoriteType } from "@/lib/api";

interface FavoriteButtonProps {
  type: FavoriteType;
  itemId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function FavoriteButton({
  type,
  itemId,
  className,
  size = "md",
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite, isToggling, isAuthenticated } =
    useFavoritesContext();

  const favorited = isFavorited(type, itemId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // TODO: Open login modal or redirect to login
      console.log("Please log in to save favorites");
      return;
    }

    await toggleFavorite(type, itemId);
  };

  const sizeClasses = {
    sm: "size-7",
    md: "size-8",
    lg: "size-10",
  };

  const iconSizes = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <button
      onClick={handleClick}
      disabled={isToggling}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-200",
        "hover:scale-110 active:scale-95",
        favorited
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/90 text-gray-400 hover:bg-white hover:text-red-500",
        "shadow-md hover:shadow-lg",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        className
      )}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          favorited && "fill-current"
        )}
      />
      {showLabel && (
        <span className="ml-1.5 text-sm font-medium">
          {favorited ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
