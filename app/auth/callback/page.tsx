"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const authToken = searchParams.get("auth_token");
      const authError = searchParams.get("auth_error");

      if (authError) {
        setStatus("error");
        setError(
          authError === "no_session"
            ? "Session expired. Please sign in again."
            : authError
        );
        return;
      }

      if (!authToken) {
        setStatus("error");
        setError("No authentication token received");
        return;
      }

      try {
        // Exchange the one-time token for session data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/exchange-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: authToken }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to exchange token");
        }

        const { session, user } = await response.json();

        // Store the session data
        localStorage.setItem("auth_session", JSON.stringify({ session, user }));

        // Also store the session token for API calls
        if (session?.token) {
          localStorage.setItem("session_token", session.token);
        }

        setStatus("success");

        // Trigger storage event for other tabs/components
        window.dispatchEvent(new Event("auth-change"));

        // Redirect to home
        router.push("/");
      } catch (err: unknown) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-main-primary mx-auto" />
          <p className="mt-4 text-gray-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">!</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Authentication Failed
            </h1>
            <p className="text-red-500 mb-6">{error}</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-main-primary hover:bg-main-primary/90"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - briefly shown before redirect
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-green-600">✓</span>
        </div>
        <p className="text-gray-600">Sign in successful! Redirecting...</p>
      </div>
    </div>
  );
}
