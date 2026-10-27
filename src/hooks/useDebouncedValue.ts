"use client";

import * as React from "react";

/**
 * Returns `value` only after it has stopped changing for `delay` ms.
 * Each new value cancels the pending timer, so fast typing produces
 * a single update once the user pauses.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
