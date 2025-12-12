"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, User, LogOut, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "./auth-modal";

export function UserMenu() {
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="hidden lg:flex items-center gap-2">
        <Loader2 className="size-4 animate-spin text-white" />
      </div>
    );
  }

  // Not authenticated - show Sign In button
  if (!isAuthenticated || !user) {
    return (
      <>
        <div className="hidden lg:block">
          <Button
            onClick={() => setAuthModalOpen(true)}
            className="bg-main-secondary text-main-primary hover:bg-main-secondary/90"
          >
            Sign In
          </Button>
        </div>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    );
  }

  // Authenticated - show user dropdown
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="hidden lg:block">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center size-9 rounded-full bg-main-secondary text-main-primary font-semibold text-sm">
              {initials}
            </div>
            {/* <span className="text-sm font-medium max-w-[100px] truncate">
              {user.name || user.email}
            </span> */}
            <ChevronDown className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="px-3 py-2 border-b mb-2">
            <p className="font-medium text-sm text-main-primary truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link
            href="/account/favorites"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <Heart className="size-4 text-gray-500" />
            Favorites
          </Link>
          <Link
            href="/account/profile"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <User className="size-4 text-gray-500" />
            Profile
          </Link>
          <div className="border-t mt-2 pt-2">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors text-red-600"
            >
              {isSigningOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              Sign Out
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Mobile version for the mobile nav
export function MobileUserMenu() {
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="size-5 animate-spin text-main-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <div className="border-t pt-4 mt-4">
          <Button
            onClick={() => setAuthModalOpen(true)}
            className="w-full bg-main-secondary text-main-primary hover:bg-main-secondary/90"
          >
            Sign In
          </Button>
        </div>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="flex items-center justify-center size-10 rounded-full bg-main-secondary text-main-primary font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-main-primary truncate">
            {user.name || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
      <div className="space-y-1">
        <Link
          href="/account/favorites"
          className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Heart className="size-5 text-main-primary" />
          Favorites
        </Link>
        <Link
          href="/account/profile"
          className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 transition-colors"
        >
          <User className="size-5 text-main-primary" />
          Profile
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg bg-main-primary text-white hover:bg-main-primary/90 transition-colors mt-2"
        >
          {isSigningOut ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <LogOut className="size-5" />
          )}
          Sign Out
        </button>
      </div>
    </div>
  );
}
