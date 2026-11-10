import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as React from "react";
import { MobileFilterModal } from "../MobileFilterModal";

afterEach(() => {
  cleanup();
});

const mockCategories = [
  { id: "cat-1", name: "Cleaning", slug: "cleaning", serviceCount: 10 },
  { id: "cat-2", name: "Plumbing", slug: "plumbing", serviceCount: 5 },
];

const mockLocations = [
  { value: "all", label: "All Cities / Areas" },
  { value: "Dubai", label: "Dubai" },
];

const mockSortOptions = [
  { value: "popular", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
];

describe("MobileFilterModal", () => {
  it("does not render when isOpen is false", () => {
    render(
      <MobileFilterModal
        isOpen={false}
        onClose={vi.fn()}
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={vi.fn()}
        locations={mockLocations}
        selectedLocation="all"
        onLocationChange={vi.fn()}
        sortOptions={mockSortOptions}
        sortBy="popular"
        onSortChange={vi.fn()}
        hasActiveFilters={false}
        onReset={vi.fn()}
      />
    );

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders all sections when isOpen is true", () => {
    render(
      <MobileFilterModal
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={vi.fn()}
        allCategoryCount={15}
        locations={mockLocations}
        selectedLocation="all"
        onLocationChange={vi.fn()}
        sortOptions={mockSortOptions}
        sortBy="popular"
        onSortChange={vi.fn()}
        hasActiveFilters={true}
        onReset={vi.fn()}
        resultCount={8}
      />
    );

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Filters")).toBeDefined();
    expect(screen.getByText("Cleaning")).toBeDefined();
    expect(screen.getByText("Plumbing")).toBeDefined();
    expect(screen.getByText("Reset All")).toBeDefined();
    expect(screen.getByText("Apply")).toBeDefined();
  });

  it("calls onClose when the close button or apply button is clicked", () => {
    const onClose = vi.fn();
    render(
      <MobileFilterModal
        isOpen={true}
        onClose={onClose}
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={vi.fn()}
        locations={mockLocations}
        selectedLocation="all"
        onLocationChange={vi.fn()}
        sortOptions={mockSortOptions}
        sortBy="popular"
        onSortChange={vi.fn()}
        hasActiveFilters={false}
        onReset={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Close filters dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /Apply/i }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("calls onCategoryChange when a category is tapped", () => {
    const onCategoryChange = vi.fn();
    render(
      <MobileFilterModal
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        selectedCategory="all"
        onCategoryChange={onCategoryChange}
        locations={mockLocations}
        selectedLocation="all"
        onLocationChange={vi.fn()}
        sortOptions={mockSortOptions}
        sortBy="popular"
        onSortChange={vi.fn()}
        hasActiveFilters={false}
        onReset={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cleaning"));
    expect(onCategoryChange).toHaveBeenCalledWith("cleaning");
  });

  it("calls onReset when Reset All is clicked", () => {
    const onReset = vi.fn();
    render(
      <MobileFilterModal
        isOpen={true}
        onClose={vi.fn()}
        categories={mockCategories}
        selectedCategory="cleaning"
        onCategoryChange={vi.fn()}
        locations={mockLocations}
        selectedLocation="all"
        onLocationChange={vi.fn()}
        sortOptions={mockSortOptions}
        sortBy="popular"
        onSortChange={vi.fn()}
        hasActiveFilters={true}
        onReset={onReset}
      />
    );

    fireEvent.click(screen.getByText("Reset All"));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
