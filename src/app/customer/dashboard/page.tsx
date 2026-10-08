"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthService } from "@/services/auth.service";
import api from "@/lib/axios";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Search,
  Star,
  Zap,
  Sparkles,
  Droplets,
  Wrench,
  Scissors,
  UserCheck,
  CreditCard,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/axios";

interface UserProfile {
  fullName?: string;
  phone?: string;
  city?: string;
  avatar?: string;
}

interface UserData {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  profile?: UserProfile;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
}

interface BookingItem {
  id: string;
  serviceTitle?: string;
  providerName?: string;
  scheduledAt?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  price?: number;
  address?: string;
}

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  CLEANING: Sparkles,
  PLUMBING: Droplets,
  ELECTRICAL: Zap,
  SALON: Scissors,
  CONSULTATION: Wrench,
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [bookings, setBookings] = React.useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      setError(null);

      const token = tokenStorage.getAccessToken();
      if (!token) {
        tokenStorage.clear();
        router.push("/login");
        return;
      }

      try {
        // 1. Fetch current logged-in user profile
        const userRes = await AuthService.getMe();
        if (userRes && (userRes.id || userRes.email || userRes.name || userRes.user)) {
          setUserData(userRes);
        } else {
          // Unauthenticated or invalid token -> Logout & redirect to login
          tokenStorage.clear();
          router.push("/login");
          return;
        }

        // 2. Fetch active categories
        const catRes = await api.get("/api/categories").catch(() => null);
        if (catRes?.data?.data) {
          setCategories(catRes.data.data);
        }

        // 3. Fetch user bookings
        const bookingRes = await api.get("/api/bookings").catch(() => null);
        if (bookingRes?.data?.data) {
          setBookings(bookingRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load customer dashboard data:", err);
        tokenStorage.clear();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  // Derived Dynamic Calculations
  const displayName =
    userData?.profile?.fullName ||
    userData?.name ||
    userData?.user?.name ||
    userData?.email?.split("@")[0] ||
    "Valued Customer";
  const displayCity = userData?.profile?.city || "Dubai, UAE";
  const userAvatar =
    userData?.profile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff&size=150`;

  const activeBookings = bookings.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const totalSpent = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background-default,#0b1120)] text-[var(--text-primary,#f8fafc)] font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:mt-16">
        
        {/* Error Alert Callout */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ------ Top Welcome Banner (Dynamic) ---------------------------------- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              {isLoading ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 animate-pulse" />
              ) : (
                <div className="relative">
                  <img
                    src={userAvatar}
                    alt={displayName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-lg"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-slate-950 stroke-[3]" />
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {isLoading ? (
                      <span className="inline-block w-48 h-8 bg-slate-800 rounded animate-pulse" />
                    ) : (
                      `Welcome back, ${displayName}! 👋`
                    )}
                  </h1>
                </div>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-400" />
                  <span>{displayCity}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-medium">Verified Customer</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                <Plus size={18} className="stroke-[2.5]" />
                <span>Book New Service</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium text-sm border border-slate-700/60 transition-all duration-200"
              >
                <Search size={16} />
                <span>Browse Pros</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ------ Dynamic Stats Grid ------------------------------------------ */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Bookings</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Calendar size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {isLoading ? <Loader2 className="animate-spin text-slate-500" size={24} /> : activeBookings.length}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Scheduled</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Spent</span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <CreditCard size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-medium">AED</span>
              <span className="text-3xl font-extrabold text-white">
                {isLoading ? <Loader2 className="animate-spin text-slate-500" size={24} /> : totalSpent}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {isLoading ? <Loader2 className="animate-spin text-slate-500" size={24} /> : completedBookings.length}
              </span>
              <span className="text-xs text-purple-400 font-medium">Jobs done</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md hover:border-emerald-500/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Star size={18} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {isLoading ? <Loader2 className="animate-spin text-slate-500" size={24} /> : categories.length || 5}
              </span>
              <span className="text-xs text-amber-400 font-medium">Available</span>
            </div>
          </div>
        </section>

        {/* ------ Main 2-Column Content ------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Active & Upcoming Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar size={20} className="text-emerald-400" />
                  <span>Upcoming Service Appointments</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Track and manage your scheduled services across the UAE</p>
              </div>
              <Link
                href="/services"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Bookings List / Empty State */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-emerald-400" size={20} />
                  <span className="text-xs text-slate-400 font-medium">Fetching active appointments...</span>
                </div>
              ) : activeBookings.length > 0 ? (
                activeBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all duration-200 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white text-base leading-snug">
                          {booking.serviceTitle || "Professional Service Booking"}
                        </h3>
                        <p className="text-xs text-emerald-400 font-medium mt-0.5">
                          {booking.providerName || "Verified ProServe Specialist"}
                        </p>
                      </div>
                      
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <span>{booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "Date TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{booking.address || displayCity}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center space-y-3">
                  <div className="p-3 rounded-full bg-slate-800/80 text-slate-400">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">No active bookings scheduled</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Need a home cleaning, electrical repair, or plumbing fix? Explore our verified professionals.
                    </p>
                  </div>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-lg shadow-emerald-500/20 mt-2"
                  >
                    <Plus size={14} />
                    <span>Explore Services</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Dynamic Category Quick Shortcuts */}
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-300">Explore Service Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.length > 0 ? (
                  categories.map((cat) => {
                    const IconComponent = CATEGORY_ICON_MAP[cat.name] || Sparkles;
                    return (
                      <Link
                        key={cat.id || cat.slug}
                        href={`/services?category=${cat.slug}`}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all duration-150 group"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                          <IconComponent size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white capitalize">
                          {cat.name.toLowerCase()}
                        </span>
                      </Link>
                    );
                  })
                ) : (
                  <>
                    <Link href="/services" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition">
                      <Sparkles size={16} className="text-cyan-400" />
                      <span className="text-xs font-semibold text-slate-200">Cleaning</span>
                    </Link>
                    <Link href="/services" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition">
                      <Droplets size={16} className="text-blue-400" />
                      <span className="text-xs font-semibold text-slate-200">Plumbing</span>
                    </Link>
                    <Link href="/services" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition">
                      <Zap size={16} className="text-amber-400" />
                      <span className="text-xs font-semibold text-slate-200">Electrical</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Protection & Recent History */}
          <div className="space-y-6">
            
            {/* Protection Shield Card */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <ShieldCheck size={22} className="stroke-[2.2]" />
                <h3 className="font-bold text-sm text-white">ProServe Protection</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All services booked through ProServe are backed by our 100% Satisfaction Guarantee and AED 10,000 property protection cover.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <UserCheck size={14} />
                  <span>100% Background Checked Pros</span>
                </span>
              </div>
            </div>

            {/* Recent History Widget */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400" />
                  <span>Recent History</span>
                </h3>
                <span className="text-xs text-slate-500">Past Bookings</span>
              </div>

              {completedBookings.length > 0 ? (
                <div className="space-y-3.5">
                  {completedBookings.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-start justify-between text-xs gap-3">
                      <div>
                        <p className="font-medium text-slate-200 line-clamp-1">{item.serviceTitle || "Completed Service"}</p>
                        <p className="text-slate-500 mt-0.5">{item.providerName || "Verified Pro"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-white">AED {item.price || 0}</p>
                        <span className="text-[10px] font-semibold text-emerald-400">COMPLETED</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No completed service history yet.</p>
              )}
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
