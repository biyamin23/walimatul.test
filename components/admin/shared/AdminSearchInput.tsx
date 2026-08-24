"use client";

import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface AdminSearchInputProps {
  placeholder?: string;
  initialValue?: string;
}

export function AdminSearchInput({
  placeholder = "Cari...",
  initialValue = "",
}: AdminSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = searchTerm.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    // Always reset to page 1 on new search
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleClear() {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md w-full">
      <div className="relative flex items-center">
        <span
          className="absolute left-3.5 text-stone-400 pointer-events-none"
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-16 py-2 rounded-xl text-xs sm:text-sm font-ui bg-[var(--surface)] border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] text-[var(--text)] transition-colors shadow-xs placeholder:text-stone-400"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 text-stone-400 hover:text-stone-600 text-xs p-1"
            title="Padam carian"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-1.5 px-3 py-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-ui font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? "..." : "Cari"}
        </button>
      </div>
    </form>
  );
}
