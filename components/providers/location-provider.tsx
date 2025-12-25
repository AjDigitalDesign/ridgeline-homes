"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const STORAGE_KEY = "ridgeline-user-location";

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  formattedAddress?: string;
}

interface LocationContextValue {
  userLocation: UserLocation | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

interface LocationProviderProps {
  children: React.ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserLocation(parsed);
      }
    } catch (error) {
      console.error("Failed to load location from storage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Reverse geocode to get city/state from coordinates
  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<UserLocation>> => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      const data = await response.json();
      const address = data.address || {};

      return {
        city: address.city || address.town || address.village || address.county,
        state: address.state,
        formattedAddress: data.display_name,
      };
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return {};
    }
  };

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        });
      });

      const { latitude, longitude } = position.coords;

      // Get city/state from coordinates
      const geocodeData = await reverseGeocode(latitude, longitude);

      const location: UserLocation = {
        latitude,
        longitude,
        ...geocodeData,
      };

      setUserLocation(location);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      } catch (error) {
        console.error("Failed to save location to storage:", error);
      }
    } catch (error) {
      const geoError = error as GeolocationPositionError;
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          setLocationError("Location permission denied. Please enable location access in your browser settings.");
          break;
        case geoError.POSITION_UNAVAILABLE:
          setLocationError("Location information is unavailable.");
          break;
        case geoError.TIMEOUT:
          setLocationError("Location request timed out. Please try again.");
          break;
        default:
          setLocationError("An error occurred while getting your location.");
      }
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setUserLocation(null);
    setLocationError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear location from storage:", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      userLocation: isHydrated ? userLocation : null,
      isLoadingLocation,
      locationError,
      requestLocation,
      clearLocation,
    }),
    [userLocation, isLoadingLocation, locationError, requestLocation, clearLocation, isHydrated]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
