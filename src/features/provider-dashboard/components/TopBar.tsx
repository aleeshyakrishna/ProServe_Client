"use client";

import * as React from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  ChevronDown,
  Sparkles,
  PlusCircle,
  Building,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

// ------ TopBar Component ---------------------------------------------------

import { useAuthStore } from "@/features/auth/store/useAuthStore";

export function TopBar() {
  const {
    toggleMobileSidebar,
    searchQuery,
    setSearchQuery,
    setServiceModalOpen,
    setActiveTab,
  } = useDashboardStore();

  const { user, profile } = useAuthStore();
  const userName = user?.name || "Provider Admin";
  const workspaceName = profile?.fullName || user?.name || "Provider Workspace";

  const [activeWorkspace, setActiveWorkspace] = React.useState(workspaceName);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (workspaceName) {
      setActiveWorkspace(workspaceName);
    }
  }, [workspaceName]);

  const workspaces = [
    workspaceName,
    "AlSaif AC Maintenance",
    "AlSaif Handyman Dubai",
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-card)] px-6 backdrop-blur-md shadow-sm">
      {/* Left side: Hamburger button + Workspace Switcher */}
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Workspace Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer select-none"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/45 dark:text-emerald-400">
              <Building size={12} />
            </div>
            <span className="text-xs font-semibold tracking-tight text-[var(--text-primary)] max-w-[150px] truncate">
              {activeWorkspace}
            </span>
            <ChevronDown size={14} className="text-[var(--text-tertiary)]" />
          </button>

          {isWorkspaceMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsWorkspaceMenuOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-1.5 shadow-lg z-20 animate-fade-in">
                <div className="px-2 py-1 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Select Workspace
                </div>
                <div className="space-y-0.5 mt-1">
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace}
                      onClick={() => {
                        setActiveWorkspace(workspace);
                        setIsWorkspaceMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors",
                        activeWorkspace === workspace
                          ? "text-emerald-500 font-semibold"
                          : "text-[var(--text-secondary)]"
                      )}
                    >
                      {workspace}
                      {activeWorkspace === workspace && (
                        <CheckCircle size={12} className="text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-[var(--border-subtle)] mt-1.5 pt-1">
                  <button className="w-full text-left px-2.5 py-1.5 text-xs text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 rounded-lg flex items-center gap-1.5 transition-colors font-medium">
                    <PlusCircle size={14} />
                    Add Workspace
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle: Universal Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
        />
        <input
          type="text"
          placeholder="Quick search bookings, invoices, services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-10 pr-4 text-xs bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] focus:border-emerald-500 focus:bg-[var(--surface-card)] rounded-xl outline-none transition-all placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)]"
        />
      </div>

      {/* Right side: Actions, notifications, and profile card */}
      <div className="flex items-center gap-4">
        {/* Quick booking action shortcut */}
        <button
          onClick={() => setServiceModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white dark:bg-emerald-500 dark:text-white hover:opacity-90 rounded-xl text-xs font-semibold cursor-pointer shadow-sm shadow-navy-900/10"
        >
          <Sparkles size={14} />
          Create Service
        </button>

        {/* Notifications and Message centers */}
        <div className="flex items-center gap-1.5">
          {/* Chat shortcut */}
          <button
            onClick={() => setActiveTab("messages")}
            className="p-2 text-[var(--text-secondary)] hover:text-emerald-500 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors relative cursor-pointer"
            aria-label="Messages"
          >
            <MessageSquare size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[var(--surface-card)]" />
          </button>

          {/* Alerts Bell */}
          <button
            onClick={() => setActiveTab("bookings")}
            className="p-2 text-[var(--text-secondary)] hover:text-emerald-500 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-[var(--surface-card)] animate-pulse" />
          </button>
        </div>

        {/* User profile dropdown info */}
        <div className="flex items-center gap-2 border-l border-[var(--border-subtle)] pl-4">
          <Avatar alt={userName} name={userName} size="sm" />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">{userName}</span>
            <span className="text-[10px] text-[var(--text-tertiary)] leading-none mt-0.5">Partner</span>
          </div>
        </div>
      </div>
    </header>
  );
}
