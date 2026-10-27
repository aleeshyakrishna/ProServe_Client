import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { makeService } from "@/test-utils/fixtures";

const replace = vi.fn();
let params = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => params,
  useRouter: () => ({ replace }),
  usePathname: () => "/services",
}));

import { useServiceFilters } from "@/hooks/useServiceFilters";

const services = [
  makeService({ id: "1", title: "Deep Home Cleaning", description: "Full apartment clean", slug: "cleaning", location: "Dubai Marina, Dubai" }),
  makeService({ id: "2", title: "AC Repair", description: "Split AC service", slug: "ac", location: "Al Nahda, Sharjah" }),
];

describe("useServiceFilters", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    replace.mockClear();
    params = new URLSearchParams();
  });
  afterEach(() => vi.useRealTimers());

  it("reads the initial filters from the URL", () => {
    params = new URLSearchParams("search=ac&category=ac&location=Sharjah");
    const { result } = renderHook(() => useServiceFilters(services));
    expect(result.current.searchQuery).toBe("ac");
    expect(result.current.selectedCategory).toBe("ac");
    expect(result.current.selectedLocation).toBe("Sharjah");
    expect(result.current.filteredServices.map((s) => s.id)).toEqual(["2"]);
  });

  it("filters instantly but writes search to the URL only once typing stops", () => {
    const { result } = renderHook(() => useServiceFilters(services));

    act(() => result.current.handleQueryChange("c"));
    act(() => vi.advanceTimersByTime(100));
    act(() => result.current.handleQueryChange("cle"));
    expect(result.current.filteredServices.map((s) => s.id)).toEqual(["1"]);
    expect(replace).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(300));
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/services?search=cle", { scroll: false });
  });

  it("writes category and location to the URL immediately", () => {
    const { result } = renderHook(() => useServiceFilters(services));
    act(() => result.current.handleCategoryChange("ac"));
    expect(replace).toHaveBeenLastCalledWith("/services?category=ac", { scroll: false });
  });

  it("clears every filter", () => {
    params = new URLSearchParams("search=ac&category=ac&location=Sharjah");
    const { result } = renderHook(() => useServiceFilters(services));
    act(() => result.current.handleClearAllFilters());
    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategory).toBe("all");
    expect(result.current.selectedLocation).toBe("all");
    expect(replace).toHaveBeenLastCalledWith("/services?", { scroll: false });
  });

  it("follows external URL changes without pushing the old search back", () => {
    params = new URLSearchParams("search=ac");
    const { result, rerender } = renderHook(() => useServiceFilters(services));

    params = new URLSearchParams("search=cleaning");
    rerender();
    expect(result.current.searchQuery).toBe("cleaning");

    act(() => vi.advanceTimersByTime(500));
    expect(replace).not.toHaveBeenCalled();
  });

  it("keeps letters typed while its own URL update is still arriving", () => {
    const { result, rerender } = renderHook(() => useServiceFilters(services));

    act(() => result.current.handleQueryChange("cle"));
    act(() => vi.advanceTimersByTime(300));
    expect(replace).toHaveBeenLastCalledWith("/services?search=cle", { scroll: false });

    // User keeps typing before the router hands back the new URL
    act(() => result.current.handleQueryChange("clea"));
    params = new URLSearchParams("search=cle");
    rerender();
    expect(result.current.searchQuery).toBe("clea");

    act(() => vi.advanceTimersByTime(300));
    expect(replace).toHaveBeenLastCalledWith("/services?search=clea", { scroll: false });
  });

  it("keeps a trailing space after the trimmed search is written to the URL", () => {
    const { result, rerender } = renderHook(() => useServiceFilters(services));

    act(() => result.current.handleQueryChange("deep "));
    act(() => vi.advanceTimersByTime(300));
    expect(replace).toHaveBeenLastCalledWith("/services?search=deep", { scroll: false });

    params = new URLSearchParams("search=deep");
    rerender();
    expect(result.current.searchQuery).toBe("deep ");
  });
});
