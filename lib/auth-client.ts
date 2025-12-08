import { createAuthClient } from "better-auth/react";

// Auth is handled by the ForgeHome backend at app.forgehome.io
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://app.forgehome.io",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
