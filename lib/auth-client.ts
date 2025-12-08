import { createAuthClient } from "better-auth/react";

// Auth is handled by our Next.js app directly
// No need to proxy to external API
export const authClient = createAuthClient({
  baseURL: "", // Empty string means use the same origin (our Next.js app)
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
