"use client";

import React, { useState, useEffect } from "react";
import { ChateauReveal } from "./ChateauReveal";

interface ChateauCountdownProps {
  weddingDate: string | null;
  startTime?: string | null;
  mode?: "live" | "preview" | "editor";
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: "upcoming" | "in_progress" | "ended";
}

function calculateTimeRemaining(
  weddingDate: string | null,
  startTime: string | null = null
): TimeRemaining | null {
  if (!weddingDate || !/^\d{4}-\d{2}-\d{2}$/.test(weddingDate.trim())) {
    return null;
  }

  const timeStr =
    startTime && startTime.trim().length >= 4
      ? startTime.trim().slice(0, 5) + ":00"
      : "11:00:00";

  const targetIso = `${weddingDate.trim()}T${timeStr}+08:00`;
  const targetTime = new Date(targetIso).getTime();

  if (isNaN(targetTime)) {
    return null;
  }

  const now = Date.now();
  const diff = targetTime - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, status: "upcoming" };
  }

  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  if (diff <= 0 && Math.abs(diff) < twentyFourHoursMs) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "in_progress" };
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "ended" };
}

export function ChateauCountdown({
  weddingDate,
  startTime = null,
  mode = "live",
  className = "",
}: ChateauCountdownProps) {
  const isEditor = mode === "editor";
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(() =>
    calculateTimeRemaining(weddingDate, startTime)
  );
  const [prevProps, setPrevProps] = useState({ weddingDate, startTime });

  if (prevProps.weddingDate !== weddingDate || prevProps.startTime !== startTime) {
    setPrevProps({ weddingDate, startTime });
    setTimeRemaining(calculateTimeRemaining(weddingDate, startTime));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(weddingDate, startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate, startTime]);

  if (!timeRemaining) {
    return null;
  }

  if (timeRemaining.status === "in_progress") {
    return (
      <ChateauReveal variant="fade-up" duration={600} disabled={isEditor}>
        <div className={`py-4 px-6 rounded-2xl border border-[#EAD6D8] bg-[#FBEDEA] text-center shadow-xs ${className}`}>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A4A] block mb-1">
            Hari Bahagia
          </span>
          <p className="text-base sm:text-lg font-bold font-chateau-heading text-[#6B2333]">
            🎉 Majlis sedang berlangsung
          </p>
        </div>
      </ChateauReveal>
    );
  }

  if (timeRemaining.status === "ended") {
    return (
      <ChateauReveal variant="fade-up" duration={600} disabled={isEditor}>
        <div className={`py-4 px-6 rounded-2xl border border-[#EAD6D8] bg-[#FBEDEA] text-center shadow-xs ${className}`}>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A4A] block mb-1">
            Memori Indah
          </span>
          <p className="text-base sm:text-lg font-bold font-chateau-heading text-[#6B2333]">
            Majlis telah berlangsung
          </p>
        </div>
      </ChateauReveal>
    );
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  const units = [
    { label: "Hari", value: String(timeRemaining.days), delay: 80 },
    { label: "Jam", value: pad(timeRemaining.hours), delay: 160 },
    { label: "Minit", value: pad(timeRemaining.minutes), delay: 240 },
    { label: "Saat", value: pad(timeRemaining.seconds), delay: 320 },
  ];

  return (
    <div className={`space-y-3 text-center ${className}`}>
      <ChateauReveal variant="fade" duration={600} disabled={isEditor}>
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-chateau-heading font-semibold text-[#B58A4A] block">
          Menghitung Hari
        </span>
      </ChateauReveal>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
        {units.map((unit) => (
          <ChateauReveal
            key={unit.label}
            variant="fade-up"
            delay={unit.delay}
            duration={650}
            disabled={isEditor}
          >
            <div className="p-2.5 sm:p-3 rounded-2xl border border-[#EAD6D8] bg-[#FBEDEA]/90 backdrop-blur-xs shadow-xs flex flex-col items-center justify-center min-w-0 transition-transform duration-300 hover:border-[#B58A4A]/50">
              <span
                suppressHydrationWarning
                className="text-xl sm:text-2xl md:text-3xl font-bold font-chateau-heading leading-none tracking-tight text-[#6B2333]"
              >
                {unit.value}
              </span>
              <span className="text-[10px] sm:text-[11px] font-chateau-body uppercase tracking-wider font-semibold mt-1 text-[#766467]">
                {unit.label}
              </span>
            </div>
          </ChateauReveal>
        ))}
      </div>
    </div>
  );
}
