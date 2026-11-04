import type { Locale } from "../config";
import en, { type Dictionary } from "./en";
import ar from "./ar";

const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];
export type { Dictionary };
