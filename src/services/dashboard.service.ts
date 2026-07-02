import api from "@/lib/axios";
import type { ApiResponse } from "@/types/auth";

export interface DashboardBooking {
  id: string;
  userId: string;
  serviceId: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  // Join extensions
  serviceName?: string;
  customerName?: string;
  price?: number;
}

export interface DashboardService {
  id: string;
  title: string;
  description: string;
  category: "PLUMBING" | "ELECTRICAL" | "CLEANING" | "SALON" | "CONSULTATION";
  price: number;
  providerId: string;
  isAvailable: boolean;
  createdAt: string;
}

export const DashboardServiceApi = {
  /**
   * Fetch all bookings for a specific provider.
   */
  async getBookings(providerId: string): Promise<DashboardBooking[]> {
    // 1. Fetch raw bookings for the provider
    const bookingsResponse = await api.get<ApiResponse<DashboardBooking[]>>(
      `/api/bookings?providerId=${providerId}`
    );
    const bookings = bookingsResponse.data.data;

    // 2. Fetch all services to map details (like price and title)
    const servicesResponse = await api.get<ApiResponse<DashboardService[]>>(
      `/api/services?providerId=${providerId}`
    );
    const services = servicesResponse.data.data;

    // 3. Enrich bookings with service price and title for rendering
    return bookings.map((booking) => {
      const relatedService = services.find((s) => s.id === booking.serviceId);
      return {
        ...booking,
        serviceName: relatedService?.title || "Home Service",
        price: relatedService?.price || 0,
        // Fallback customer names for seed data
        customerName: booking.userId === "usr_1" ? "Fatima Al Mansoori" : "Valued Customer",
      };
    });
  },

  /**
   * Fetch all services for a specific provider.
   */
  async getServices(providerId: string): Promise<DashboardService[]> {
    const response = await api.get<ApiResponse<DashboardService[]>>(
      `/api/services?providerId=${providerId}`
    );
    return response.data.data;
  },

  /**
   * Register a new service offering.
   */
  async createService(data: {
    title: string;
    description: string;
    category: "PLUMBING" | "ELECTRICAL" | "CLEANING" | "SALON" | "CONSULTATION";
    price: number;
    providerId: string;
    isAvailable: boolean;
  }): Promise<DashboardService> {
    const response = await api.post<ApiResponse<DashboardService>>("/api/services", data);
    return response.data.data;
  },
};
