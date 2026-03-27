"use client";

import { SearchResult } from "@/types/search";
import ResultCard from "./ResultCard";

interface ResultsListProps {
  results: SearchResult[] | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResultsList({ results, isLoading, error }: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="w-10 h-10 border-4 border-slate-700/50 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-3 p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
        {error}
      </div>
    );
  }

  if (results === null) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl gap-4">
        <svg
          className="text-slate-600 mb-2 opacity-50"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <p className="text-slate-400 text-base max-w-sm leading-relaxed">
          Enter a search query or select contextual filters to find
          architectural details
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl gap-4">
        <p className="text-slate-400 text-base max-w-sm leading-relaxed">
          No matching details found. Try broadening your search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {results.map((result) => (
        <ResultCard key={result.detail_id} result={result} />
      ))}
    </div>
  );
}
