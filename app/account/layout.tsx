"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, User, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    label: "Favorites",
    href: "/account/favorites",
    icon: Heart,
  },
  {
    label: "Profile",
    href: "/account/profile",
    icon: User,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
    }
  }, [isPending, session, router]);

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-main-primary" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session?.user) {
    return null;
  }

  const firstName = session.user.name?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r lg:min-h-[calc(100vh-80px)]">
          <div className="p-6 lg:p-8">
            {/* User greeting */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-main-primary">
                Hello {firstName}
              </h1>
              <p className="text-gray-500 mt-1">Welcome to Your Dashboard</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gray-100 text-main-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-main-primary"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-5",
                        isActive ? "text-main-secondary fill-main-secondary" : ""
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
