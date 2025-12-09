"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/use-favorites";
import type { FavoriteType, Favorite, CreateFavoriteData } from "@/lib/api";

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
  const { data: favorites = [], isLoading: isFavoritesLoading } = useFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const isLoading = isAuthLoading || isFavoritesLoading;
  const isToggling = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const isFavorited = useCallback(
    (type: FavoriteType, itemId: string) => {
      return favorites.some((fav) => {
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
        // Could trigger a login modal here
        console.warn("User must be logged in to favorite items");
        return;
      }

      const currentlyFavorited = isFavorited(type, itemId);

      if (currentlyFavorited) {
        await removeFavoriteMutation.mutateAsync({ type, itemId });
      } else {
        const data: CreateFavoriteData = { type };
        if (type === "home") data.homeId = itemId;
        else if (type === "community") data.communityId = itemId;
        else if (type === "floorplan") data.floorplanId = itemId;
        await addFavoriteMutation.mutateAsync(data);
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
