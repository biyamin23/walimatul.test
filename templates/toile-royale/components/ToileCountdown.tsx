"use client";

import React, { useState, useEffect } from "react";

interface ToileCountdownProps {
  weddingDate: string | null;
  startTime?: string | null;
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

  if (isNaN(targetTime)) return null;

  const diff = targetTime - Date.now();

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

export function ToileCountdown({ weddingDate, startTime = null }: ToileCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(() =>
    calculateTimeRemaining(weddingDate, startTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(weddingDate, startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDate, startTime]);

  if (!timeRemaining) return null;

  if (timeRemaining.status === "in_progress") {
    return (
      <div className="py-4 px-6 rounded-2xl border border-[#581825]/20 bg-[#FAF7F2] text-center shadow-xs max-w-sm mx-auto my-6">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#581825] block mb-1">
          Hari Bahagia
        </span>
        <p className="text-base sm:text-lg font-bold font-toile-serif text-[#581825]">
          🎉 Majlis Sedang Berlangsung
        </p>
      </div>
    );
  }

  if (timeRemaining.status === "ended") {
    return (
      <div className="py-4 px-6 rounded-2xl border border-[#581825]/20 bg-[#FAF7F2] text-center shadow-xs max-w-sm mx-auto my-6">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#581825] block mb-1">
          Memori Indah
        </span>
        <p className="text-base sm:text-lg font-bold font-toile-serif text-[#581825]">
          Majlis Telah Selesai
        </p>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  const units = [
    { label: "Hari", value: String(timeRemaining.days) },
    { label: "Jam", value: pad(timeRemaining.hours) },
    { label: "Minit", value: pad(timeRemaining.minutes) },
    { label: "Saat", value: pad(timeRemaining.seconds) },
  ];

  return (
    <div className="w-full py-8 px-4 bg-[#FAF7F2] text-center border-b border-[#E8D9D2]">
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-toile-serif font-bold text-[#581825] block mb-4">
        Menghitung Hari
      </span>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xs sm:max-w-sm mx-auto">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="p-2 sm:p-3 rounded-2xl border border-[#581825]/25 bg-white shadow-xs flex flex-col items-center justify-center transition-all hover:border-[#581825]/50"
          >
            <span
              suppressHydrationWarning
              className="text-xl sm:text-2xl md:text-3xl font-bold font-toile-serif leading-none tracking-tight text-[#581825]"
            >
              {unit.value}
            </span>
            <span className="text-[9px] sm:text-[10px] font-toile-body uppercase tracking-wider font-semibold mt-1 text-[#6E2835]">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
