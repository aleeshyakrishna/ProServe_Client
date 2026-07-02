"use client";

import * as React from "react";
import { useDashboardStore } from "@/features/provider-dashboard/store/useDashboardStore";
import { OverviewTab } from "@/features/provider-dashboard/components/OverviewTab";
import { CreateServiceForm } from "@/features/provider-dashboard/components/CreateServiceForm";
import { ServicesTab } from "@/features/provider-dashboard/components/ServicesTab";

// ------ Tab Content Controller ----------------------------------------------

export default function ProviderDashboardPage() {
  const { activeTab } = useDashboardStore();

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      
      case "create-service":
        return <CreateServiceForm />;
      
      case "bookings":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)] animate-fade-in">
            <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">Bookings Module</span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              This module will host active, upcoming, completed, and priority emergency booking cards, alongside schedule routing filters.
            </p>
          </div>
        );

      case "services":
        return <ServicesTab />;

      case "calendar":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)] animate-fade-in">
            <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">Interactive Scheduler</span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Configure weekly working hours, mark vacation dates, block specific slots, and coordinate staff assignments.
            </p>
          </div>
        );

      case "messages":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)] animate-fade-in">
            <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">Live Inbox</span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Initiate direct conversations with clients, request photo attachments of repair sites, and exchange live instructions.
            </p>
          </div>
        );

      case "analytics":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)] animate-fade-in">
            <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">Business Analytics</span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Monitor monthly revenue trends, service distribution counts, customer retention stats, and peak booking window graphs.
            </p>
          </div>
        );

      case "reviews":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)] animate-fade-in">
            <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">Reviews & Feedback</span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Browse recent verified platform reviews, respond to customer inputs, and study satisfaction ratings.
            </p>
          </div>
        );

      case "wallet":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)] animate-fade-in">
            <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">SaaS Wallet & Invoicing</span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Initiate instant banking payouts, track transaction history logs, process partial refunds, and configure VAT invoices.
            </p>
          </div>
        );

      case "team":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)] animate-fade-in">
            <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">Team & Employee Directory</span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Add staff profiles, track individual completion ratings, allocate schedules, and assign bookings.
            </p>
          </div>
        );

      case "settings":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)] animate-fade-in">
            <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">Operating Configuration</span>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Customize trading details, upload municipal licensing certifications, edit banking logs, and configure security.
            </p>
          </div>
        );

      default:
        return <OverviewTab />;
    }
  };

  return <>{renderTabContent()}</>;
}
