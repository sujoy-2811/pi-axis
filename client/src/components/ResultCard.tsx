"use client";

import { SearchResult } from "@/types/search";

interface ResultCardProps {
  result: SearchResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const scoreBadgeColors =
    result.score >= 4
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : result.score >= 2
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <div
      className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 transition-all duration-300 hover:border-slate-500/50 hover:-translate-y-1 hover:scale-[1.01] overflow-hidden"
      style={{ animationDelay: `${(result.rank - 1) * 80}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
      
      <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
        {/* Rank badge */}
        <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-brand-600/40 to-brand-800/40 border border-brand-600/50 flex items-center justify-center text-brand-300 font-bold text-sm">
          #{result.rank}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col items-start">
          <h3 className="text-base font-semibold text-slate-100 leading-tight tracking-tight">
            {result.title}
          </h3>
          <div className="mt-1 font-mono text-xs text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800/50">
            Detail ID: {result.detail_id}
          </div>
        </div>
        
        <div className="shrink-0 flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold tracking-wide ${scoreBadgeColors}`}>
            Score: {result.score}
          </span>
        </div>
      </div>
      
      <div className="relative z-10 pl-0 sm:pl-11 pt-3 sm:pt-0 mt-3 sm:mt-0 border-t border-slate-700/50 sm:border-t-0 text-sm text-slate-300 leading-relaxed">
        {result.explanation}
      </div>
    </div>
  );
}
