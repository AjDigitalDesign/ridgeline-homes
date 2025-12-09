"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement profile update API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    });
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-main-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl lg:text-4xl font-bold text-main-primary italic mb-8">
        Your Profile
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Contact Details Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-main-primary mb-6">
            Contact Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none transition-all"
                placeholder="XXX-XXX-XXXX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main-primary focus:border-transparent outline-none transition-all bg-gray-50"
                placeholder="your@email.com"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-gray-300"
            >
              RESET
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-main-primary hover:bg-main-primary/90"
            >
              {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
              SAVE CHANGES
            </Button>
          </div>
        </section>

        {/* Security Section */}
        <section className="border-t pt-10">
          <h2 className="text-xl font-semibold text-main-primary mb-6">
            Security
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value="••••••••••••"
              disabled
              className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="link"
              className="text-main-primary p-0 h-auto font-semibold"
            >
              CHANGE PASSWORD
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
