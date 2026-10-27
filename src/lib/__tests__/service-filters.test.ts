import { describe, it, expect } from "vitest";
import { filterServices, getAvailableLocations } from "@/lib/service-filters";
import { makeService } from "@/test-utils/fixtures";

const services = [
  makeService({ id: "1", title: "Deep Home Cleaning", description: "Full apartment clean", slug: "cleaning", priceFrom: 200, rating: 4.5, location: "Dubai Marina, Dubai" }),
  makeService({ id: "2", title: "AC Repair", description: "Split AC service", slug: "ac", priceFrom: 150, rating: 4.9, location: "Al Nahda, Sharjah" }),
  makeService({ id: "3", title: "Pipe Fixing", description: "Leak repair", slug: "plumbing", priceFrom: 300, rating: 4.2, location: "Khalifa City, Abu Dhabi, UAE" }),
];

const base = { query: "", category: "all", location: "all", sortBy: "popular" };
const ids = (list: { id: string }[]) => list.map((s) => s.id);

describe("filterServices", () => {
  it("returns everything with default filters and keeps original order", () => {
    expect(ids(filterServices(services, base))).toEqual(["1", "2", "3"]);
  });

  it("filters by category slug, case-insensitively", () => {
    expect(ids(filterServices(services, { ...base, category: "AC" }))).toEqual(["2"]);
  });

  it("filters by provider location", () => {
    expect(ids(filterServices(services, { ...base, location: "Sharjah" }))).toEqual(["2"]);
  });

  it("matches search text in title or description and ignores extra spaces", () => {
    expect(ids(filterServices(services, { ...base, query: "  repair " }))).toEqual(["2", "3"]);
  });

  it("combines filters", () => {
    expect(ids(filterServices(services, { ...base, query: "repair", location: "Abu Dhabi" }))).toEqual(["3"]);
  });

  it("sorts by price and rating", () => {
    expect(ids(filterServices(services, { ...base, sortBy: "price_asc" }))).toEqual(["2", "1", "3"]);
    expect(ids(filterServices(services, { ...base, sortBy: "price_desc" }))).toEqual(["3", "1", "2"]);
    expect(ids(filterServices(services, { ...base, sortBy: "rating" }))).toEqual(["2", "1", "3"]);
  });

  it("does not mutate the input array", () => {
    const copy = [...services];
    filterServices(services, { ...base, sortBy: "price_asc" });
    expect(services).toEqual(copy);
  });
});

describe("getAvailableLocations", () => {
  it("starts with 'all', splits provider locations, drops 'UAE' and de-duplicates defaults", () => {
    const values = getAvailableLocations(services).map((l) => l.value);
    expect(values[0]).toBe("all");
    expect(values).toContain("Al Nahda");
    expect(values).toContain("Khalifa City");
    expect(values).not.toContain("UAE");
    expect(values.filter((v) => v === "Dubai")).toHaveLength(1);
  });
});
