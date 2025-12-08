import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchTenant,
  fetchCommunities,
  fetchCommunity,
  fetchHomes,
  fetchHome,
  fetchFloorplans,
  fetchFloorplan,
  submitInquiry,
} from "@/lib/api";

// Tenant/Builder Info
export function useTenant() {
  return useQuery({
    queryKey: ["tenant"],
    queryFn: async () => {
      const { data } = await fetchTenant();
      return data;
    },
  });
}

// Communities
export function useCommunities(
  params?: Parameters<typeof fetchCommunities>[0]
) {
  return useQuery({
    queryKey: ["communities", params],
    queryFn: async () => {
      const { data } = await fetchCommunities(params);
      return data;
    },
  });
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: ["community", slug],
    queryFn: async () => {
      const { data } = await fetchCommunity(slug);
      return data;
    },
    enabled: !!slug,
  });
}

// Homes
export function useHomes(params?: Parameters<typeof fetchHomes>[0]) {
  return useQuery({
    queryKey: ["homes", params],
    queryFn: async () => {
      const { data } = await fetchHomes(params);
      return data;
    },
  });
}

export function useHome(slug: string) {
  return useQuery({
    queryKey: ["home", slug],
    queryFn: async () => {
      const { data } = await fetchHome(slug);
      return data;
    },
    enabled: !!slug,
  });
}

// Floorplans
export function useFloorplans(params?: Parameters<typeof fetchFloorplans>[0]) {
  return useQuery({
    queryKey: ["floorplans", params],
    queryFn: async () => {
      const { data } = await fetchFloorplans(params);
      return data;
    },
  });
}

export function useFloorplan(slug: string) {
  return useQuery({
    queryKey: ["floorplan", slug],
    queryFn: async () => {
      const { data } = await fetchFloorplan(slug);
      return data;
    },
    enabled: !!slug,
  });
}

// Contact Form
export function useSubmitInquiry() {
  return useMutation({
    mutationFn: submitInquiry,
  });
}
