import { useAuth } from "@clerk/clerk-react";
import { apiRequest } from "../config/api";

/**
 * Custom hook for making authenticated API requests with Clerk
 * 
 * Usage:
 * const api = useClerkAPI();
 * const data = await api.get('/endpoint');
 * const result = await api.post('/endpoint', { body: data });
 */
export function useClerkAPI() {
  const { getToken } = useAuth();

  const makeRequest = async (path, options = {}) => {
    const token = await getToken();
    return apiRequest(path, {
      ...options,
      clerkToken: token,
    });
  };

  return {
    get: (path, options = {}) => makeRequest(path, { ...options, method: "GET" }),
    post: (path, body, options = {}) => makeRequest(path, { ...options, method: "POST", body }),
    put: (path, body, options = {}) => makeRequest(path, { ...options, method: "PUT", body }),
    delete: (path, options = {}) => makeRequest(path, { ...options, method: "DELETE" }),
    patch: (path, body, options = {}) => makeRequest(path, { ...options, method: "PATCH", body }),
  };
}
