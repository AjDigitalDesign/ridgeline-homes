import { createAuthClient } from "better-auth/react";

// Auth is handled by app.forgehome.io (central auth endpoint)
// This is separate from the data API at ridgeline-homes.forgehome.io
const AUTH_BASE_URL = "https://app.forgehome.io";

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
