"use client";

import { useEffect, useMemo, useState } from "react";

import { isManifestRouteEnabled } from "./ManifestRouteEnabled";
import {
  BooklySection,
  createBooklyCatalogModel,
  fetchBooklySections
} from "./booklyCatalog";

export const useBooklyCatalog = () => {
  const [isManifestEnabled, setIsManifestEnabled] = useState<boolean>(true);
  const [sections, setSections] = useState<BooklySection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkManifestRoute = async () => {
      try {
        const enabled = await isManifestRouteEnabled();
        setIsManifestEnabled(enabled);
      } catch (error) {
        console.error("Error checking manifest route:", error);
        setIsManifestEnabled(false);
      }
    };

    checkManifestRoute();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCatalog = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextSections = await fetchBooklySections(controller.signal);
        setSections(nextSections);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Error loading Bookly catalog:", error);
        setError("The Bookly catalog could not be loaded.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchCatalog();

    return () => {
      controller.abort();
    };
  }, []);

  const catalog = useMemo(
    () => createBooklyCatalogModel(sections, isManifestEnabled),
    [sections, isManifestEnabled]
  );

  return { catalog, sections, isLoading, error, isManifestEnabled };
};
