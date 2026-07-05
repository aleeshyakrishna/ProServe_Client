import { create } from "zustand";

export type DashboardTab =
  | "overview"
  | "bookings"
  | "services"
  | "calendar"
  | "messages"
  | "analytics"
  | "reviews"
  | "wallet"
  | "team"
  | "settings"
  | "create-service"
  | "categories";

interface DashboardState {
  activeTab: DashboardTab;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  searchQuery: string;
  isServiceModalOpen: boolean;
  setActiveTab: (tab: DashboardTab) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setServiceModalOpen: (open: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: "overview",
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  searchQuery: "",
  isServiceModalOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab, isMobileSidebarOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setServiceModalOpen: (open) => set({ isServiceModalOpen: open }),
}));
