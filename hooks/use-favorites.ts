"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFavorites,
  addFavorite,
  removeFavoriteByItem,
  type FavoriteType,
  type Favorite,
  type CreateFavoriteData,
} from "@/lib/api";
import { useSession } from "@/lib/auth-client";

// Fetch all favorites
export function useFavorites(type?: FavoriteType) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["favorites", type],
    queryFn: async () => {
      const { data } = await fetchFavorites(type);
      return data;
    },
    enabled: !!session?.user,
  });
}

// Add favorite mutation
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFavoriteData) => {
      const { data: result } = await addFavorite(data);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate both the type-specific and all favorites queries
      queryClient.invalidateQueries({ queryKey: ["favorites", variables.type] });
      queryClient.invalidateQueries({ queryKey: ["favorites", undefined] });
    },
  });
}

// Remove favorite mutation
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      itemId,
    }: {
      type: FavoriteType;
      itemId: string;
    }) => {
      await removeFavoriteByItem(type, itemId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favorites", variables.type] });
      queryClient.invalidateQueries({ queryKey: ["favorites", undefined] });
    },
  });
}

// Toggle favorite mutation (add if not favorited, remove if favorited)
export function useToggleFavorite() {
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  return {
    toggle: (
      type: FavoriteType,
      itemId: string,
      isFavorited: boolean
    ) => {
      if (isFavorited) {
        return removeFavoriteMutation.mutateAsync({ type, itemId });
      } else {
        const data: CreateFavoriteData = { type };
        if (type === "home") data.homeId = itemId;
        else if (type === "community") data.communityId = itemId;
        else if (type === "floorplan") data.floorplanId = itemId;
        return addFavoriteMutation.mutateAsync(data);
      }
    },
    isPending: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}

// Check if a specific item is favorited
export function useIsFavorited(type: FavoriteType, itemId: string) {
  const { data: favorites } = useFavorites(type);

  if (!favorites) return false;

  return favorites.some((fav) => {
    if (type === "home") return fav.homeId === itemId;
    if (type === "community") return fav.communityId === itemId;
    if (type === "floorplan") return fav.floorplanId === itemId;
    return false;
  });
}
