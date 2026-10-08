"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  User,
  Building,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import api from "@/lib/axios";

interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceTitle?: string;
  customerName?: string;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  address?: string;
  propertyType?: string;
  totalPrice?: number;
}

export function BookingsTab() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<string>("all");

  const loadBookings = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/bookings");
      const data = res.data?.data || [];
      setBookings(data);
    } catch (err) {
      console.warn("Failed to load provider bookings", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleUpdateStatus = async (id: string, newStatus: "CONFIRMED" | "COMPLETED" | "CANCELLED") => {
    try {
      await api.put(`/api/bookings/${id}`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status.toLowerCase() === filter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Booking Requests</h2>
          <p className="text-xs text-[var(--text-tertiary)]">
            Manage incoming appointment requests and update status for clients across UAE.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer",
                filter === st
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List / Loading State */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[var(--text-tertiary)] flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" size={18} />
          Loading incoming requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-2xl space-y-2">
          <Calendar size={32} className="mx-auto text-[var(--text-disabled)]" />
          <p className="text-sm font-bold text-[var(--text-primary)]">No bookings found</p>
          <p className="text-xs text-[var(--text-tertiary)] max-w-sm mx-auto">
            There are no booking requests under the selected filter at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {b.serviceTitle || "Home Service Request"}
                  </h3>
                  <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
                    <User size={12} />
                    {b.customerName || "Verified Customer"}
                  </p>
                </div>

                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border",
                    b.status === "CONFIRMED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                    b.status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200",
                    b.status === "COMPLETED" && "bg-purple-50 text-purple-700 border-purple-200",
                    b.status === "CANCELLED" && "bg-red-50 text-red-700 border-red-200"
                  )}
                >
                  {b.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                <p className="flex items-center gap-2">
                  <Clock size={13} className="text-emerald-600 shrink-0" />
                  <span>{new Date(b.scheduledAt).toLocaleString()}</span>
                </p>
                {b.address && (
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{b.address}</span>
                  </p>
                )}
                {b.propertyType && (
                  <p className="flex items-center gap-2">
                    <Building size={13} className="text-emerald-600 shrink-0" />
                    <span>{b.propertyType}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                <span className="text-xs font-extrabold text-navy-950">
                  {b.totalPrice ? formatCurrency(b.totalPrice) : "AED 150"}
                </span>

                <div className="flex items-center gap-2">
                  {b.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {b.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition cursor-pointer"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
