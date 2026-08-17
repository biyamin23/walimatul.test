"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BlushGardenTemplate } from "@/templates/blush-garden/Template";
import {
  BLUSH_GARDEN_PREVIEW_DATA,
  LONG_CONTENT_PREVIEW_DATA,
  MINIMAL_PREVIEW_DATA,
} from "@/templates/blush-garden/preview-data";

export function BlushGardenPreviewClient() {
  const [datasetKey, setDatasetKey] = useState<"default" | "long" | "minimal">("default");

  const currentData = {
    default: BLUSH_GARDEN_PREVIEW_DATA,
    long: LONG_CONTENT_PREVIEW_DATA,
    minimal: MINIMAL_PREVIEW_DATA,
  }[datasetKey];

  return (
    <div className="min-h-screen flex flex-col bg-[#1A2E26] text-white">
      {/* Top Preview Control Bar */}
      <header className="sticky top-0 z-50 bg-[#174F3A] border-b border-[#B8955A]/30 px-2.5 py-2 sm:px-4 sm:py-3 shadow-md">
        {/* Mobile Toolbar (Single Horizontal Row: Back | Blush Garden | Dataset Selector | Use →) */}
        <div className="flex sm:hidden items-center justify-between gap-1.5 w-full">
          {/* Back Icon + Title */}
          <div className="flex items-center gap-1 min-w-0 flex-shrink">
            <Link
              href="/templates"
              aria-label="Back to templates"
              className="inline-flex items-center justify-center w-8 h-8 -ml-1 text-[#F5DDD6] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white rounded-full active:bg-[#123E2D]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <h1 className="font-playfair text-xs font-semibold tracking-tight text-white truncate">
              Blush Garden
            </h1>
          </div>

          {/* Compact Dataset Selector */}
          <div className="relative flex-shrink-0">
            <label htmlFor="mobile-dataset-select" className="sr-only">
              Select Preview Dataset
            </label>
            <select
              id="mobile-dataset-select"
              value={datasetKey}
              onChange={(e) => setDatasetKey(e.target.value as "default" | "long" | "minimal")}
              className="appearance-none bg-[#123E2D] border border-[#B8955A]/40 text-[#F5DDD6] text-[11px] font-inter rounded-lg pl-2 pr-6 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#B8955A] cursor-pointer"
            >
              <option value="default" className="bg-[#174F3A] text-white">
                Standard
              </option>
              <option value="long" className="bg-[#174F3A] text-white">
                Long Names
              </option>
              <option value="minimal" className="bg-[#174F3A] text-white">
                Minimal
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 text-[#B8955A]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Compact Use CTA */}
          <Link
            href="/register"
            className="flex-shrink-0 inline-flex items-center justify-center px-2.5 py-1.5 rounded-full bg-[#B8955A] text-white text-xs font-inter font-semibold hover:bg-[#a6844c] active:scale-95 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-white whitespace-nowrap"
          >
            Use →
          </Link>
        </div>

        {/* Desktop Toolbar (Retains Existing Layout) */}
        <div className="hidden sm:flex items-center justify-between gap-3 w-full">
          {/* Left Navigation */}
          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-xs font-inter font-medium text-[#F5DDD6] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white rounded"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Templates</span>
            </Link>
            <span className="text-[#B8955A]/50">|</span>
            <h1 className="font-playfair text-sm font-semibold tracking-wide text-white">
              Blush Garden <span className="text-xs font-inter font-normal text-[#F5DDD6]/70">(Preview)</span>
            </h1>
          </div>

          {/* Center Dataset Switcher */}
          <div className="flex items-center gap-1.5 bg-[#123E2D] p-1 rounded-full border border-[#B8955A]/30 text-[11px] font-inter">
            <button
              type="button"
              onClick={() => setDatasetKey("default")}
              className={`px-3 py-1 rounded-full transition-all ${
                datasetKey === "default"
                  ? "bg-[#B8955A] text-white font-semibold shadow-sm"
                  : "text-[#F5DDD6]/80 hover:text-white"
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setDatasetKey("long")}
              className={`px-3 py-1 rounded-full transition-all ${
                datasetKey === "long"
                  ? "bg-[#B8955A] text-white font-semibold shadow-sm"
                  : "text-[#F5DDD6]/80 hover:text-white"
              }`}
            >
              Long Names
            </button>
            <button
              type="button"
              onClick={() => setDatasetKey("minimal")}
              className={`px-3 py-1 rounded-full transition-all ${
                datasetKey === "minimal"
                  ? "bg-[#B8955A] text-white font-semibold shadow-sm"
                  : "text-[#F5DDD6]/80 hover:text-white"
              }`}
            >
              Minimal
            </button>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#B8955A] text-white text-xs font-inter font-semibold hover:bg-[#a6844c] transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-white"
            >
              Use This Template →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Template Renderer */}
      <div className="flex-1 w-full">
        <BlushGardenTemplate data={currentData} mode="preview" />
      </div>
    </div>
  );
}
