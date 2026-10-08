"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { NAV_LINKS, APP_NAME } from "@/constants";
import { tokenStorage } from "@/lib/axios";
import { AuthService } from "@/services/auth.service";

// ------ Hook: track scroll position for navbar transparency --

function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return scrolled;
}

// ------ Logo ------------------------------------------------

function NavLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-md"
      aria-label={`${APP_NAME} — go to homepage`}
    >
      {/* Mark */}
      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-navy-900">
        <span className="text-white font-bold text-sm tracking-tight" aria-hidden="true">P</span>
      </div>
      {/* Wordmark */}
      <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight leading-none">
        Pro<span className="text-emerald-500">Serve</span>
      </span>
    </Link>
  );
}

// ------ Desktop Nav Links -----------------------------------

interface NavLinksProps {
  pathname: string;
}

function DesktopNavLinks({ pathname }: NavLinksProps) {
  return (
    <nav aria-label="Primary navigation">
      <ul className="flex items-center gap-1" role="list">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700",
                  isActive
                    ? "text-navy-900 bg-navy-50"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ------ User Interface --------------------------------------

interface UserState {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// ------ Navbar Actions (CTA buttons vs Profile Dropdown) ----

interface NavActionsProps {
  user: UserState | null;
  isLoggedIn: boolean;
  onLogout: () => void;
}

function NavActions({ user, isLoggedIn, onLogout }: NavActionsProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dashboardHref =
    user?.role === "SERVICE_PROVIDER" || user?.role === "PROVIDER"
      ? "/provider/dashboard"
      : "/customer/dashboard";

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {/* User Profile Button */}
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[var(--surface-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-navy-700 shadow-sm"
          aria-expanded={dropdownOpen}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/40"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
            </div>
          )}
          <span className="text-xs font-semibold text-[var(--text-primary)] max-w-[120px] truncate">
            {user?.name || "Account"}
          </span>
          <ChevronDown size={14} className={cn("text-[var(--text-tertiary)] transition-transform duration-200", dropdownOpen && "rotate-180")} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-2xl p-2 z-50 animate-fade-in space-y-1">
            <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-[11px] text-[var(--text-tertiary)] truncate">{user?.email}</p>
            </div>

            <Link
              href={dashboardHref}
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition"
            >
              <LayoutDashboard size={15} className="text-emerald-500" />
              <span>Dashboard</span>
            </Link>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search services"
        className="hidden md:inline-flex"
      >
        <Search size={18} />
      </Button>

      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
      >
        Sign in
      </Link>

      <Link
        href="/register"
        className={cn(buttonVariants({ variant: "primary", size: "md" }))}
      >
        Get started
      </Link>
    </div>
  );
}

// ------ Mobile Menu -----------------------------------------

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  isLoggedIn: boolean;
  user: UserState | null;
  onLogout: () => void;
}

function MobileMenu({ isOpen, onClose, pathname, isLoggedIn, user, onLogout }: MobileMenuProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const dashboardHref =
    user?.role === "SERVICE_PROVIDER" || user?.role === "PROVIDER"
      ? "/provider/dashboard"
      : "/customer/dashboard";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative ml-auto h-full w-80 max-w-full bg-[var(--surface-card)] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)]">
          <NavLogo />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Badge if logged in */}
        {isLoggedIn && user && (
          <div className="p-4 mx-4 mt-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-[11px] text-[var(--text-tertiary)] truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Links */}
        <nav className="flex-1 p-5 space-y-1" aria-label="Mobile navigation links">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "text-navy-900 bg-navy-50 font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {isLoggedIn && (
            <Link
              href={dashboardHref}
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-600 bg-emerald-500/10 transition mt-2"
            >
              <LayoutDashboard size={18} />
              <span>Go to Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Footer actions */}
        <div className="p-5 border-t border-[var(--border-subtle)] space-y-3 flex flex-col">
          {isLoggedIn ? (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold border border-rose-500/20 transition"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full text-center")}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full text-center")}
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ------ Navbar Root -----------------------------------------

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<UserState | null>(null);

  React.useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      AuthService.getMe()
        .then((res) => {
          if (res && (res.id || res.email || res.name || res.profile)) {
            setIsLoggedIn(true);
            setUser({
              name: res.profile?.fullName || res.name || res.user?.name || res.email?.split("@")[0] || "Customer",
              email: res.email || res.user?.email || "",
              role: res.roles?.[0] || res.role || res.user?.role || "CUSTOMER",
              avatar: res.profile?.avatar,
            });
          } else {
            // Token is invalid / user not found -> Logout
            tokenStorage.clear();
            setIsLoggedIn(false);
            setUser(null);
          }
        })
        .catch(() => {
          // Token expired or invalid session -> Logout
          tokenStorage.clear();
          setIsLoggedIn(false);
          setUser(null);
        });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch {
      tokenStorage.clear();
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          scrolled
            ? "bg-[var(--surface-card)]/95 backdrop-blur-md shadow-sm border-b border-[var(--border-subtle)]"
            : "bg-transparent"
        )}
        role="banner"
      >
        <div className="container-section">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Left: Logo */}
            <NavLogo />

            {/* Center: Desktop Nav */}
            <div className="hidden lg:flex">
              <DesktopNavLinks pathname={pathname} />
            </div>

            {/* Right: Actions */}
            <div className="hidden lg:flex">
              <NavActions user={user} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            </div>

            {/* Mobile: Hamburger */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
              )}
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
