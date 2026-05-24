"use client";

import { useEffect, useCallback, useRef } from "react";

/**
 * Calls `onRefresh` whenever:
 *  - the window gains focus (user switches back to the tab)
 *  - the document becomes visible (mobile: back from another app)
 *  - the optional `intervalMs` elapses (background polling)
 *
 * Debounced with `minIntervalMs` to avoid hammering on rapid focus events.
 */
export function useDataRefresh(
  onRefresh: () => void,
  options: { intervalMs?: number; minIntervalMs?: number } = {}
) {
  const { intervalMs, minIntervalMs = 30_000 } = options;
  const lastRefresh = useRef<number>(Date.now());
  const stableRefresh = useRef(onRefresh);
  stableRefresh.current = onRefresh;

  const maybeRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastRefresh.current < minIntervalMs) return;
    lastRefresh.current = now;
    stableRefresh.current();
  }, [minIntervalMs]);

  useEffect(() => {
    const onFocus = () => maybeRefresh();
    const onVisible = () => { if (document.visibilityState === "visible") maybeRefresh(); };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    let timer: ReturnType<typeof setInterval> | undefined;
    if (intervalMs) {
      timer = setInterval(() => stableRefresh.current(), intervalMs);
    }

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      if (timer) clearInterval(timer);
    };
  }, [maybeRefresh, intervalMs]);
}
