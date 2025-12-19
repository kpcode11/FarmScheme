const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

function normalizeBaseUrl(raw) {
  if (!raw || typeof raw !== "string") return "http://localhost:3000/api/v1";
  const trimmed = raw.trim();
  // If starts with a colon like ":9000/api/v1", prefix localhost
  if (trimmed.startsWith(":")) return `http://localhost${trimmed}`;
  // If it's just a path like "/api/v1", prefix current origin
  if (trimmed.startsWith("/")) return `${window.location.origin}${trimmed}`;
  // If missing protocol but contains host:port, add http://
  if (!/^https?:\/\//i.test(trimmed)) return `http://${trimmed}`;
  return trimmed;
}

export const API_BASE_URL = normalizeBaseUrl(RAW_BASE).replace(/\/$/, "");

// Legacy token functions kept for backward compatibility but not used with Clerk
const TOKEN_KEY = "auth_token";

export const getAuthToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";

export const setAuthToken = (token, persistent = true) => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  if (!token) return;
  if (persistent) localStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

// Updated to work with Clerk session tokens
export async function apiRequest(path, { method = "GET", body, headers = {}, clerkToken = null } = {}) {
  // Use Clerk token if provided, otherwise fall back to legacy token
  const token = clerkToken || getAuthToken();
  
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await res.json().catch(() => ({ message: "Invalid JSON response" }));
  if (!res.ok) {
    const message = payload?.message || payload?.error || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}


