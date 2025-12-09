const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ridgeline-homes.forgehome.io";

/**
 * Initiates Google OAuth sign-in flow via redirect using cross-domain endpoint
 */
export function signInWithGoogle() {
  const callbackURL = `${window.location.origin}/auth/callback`;
  window.location.href = `${API_URL}/api/auth/cross-domain/google?callbackURL=${encodeURIComponent(callbackURL)}`;
}

/**
 * Sign in with email and password using cross-domain endpoint
 */
export async function signInWithEmail(email: string, password: string) {
  // Step 1: Call the cross-domain sign-in endpoint
  const response = await fetch(`${API_URL}/api/auth/cross-domain/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Sign in failed");
  }

  const { authToken } = await response.json();

  if (!authToken) {
    throw new Error("No auth token received");
  }

  // Step 2: Exchange the token for session data
  const exchangeResponse = await fetch(`${API_URL}/api/auth/exchange-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: authToken }),
  });

  if (!exchangeResponse.ok) {
    throw new Error("Failed to exchange token");
  }

  const { session, user } = await exchangeResponse.json();

  // Step 3: Store session locally
  localStorage.setItem("auth_session", JSON.stringify({ session, user }));
  if (session?.token) {
    localStorage.setItem("session_token", session.token);
  }

  // Trigger auth change event
  window.dispatchEvent(new Event("auth-change"));

  return { session, user };
}

/**
 * Sign up with email, password, and name using cross-domain endpoint
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  // Step 1: Call the cross-domain sign-up endpoint
  const response = await fetch(`${API_URL}/api/auth/cross-domain/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Sign up failed");
  }

  const { authToken } = await response.json();

  if (!authToken) {
    throw new Error("No auth token received");
  }

  // Step 2: Exchange the token for session data
  const exchangeResponse = await fetch(`${API_URL}/api/auth/exchange-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: authToken }),
  });

  if (!exchangeResponse.ok) {
    throw new Error("Failed to exchange token");
  }

  const { session, user } = await exchangeResponse.json();

  // Step 3: Store session locally
  localStorage.setItem("auth_session", JSON.stringify({ session, user }));
  if (session?.token) {
    localStorage.setItem("session_token", session.token);
  }

  // Trigger auth change event
  window.dispatchEvent(new Event("auth-change"));

  return { session, user };
}

/**
 * Sign out the current user
 */
export async function signOutUser() {
  const sessionToken = localStorage.getItem("session_token");

  if (sessionToken) {
    try {
      await fetch(`${API_URL}/api/auth/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });
    } catch (e) {
      console.error("Failed to sign out from backend:", e);
    }
  }

  localStorage.removeItem("auth_session");
  localStorage.removeItem("session_token");
  window.dispatchEvent(new Event("auth-change"));
}
