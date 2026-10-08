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

export function BookingProvider({ children }: { children: React.ReactNode }) {
  // Purely in-memory booking state — zero localStorage storage
  const [booking, setBooking] = React.useState<BookingState>(DEFAULT_BOOKING_STATE);

  const updateBooking = React.useCallback((updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  }, []);

  const setStep = React.useCallback((step: number) => {
    setBooking((prev) => ({ ...prev, step }));
  }, []);

  const resetBooking = React.useCallback(() => {
    setBooking(DEFAULT_BOOKING_STATE);
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
