// ============================================================
// DOMAIN TYPES — ProServe Platform
// ============================================================

// ------ User & Auth ----------------------------------------

export type UserRole = "customer" | "provider" | "admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  phone: string | null;
  createdAt: string;
}

// ------ Service Category -----------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  serviceCount: number;
  imageUrl: string | null;
}

// ------ Provider -------------------------------------------

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  tagline: string;
  bio: string;
  avatarUrl: string | null;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  isVerified: boolean;
  isFeatured: boolean;
  categories: Category[];
  location: string;
  joinedAt: string;
}

// ------ Service --------------------------------------------

export interface Service {
  id: string;
  providerId: string;
  provider: Pick<Provider, "id" | "businessName" | "avatarUrl" | "rating" | "reviewCount" | "isVerified">;
  categoryId: string;
  category: Pick<Category, "id" | "name" | "slug">;
  title: string;
  description: string;
  imageUrl: string | null;
  priceFrom: number;
  priceTo: number | null;
  pricingType: "fixed" | "hourly" | "quoted";
  currency: string;
  duration: string | null;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// ------ Booking --------------------------------------------

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Booking {
  id: string;
  serviceId: string;
  service: Pick<Service, "id" | "title" | "imageUrl" | "pricingType">;
  customerId: string;
  customer: Pick<User, "id" | "fullName" | "avatarUrl">;
  providerId: string;
  provider: Pick<Provider, "id" | "businessName" | "avatarUrl">;
  status: BookingStatus;
  scheduledAt: string;
  completedAt: string | null;
  totalAmount: number;
  currency: string;
  notes: string | null;
  address: string;
  propertyType?: string | null;
  timeSlot?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
}

// ------ Review ---------------------------------------------

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customer: Pick<User, "id" | "fullName" | "avatarUrl">;
  providerId: string;
  serviceId: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

// ------ Notification ---------------------------------------

export type NotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "message_received"
  | "review_posted"
  | "payment_received"
  | "provider_verified";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

// ------ API Response Wrappers ------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
