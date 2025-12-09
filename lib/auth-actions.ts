const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://ridgeline-homes.forgehome.io";

/**
 * Initiates Google OAuth sign-in flow via redirect
 */
export function signInWithGoogle() {
  const callbackURL = `${window.location.origin}/auth/callback`;
  window.location.href = `${API_URL}/api/auth/sign-in/social?provider=google&callbackURL=${encodeURIComponent(callbackURL)}`;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Sign in failed");
  }

  const data = await response.json();

  // If the backend returns session data directly, store it
  if (data.session && data.user) {
    localStorage.setItem("auth_session", JSON.stringify({
      session: data.session,
      user: data.user,
    }));
    if (data.session.token) {
      localStorage.setItem("session_token", data.session.token);
    }
    window.dispatchEvent(new Event("auth-change"));
    return data;
  }

  // Otherwise, redirect to callback to get the token
  const callbackURL = `${window.location.origin}/auth/callback`;
  window.location.href = `${API_URL}/api/auth/callback?callbackURL=${encodeURIComponent(callbackURL)}`;
}

/**
 * Sign up with email, password, and name
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  const response = await fetch(`${API_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Sign up failed");
  }

  const data = await response.json();

  // If the backend returns session data directly, store it
  if (data.session && data.user) {
    localStorage.setItem("auth_session", JSON.stringify({
      session: data.session,
      user: data.user,
    }));
    if (data.session.token) {
      localStorage.setItem("session_token", data.session.token);
    }
    window.dispatchEvent(new Event("auth-change"));
    return data;
  }

  // Otherwise, redirect to callback
  const callbackURL = `${window.location.origin}/auth/callback`;
  window.location.href = `${API_URL}/api/auth/callback?callbackURL=${encodeURIComponent(callbackURL)}`;
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
