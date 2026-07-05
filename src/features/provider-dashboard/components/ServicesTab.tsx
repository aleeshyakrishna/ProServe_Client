"use client";

import * as React from "react";
import { useProviderDataStore } from "../store/useProviderDataStore";
import { useDashboardStore } from "../store/useDashboardStore";
import { Plus, Check, X, Tag, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CreateServiceForm } from "./CreateServiceForm";

export function ServicesTab() {
  const { services, isLoading } = useProviderDataStore();
  const { setActiveTab } = useDashboardStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CLEANING":
        return "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400";
      case "PLUMBING":
        return "bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400";
      case "ELECTRICAL":
        return "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400";
      default:
        return "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="h-8 w-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Tab Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Service Catalog
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Configure active listings, set pricing tiers, and toggle availability.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus size={14} />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-[var(--border-subtle)] rounded-3xl p-8 text-center bg-[var(--surface-card)]">
          <div className="h-12 w-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-tertiary)] mb-3">
            <Tag size={20} />
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)] mb-1">No services registered</span>
          <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed mb-4">
            You haven't added any services yet. Create your first service listing to start receiving bookings.
          </p>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm">
            List First Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} hover className="flex flex-col justify-between select-none">
              <div>
                <CardHeader className="pb-3 border-b border-[var(--border-subtle)] flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                      {service.title}
                    </CardTitle>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[9px] font-bold tracking-wider ${getCategoryColor(
                        service.category
                      )}`}
                    >
                      {service.category}
                    </span>
                  </div>
                  
                  {/* Availability Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wide ${
                      service.isAvailable
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
                        : "bg-neutral-50 border-neutral-100 text-neutral-500 dark:bg-neutral-900/40 dark:border-neutral-800/40"
                    }`}
                  >
                    {service.isAvailable ? (
                      <>
                        <Check size={10} className="stroke-[3]" />
                        Active
                      </>
                    ) : (
                      <>
                        <X size={10} className="stroke-[3]" />
                        Paused
                      </>
                    )}
                  </span>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </CardContent>
              </div>

              <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-between mt-4 rounded-b-2xl">
                <span className="text-xs text-[var(--text-tertiary)]">
                  Base rate:{" "}
                  <strong className="text-sm font-extrabold text-[var(--text-primary)]">
                    AED {service.price}
                  </strong>
                </span>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" className="hover:text-emerald-500">
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="hover:text-error-500">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Service Modal Overlay */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Service Listing"
        description="Register a new service offering to start receiving bookings across the UAE."
      >
        <CreateServiceForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
