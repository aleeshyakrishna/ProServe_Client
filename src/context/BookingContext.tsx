"use client";

import * as React from "react";
import type { Service, Provider } from "@/types";

export interface BookingState {
  step: number;
  serviceId: string;
  service: Service | null;
  providerId: string;
  provider: Provider | null;
  propertyType: string;
  address: string;
  city: string;
  scheduledDate: string;
  timeSlot: string;
  notes: string;
  paymentMethod: string;
}

interface BookingContextType {
  booking: BookingState;
  updateBooking: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;
  setStep: (step: number) => void;
}

const DEFAULT_BOOKING_STATE: BookingState = {
  step: 1,
  serviceId: "",
  service: null,
  providerId: "",
  provider: null,
  propertyType: "Apartment / Flat",
  address: "",
  city: "Dubai",
  scheduledDate: "",
  timeSlot: "Morning (08:00 AM - 12:00 PM)",
  notes: "",
  paymentMethod: "cash_after_service",
};

const BookingContext = React.createContext<BookingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "proserve_booking_draft";

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = React.useState<BookingState>(DEFAULT_BOOKING_STATE);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load draft from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setBooking((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("Failed to load booking draft from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when booking state changes
  React.useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(booking));
    } catch (e) {
      console.warn("Failed to save booking draft to localStorage", e);
    }
  }, [booking, isInitialized]);

  const updateBooking = React.useCallback((updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  }, []);

  const setStep = React.useCallback((step: number) => {
    setBooking((prev) => ({ ...prev, step }));
  }, []);

  const resetBooking = React.useCallback(() => {
    setBooking(DEFAULT_BOOKING_STATE);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear booking draft", e);
    }
  }, []);

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking, setStep }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = React.useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
