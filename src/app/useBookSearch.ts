"use client";

import { useEffect, useState } from "react";

import {
  DisplaySearchResult,
  fetchBookSearchResults
} from "./booklyCatalog";

type UseBookSearchOptions = {
  debounceMs?: number;
  enabled?: boolean;
  limit?: number;
};

export const useBookSearch = (
  query: string,
  {
    debounceMs = 250,
    enabled = true,
    limit
  }: UseBookSearchOptions = {}
) => {
  const initialQuery = query.trim();
  const [results, setResults] = useState<DisplaySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(() => enabled && initialQuery.length > 0);
  const [error, setError] = useState<string | null>(null);
  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!enabled || !trimmedQuery) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const timeout = window.setTimeout(async () => {
      try {
        const nextResults = await fetchBookSearchResults(trimmedQuery, controller.signal);
        setResults(typeof limit === "number" ? nextResults.slice(0, limit) : nextResults);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Error searching Bookly catalog:", error);
        setResults([]);
        setError("Search is unavailable right now.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [debounceMs, enabled, limit, trimmedQuery]);

  return {
    error,
    isLoading,
    query: trimmedQuery,
    results
  };
};
