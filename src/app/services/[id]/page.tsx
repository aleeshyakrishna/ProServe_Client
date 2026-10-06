"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import api from "@/lib/axios";
import { AuthService } from "@/services/auth.service";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  ChevronLeft,
  Loader2,
  AlertCircle,
  CreditCard,
  Building,
  User,
  Sparkles,
} from "lucide-react";

interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  providerId: string;
  isAvailable: boolean;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  // Data States
  const [service, setService] = React.useState<ServiceDetail | null>(null);
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Booking Form States
  const [scheduledDate, setScheduledDate] = React.useState<string>("");
  const [scheduledTime, setScheduledTime] = React.useState<string>("10:00");
  const [address, setAddress] = React.useState<string>("Downtown Dubai, Apt 1204");
  const [notes, setNotes] = React.useState<string>("");
  
  // Submission States
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = React.useState<boolean>(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch current authenticated user
        const currentUser = await AuthService.getMe().catch(() => null);
        if (currentUser) {
          setUser(currentUser);
        }

        // 2. Fetch service details from backend
        if (serviceId) {
          const res = await api.get(`/api/services/${serviceId}`).catch(() => null);
          if (res?.data?.data) {
            setService(res.data.data);
          } else {
            // Fallback mock service if server ID is dynamic test string
            setService({
              id: serviceId,
              title: "Professional Home Cleaning & Disinfection",
              description: "Deep home cleaning using eco-friendly products, duct sanitization, and surface polishing by certified UAE specialists.",
              category: "CLEANING",
              price: 250,
              providerId: "prov_default",
              isAvailable: true,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load service detail:", err);
        setError("Could not load service details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split("T")[0]);

    loadData();
  }, [serviceId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!user) {
      router.push(`/login?redirect=/services/${serviceId}`);
      return;
    }

    if (!scheduledDate) {
      setBookingError("Please select a valid date for your service.");
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`);
      
      const payload = {
        userId: user.user?.id || user.id,
        serviceId: service?.id || serviceId,
        scheduledAt: scheduledDateTime.toISOString(),
        status: "CONFIRMED",
      };

      await api.post("/api/bookings", payload);

      setBookingSuccess(true);
    } catch (err: any) {
      console.error("Booking error:", err);
      setBookingError(
        err?.message || "Failed to confirm booking. Please choose a different date/time."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background-default,#0b1120)] text-[var(--text-primary,#f8fafc)] font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:mt-16 space-y-8">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ChevronLeft size={16} />
            <span>Back to All Services</span>
          </Link>
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck size={14} />
            <span>Verified UAE Pro</span>
          </span>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Loader2 className="animate-spin text-emerald-400" size={32} />
            <p className="text-sm text-slate-400">Loading service details...</p>
          </div>
        ) : service ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2 Cols): Service Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {service.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <strong className="text-white">4.9</strong> (124 reviews)
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    {service.title}
                  </h1>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 block">Service Fee</span>
                    <span className="text-lg font-bold text-white">AED {service.price}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 block">Duration</span>
                    <span className="text-sm font-semibold text-slate-200">1 - 2 Hours</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                    <span className="text-slate-400 block">Availability</span>
                    <span className="text-sm font-semibold text-emerald-400">Available Today</span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-400" />
                    <span>What's Included</span>
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Certified & Background Checked Pro</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>All Required Tools & Equipment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>100% Satisfaction Warranty</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Property Damage Coverage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column (1 Col): Dynamic Booking Form */}
            <div className="space-y-6">
              
              {bookingSuccess ? (
                <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-5 text-center shadow-2xl animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Booking Confirmed! 🎉</h2>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Your service appointment has been scheduled successfully. Our professional will contact you prior to arrival.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/customer/dashboard"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
                    >
                      <span>Go to Customer Dashboard</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleBooking}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Calendar size={18} className="text-emerald-400" />
                      <span>Book Appointment</span>
                    </h2>
                    <span className="text-xs font-extrabold text-emerald-400">
                      AED {service.price}
                    </span>
                  </div>

                  {bookingError && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Scheduled Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Calendar size={14} className="text-emerald-400" />
                      <span>Select Date</span>
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Scheduled Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock size={14} className="text-emerald-400" />
                      <span>Select Preferred Time Slot</span>
                    </label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="09:00">09:00 AM - 11:00 AM</option>
                      <option value="11:00">11:00 AM - 01:00 PM</option>
                      <option value="14:00">02:00 PM - 04:00 PM</option>
                      <option value="16:00">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <MapPin size={14} className="text-emerald-400" />
                      <span>Service Location</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Downtown Dubai, Villa 14"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Price Summary Breakdown */}
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Base Service Fee</span>
                      <span>AED {service.price}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Platform & VAT (5%)</span>
                      <span>AED {Math.round(service.price * 0.05)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold border-t border-slate-700/60 pt-2 text-sm">
                      <span>Total Amount</span>
                      <span className="text-emerald-400">AED {service.price + Math.round(service.price * 0.05)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Confirming Booking...</span>
                      </>
                    ) : (
                      <span>Confirm & Book Now</span>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <h2 className="text-xl font-bold text-white">Service Not Found</h2>
            <p className="text-xs text-slate-400">The service you requested is currently unavailable or was removed.</p>
            <Link
              href="/services"
              className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
            >
              Browse Services
            </Link>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
