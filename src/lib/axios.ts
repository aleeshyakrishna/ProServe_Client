import axios from "axios";

// ------ Token Helpers (In-Memory Only for Security) -------------------------
// No tokens or sensitive credentials are ever written to localStorage.
// The backend sets HTTP-Only cookies which JavaScript cannot read, eliminating XSS token theft risks.

let inMemoryToken: string | null = null;

export const tokenStorage = {
  getAccessToken: (): string | null => inMemoryToken,
  getRefreshToken: (): string | null => null,
  save: (accessToken: string, _refreshToken?: string): void => {
    inMemoryToken = accessToken;
    if (typeof window !== "undefined") {
      document.cookie = `ps_has_session=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
  },
  clear: (): void => {
    inMemoryToken = null;
    if (typeof window !== "undefined") {
      document.cookie = "ps_has_session=; path=/; max-age=0; SameSite=Lax";
    }
  },
};

// ------ Axios Instance ------------------------------------------------------

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Automatically attaches HTTP-Only authentication cookies
});

// Attach Bearer token to every request if available in memory
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize backend error responses into proper Error objects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
