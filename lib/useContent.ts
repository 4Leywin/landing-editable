"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "./content";

export function useContent() {
  const [content, setContent] = useState<any>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchContent() {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        if (!mounted) return;
        // shallow merge: override top-level keys present in JSON
        setContent((prev: any) => ({ ...prev, ...json }));
      } catch (err: any) {
        setError(err?.message || "unknown");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  return { content, loading, error } as const;
}
