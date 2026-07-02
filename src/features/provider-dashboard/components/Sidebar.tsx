"use client";

import * as React from "react";
import { useDashboardStore, type DashboardTab } from "../store/useDashboardStore";
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Tag,
  Calendar as CalendarIcon,
  MessageSquare,
  Star,
  Wallet,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

// ------ Navigation Items ---------------------------------------------------

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: ClipboardList },
  { id: "services", label: "Services", icon: Wrench },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "calendar", label: "Calendar", icon: CalendarIcon },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "wallet", label: "Wallet & Payments", icon: Wallet },
  { id: "team", label: "Team Members", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

// ------ Sidebar Component --------------------------------------------------

export function Sidebar() {
  const router = useRouter();
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
  } = useDashboardStore();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-950 text-white border-r border-navy-900/50 relative">
      {/* 1. Header: Branding / Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-navy-900/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500 shrink-0 shadow-md shadow-emerald-500/20">
            <span className="font-extrabold text-sm text-white">P</span>
          </div>
          <AnimatePresence initial={false}>
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg text-white tracking-tight whitespace-nowrap"
              >
                Pro<span className="text-emerald-400">Serve</span>
                <span className="ml-1.5 text-[9px] font-semibold text-navy-400 bg-navy-900 px-1.5 py-0.5 rounded border border-navy-800 uppercase tracking-widest">
                  PRO
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden text-navy-300 hover:text-white p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. Navigation items list */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group text-left relative",
                isActive
                  ? "bg-emerald-500 text-white font-medium shadow-md shadow-emerald-500/10"
                  : "text-navy-300 hover:bg-navy-900/60 hover:text-white"
              )}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-white" : "text-navy-400 group-hover:text-emerald-400"
                )}
              />
              
              <AnimatePresence initial={false}>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm tracking-tight whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* 3. Footer: User actions & Toggle */}
      <div className="p-4 border-t border-navy-900/40 space-y-2">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-navy-300 hover:bg-navy-900/60 hover:text-white transition-all group text-left"
          )}
          title={isSidebarCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5 text-navy-400 group-hover:text-error-500 shrink-0" />
          {!isSidebarCollapsed && (
            <span className="text-sm tracking-tight whitespace-nowrap">Sign Out</span>
          )}
        </button>

        {/* Toggle Collapse Button (hidden on mobile) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl bg-navy-900/30 hover:bg-navy-900/80 text-navy-400 hover:text-white transition-colors"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left-positioned persistent layout) */}
      <aside
        className={cn(
          "hidden lg:block h-screen fixed left-0 top-0 z-20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black z-30"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer (Slide overlay) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="lg:hidden fixed top-0 bottom-0 left-0 w-64 z-40 h-full"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
