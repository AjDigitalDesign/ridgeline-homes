import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // The external API handles authentication
  // This client config connects to the existing Better Auth instance
});

// Export auth client for use in components
export type Session = typeof auth.$Infer.Session;
