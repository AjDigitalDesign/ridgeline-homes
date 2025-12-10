"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/use-favorites";
import type { FavoriteType, Favorite, CreateFavoriteData } from "@/lib/api";

const typeLabels: Record<FavoriteType, string> = {
  home: "Home",
  community: "Community",
  floorplan: "Floor Plan",
};

interface FavoritesContextValue {
  favorites: Favorite[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isFavorited: (type: FavoriteType, itemId: string) => boolean;
  toggleFavorite: (type: FavoriteType, itemId: string) => Promise<void>;
  isToggling: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: favoritesData, isLoading: isFavoritesLoading } = useFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  // Ensure favorites is always an array
  const favorites = Array.isArray(favoritesData) ? favoritesData : [];

  const isLoading = isAuthLoading || isFavoritesLoading;
  const isToggling = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const isFavorited = useCallback(
    (type: FavoriteType, itemId: string) => {
      if (!Array.isArray(favorites)) return false;

      return favorites.some((fav) => {
        // Case-insensitive type comparison in case backend returns uppercase
        const favType = fav.type?.toLowerCase();
        if (favType !== type.toLowerCase()) return false;
        if (type === "home") return fav.homeId === itemId;
        if (type === "community") return fav.communityId === itemId;
        if (type === "floorplan") return fav.floorplanId === itemId;
        return false;
      });
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (type: FavoriteType, itemId: string) => {
      if (!isAuthenticated) {
        toast.error("Please sign in to save favorites");
        return;
      }

      const currentlyFavorited = isFavorited(type, itemId);
      const label = typeLabels[type];

      try {
        if (currentlyFavorited) {
          await removeFavoriteMutation.mutateAsync({ type, itemId });
          toast.success(`${label} removed from favorites`);
        } else {
          const data: CreateFavoriteData = { type };
          if (type === "home") data.homeId = itemId;
          else if (type === "community") data.communityId = itemId;
          else if (type === "floorplan") data.floorplanId = itemId;
          await addFavoriteMutation.mutateAsync(data);
          toast.success(`${label} added to favorites`, {
            description: "View your saved items in your account.",
          });
        }
      } catch (error) {
        toast.error("Something went wrong", {
          description: "Please try again later.",
        });
        console.error("Toggle favorite failed:", error);
      }
    },
    [isAuthenticated, isFavorited, addFavoriteMutation, removeFavoriteMutation]
  );

  const value = useMemo(
    () => ({
      favorites,
      isLoading,
      isAuthenticated,
      isFavorited,
      toggleFavorite,
      isToggling,
    }),
    [favorites, isLoading, isAuthenticated, isFavorited, toggleFavorite, isToggling]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within a FavoritesProvider");
  }
  return context;
}
