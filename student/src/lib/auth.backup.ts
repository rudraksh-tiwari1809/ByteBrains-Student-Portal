// Reusable auth/API utilities for the ByteBrains student portal.
// The base URL can be overridden with VITE_API_URL when the FastAPI
// backend is hosted somewhere other than the local default.

const API_URL = import.meta.env["VITE_API_URL"] ?? "https://bytebrains-cbf5.onrender.com";
const TOKEN_KEY = "bytebrains_access_token";

export class AuthError extends Error {
  constructor(
    message: string,
    readonly kind: "credentials" | "network" | "unknown",
  ) {
    super(message);
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email: string, password: string, remember: boolean): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch {
    throw new AuthError("Unable to connect to server. Please try again.", "network");
  }

  if (res.status === 401 || res.status === 400 || res.status === 403) {
    throw new AuthError("Invalid email or password", "credentials");
  }
  if (!res.ok) {
    throw new AuthError("Unable to connect to server. Please try again.", "unknown");
  }

  const data = (await res.json()) as {
    authenticated?: boolean;
    user?: Record<string, unknown>;
  };

  if (!data.authenticated) {
    throw new AuthError("Unable to connect to server. Please try again.", "unknown");
  }

  // Current backend uses session-style authentication rather than JWT.
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, "authenticated");
  return "authenticated";
}

export interface StudentRegistration {
  name: string;
  email: string;
  password: string;
  branch: string;
  college: string;
  year: string;
  phone: string;
  location: string;
  enrollment: string;
  about: string;
}

export async function registerStudent(reg: StudentRegistration): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/student/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: reg.name,
        email: reg.email,
        // The backend hashes this field; send the plain password only to the
        // local API for this demo, and never store or log it.
        password: reg.password,
        branch: reg.branch,
        college: reg.college,
        year: reg.year,
        phone: reg.phone,
        location: reg.location,
        enrollment: reg.enrollment,
        about: reg.about,
      }),
    });
  } catch {
    throw new AuthError("Unable to connect to server. Please try again.", "network");
  }

  if (res.status === 400 || res.status === 409 || res.status === 422) {
    throw new AuthError("An account with this email already exists.", "credentials");
  }
  if (!res.ok) {
    throw new AuthError("Unable to connect to server. Please try again.", "unknown");
  }
}




