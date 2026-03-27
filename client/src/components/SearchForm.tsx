"use client";

import React from "react";

interface SearchFormProps {
  query: string;
  hostElement: string;
  adjacentElement: string;
  exposure: string;
  onQueryChange: (value: string) => void;
  onHostElementChange: (value: string) => void;
  onAdjacentElementChange: (value: string) => void;
  onExposureChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function SearchForm({
  query,
  hostElement,
  adjacentElement,
  exposure,
  onQueryChange,
  onHostElementChange,
  onAdjacentElementChange,
  onExposureChange,
  onSearch,
  onClear,
}: SearchFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8" id="search-panel">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
        Search Parameters
        <span className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent"></span>
      </h2>

      {/* Text Query */}
      <div className="mb-5">
        <label htmlFor="query-input" className="block text-sm font-medium text-slate-400 mb-2">
          Search Query
        </label>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none transition-colors peer-focus:text-brand-500"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            id="query-input"
            className="peer w-full py-3.5 pl-12 pr-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 text-base placeholder-slate-500 outline-none transition-all hover:border-slate-600 hover:bg-slate-800 focus:border-brand-500 focus:bg-slate-800 focus:ring-4 focus:ring-brand-500/20"
            placeholder="e.g. window drip, wall junction..."
            autoComplete="off"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Context Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="host-element" className="block text-sm font-medium text-slate-400 mb-2">Host Element</label>
          <div className="relative">
            <select
              id="host-element"
              className="w-full py-3.5 pl-4 pr-10 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 text-sm appearance-none outline-none transition-all hover:border-slate-600 hover:bg-slate-800 focus:border-brand-500 focus:bg-slate-800 focus:ring-4 focus:ring-brand-500/20"
              value={hostElement}
              onChange={(e) => onHostElementChange(e.target.value)}
            >
              <option value="">— Any —</option>
              <option value="External Wall">External Wall</option>
              <option value="Window">Window</option>
              <option value="Internal Wall">Internal Wall</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-500 pointer-events-none block"></div>
          </div>
        </div>

        <div>
          <label htmlFor="adjacent-element" className="block text-sm font-medium text-slate-400 mb-2">Adjacent Element</label>
          <div className="relative">
            <select
              id="adjacent-element"
              className="w-full py-3.5 pl-4 pr-10 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 text-sm appearance-none outline-none transition-all hover:border-slate-600 hover:bg-slate-800 focus:border-brand-500 focus:bg-slate-800 focus:ring-4 focus:ring-brand-500/20"
              value={adjacentElement}
              onChange={(e) => onAdjacentElementChange(e.target.value)}
            >
              <option value="">— Any —</option>
              <option value="Slab">Slab</option>
              <option value="External Wall">External Wall</option>
              <option value="Floor">Floor</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-500 pointer-events-none block"></div>
          </div>
        </div>

        <div>
          <label htmlFor="exposure" className="block text-sm font-medium text-slate-400 mb-2">Exposure</label>
          <div className="relative">
            <select
              id="exposure"
              className="w-full py-3.5 pl-4 pr-10 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 text-sm appearance-none outline-none transition-all hover:border-slate-600 hover:bg-slate-800 focus:border-brand-500 focus:bg-slate-800 focus:ring-4 focus:ring-brand-500/20"
              value={exposure}
              onChange={(e) => onExposureChange(e.target.value)}
            >
              <option value="">— Any —</option>
              <option value="External">External</option>
              <option value="Internal">Internal</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-500 pointer-events-none block"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          id="search-btn"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
          onClick={onSearch}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          Search Details
        </button>
        <button
          id="clear-btn"
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3.5 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 text-sm font-semibold rounded-xl transition-all"
          onClick={onClear}
        >
          Clear All
        </button>
      </div>
    </section>
  );
}
