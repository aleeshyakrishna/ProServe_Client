import api, { tokenStorage } from "@/lib/axios";
import type {
  LoginFormData,
  RegisterFormData,
  LoginResponseData,
  RegisterResponseData,
  ApiResponse,
} from "@/types/auth";

// ------ Role mapping -------------------------------------------------------
// Frontend uses lowercase ("customer" | "provider"),
// backend expects uppercase ("CUSTOMER" | "SERVICE_PROVIDER")

const toBackendRole = (role: "customer" | "provider"): "CUSTOMER" | "SERVICE_PROVIDER" =>
  role === "provider" ? "SERVICE_PROVIDER" : "CUSTOMER";

// ------ Auth Service -------------------------------------------------------

export const AuthService = {
  /**
   * Login an existing user.
   * Saves tokens to localStorage and sets the session cookie on success.
   */
  async login(data: LoginFormData): Promise<LoginResponseData> {
    const response = await api.post<ApiResponse<LoginResponseData>>("/api/auth/login", {
      email: data.email,
      password: data.password,
    });

    const { session } = response.data.data;
    tokenStorage.save(session.accessToken, session.refreshToken);

    return response.data.data;
  },

  /**
   * Register a new user account.
   * Does NOT automatically log in — Supabase sends a confirmation email first.
   */
  async register(data: RegisterFormData): Promise<RegisterResponseData> {
    const response = await api.post<ApiResponse<RegisterResponseData>>("/api/auth/register", {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone.replace(/\s+/g, ""),
      password: data.password,
      role: toBackendRole(data.role),
    });

    return response.data.data;
  },

  /**
   * Logout the current user.
   * Clears tokens from localStorage and removes the session cookie.
   */
  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } finally {
      // Always clear local tokens, even if the network request fails
      tokenStorage.clear();
    }
  },

  /**
   * Fetch the currently authenticated user's profile and roles.
   */
  async getMe() {
    const response = await api.get("/api/auth/me");
    return response.data.data;
  },

  /**
   * Send a password reset email.
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post("/api/auth/forgot-password", { email });
  },

  /**
   * Set a new password using a reset token from the email link.
   */
  async resetPassword(password: string, token: string): Promise<void> {
    await api.post("/api/auth/reset-password", { password, token });
  },

  /**
   * Refresh an expired access token using the stored refresh token.
   */
  async refreshToken(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available.");

    const response = await api.post("/api/auth/refresh-token", { refreshToken });
    const { accessToken, refreshToken: newRefresh } = response.data.data;
    tokenStorage.save(accessToken, newRefresh);
  },
};
