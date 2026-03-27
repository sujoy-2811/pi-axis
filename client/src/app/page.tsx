"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import ResultsList from "@/components/ResultsList";
import { SearchResult, SearchRequest, SearchResponse } from "@/types/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const [query, setQuery] = useState("");
  const [hostElement, setHostElement] = useState("");
  const [adjacentElement, setAdjacentElement] = useState("");
  const [exposure, setExposure] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const body: SearchRequest = {};

    if (query.trim()) body.query = query.trim();
    if (hostElement) body.host_element = hostElement;
    if (adjacentElement) body.adjacent_element = adjacentElement;
    if (exposure) body.exposure = exposure;

    if (Object.keys(body).length === 0) {
      setError("Please enter a search query or select at least one filter.");
      setResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: SearchResponse = await response.json();

      if (!response.ok) {
        setError(
          (data as unknown as { error: string }).error ||
            "An error occurred while searching."
        );
        setResults(null);
        return;
      }

      setResults(data.results);
    } catch {
      setError("Failed to connect to the server. Make sure the backend is running on port 3001.");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setHostElement("");
    setAdjacentElement("");
    setExposure("");
    setResults(null);
    setError(null);
  };

  const resultCount =
    results !== null && results.length > 0
      ? `${results.length} result${results.length > 1 ? "s" : ""}`
      : "";

  return (
    <div className="relative z-10 max-w-[860px] mx-auto px-6 flex flex-col min-h-screen">
      {/* Header */}
      <header className="py-12 border-b border-slate-800/60 mb-8 flex flex-col items-center text-center">
        <div className="flex flex-col gap-3 items-center">
          <div className="flex items-center gap-4 mb-2">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="rounded-xl">
              <rect width="32" height="32" rx="10" fill="url(#logo-grad)" />
              <path
                d="M8 24V12L16 6L24 12V24H20V18H12V24H8Z"
                fill="white"
                fillOpacity="0.95"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Detail<span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-400 to-cyan-400">Search</span>
            </h1>
          </div>
          <p className="text-lg text-slate-400 font-medium max-w-lg">
            Architectural Detail Search & Discovery
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-10 pb-16">
        <SearchForm
          query={query}
          hostElement={hostElement}
          adjacentElement={adjacentElement}
          exposure={exposure}
          onQueryChange={setQuery}
          onHostElementChange={setHostElement}
          onAdjacentElementChange={setAdjacentElement}
          onExposureChange={setExposure}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {(results !== null || isLoading || error) && (
          <section id="results-panel" className="bg-transparent p-0">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-3">
                Results
              </h2>
              {resultCount && (
                <span className="text-sm font-medium text-slate-400 bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700/50">
                  {resultCount}
                </span>
              )}
            </div>
            
            <ResultsList
              results={results}
              isLoading={isLoading}
              error={error}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/60 text-center">
        <p className="text-xs text-slate-500 tracking-wide">
          PiAxis Assignment — Architectural Detail Search API
        </p>
      </footer>
    </div>
  );
}
