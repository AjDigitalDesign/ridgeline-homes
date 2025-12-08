import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://www.ridgelinehomes.net",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "https://www.ridgelinehomes.net",
    "https://ridgelinehomes.net",
    "http://localhost:3000",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    // Use cookie-based sessions (no database required for basic auth)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  // For now, use in-memory adapter (sessions won't persist across restarts)
  // For production, you'd want to add a database adapter
});

// Export auth types
export type Session = typeof auth.$Infer.Session;
