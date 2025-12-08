import { createAuthClient } from "better-auth/react";

// Auth uses the tenant subdomain which has CORS configured for ridgelinehomes.net
// The backend team needs to configure Better Auth on this endpoint
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ridgeline-homes.forgehome.io";

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
