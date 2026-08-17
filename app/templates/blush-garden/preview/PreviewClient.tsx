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
      <header className="sticky top-0 z-50 bg-[#174F3A] border-b border-[#B8955A]/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
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
      </header>

      {/* Main Template Renderer */}
      <div className="flex-1 w-full">
        <BlushGardenTemplate data={currentData} mode="preview" />
      </div>
    </div>
  );
}
