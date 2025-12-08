import { createAuthClient } from "better-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// In development, use the local proxy to bypass CORS for regular auth
// In production, call the API directly
const isDev = process.env.NODE_ENV === "development";
const baseURL = isDev ? "" : API_URL;

export const authClient = createAuthClient({
  baseURL,
});

export const {
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

// Export signIn separately - we'll handle social login specially
export const signIn = authClient.signIn;

// For Google OAuth in development, we need to redirect to the actual API
// because OAuth callbacks must go to the registered redirect URI
export const getGoogleSignInUrl = (callbackURL: string) => {
  const params = new URLSearchParams({
    callbackURL,
  });
  return `${API_URL}/api/auth/signin/social?provider=google&${params.toString()}`;
};
