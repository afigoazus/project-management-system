import axios, { AxiosRequestConfig } from "axios";
import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor response untuk menangani error 401 (Unauthorized) & 403 (Forbidden)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      // Jika error 401 atau 403 (Unauthorized / Forbidden / Session Expired)
      if (status === 401 || status === 403) {
        if (typeof window !== "undefined") {
          // 1. Hapus token di localStorage / sessionStorage jika ada
          localStorage.removeItem("token");
          localStorage.removeItem("bearer_token");
          sessionStorage.clear();

          // 2. Sign out dari better-auth / hapus session cookies jika ada
          try {
            await authClient.signOut();
          } catch {
            // Ignore error jika signOut gagal/sudah expired
          }

          // 3. Hapus cookie session secara langsung di browser jika ada
          document.cookie = "better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "__Secure-better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          // 4. Redirect ke halaman /login jika belum berada di /login
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || "GET").toLowerCase();
  
  let data;
  if (options.body) {
    try {
      data = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
    } catch {
      data = options.body;
    }
  }

  const config: AxiosRequestConfig = {
    url: path,
    method,
    data,
    headers: options.headers as Record<string, string>,
  };

  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const message = error.response.data.message || error.response.data.error || "Request failed";
      throw new Error(message);
    }
    throw error;
  }
}


