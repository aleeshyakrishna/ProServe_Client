import type { Dictionary } from "./dictionaries";

/** Translates known service/category names; unknown names (e.g. new ones from the database) stay as they are. */
export const serviceName = (t: Dictionary, name: string): string =>
  (t.serviceNames as Record<string, string>)[name] ?? name;
