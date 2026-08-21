"use client";

import React, { useState, useEffect } from "react";

export interface LiveCountdownProps {
  weddingDate: string | null;
  startTime?: string | null;
  className?: string;
  theme?: {
    accentColor?: string;
    surfaceColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    borderColor?: string;
  };
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

  // Format time as HH:MM:00 (default to 11:00 if not provided)
  const timeStr = startTime && startTime.trim().length >= 4
    ? startTime.trim().slice(0, 5) + ":00"
    : "11:00:00";

  // Target datetime in Asia/Kuala_Lumpur (UTC+8)
  const targetIso = `${weddingDate.trim()}T${timeStr}+08:00`;
  const targetTime = new Date(targetIso).getTime();

  if (isNaN(targetTime)) {
    return null;
  }

  const now = Date.now();
  const diff = targetTime - now;

  // 1. Event is in the future
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
      status: "upcoming",
    };
  }

  // 2. Event is happening today (within 24 hours of start time)
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  if (diff <= 0 && Math.abs(diff) < twentyFourHoursMs) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      status: "in_progress",
    };
  }

  // 3. Event has concluded
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: "ended",
  };
}

export function LiveCountdown({
  weddingDate,
  startTime = null,
  className = "",
  theme,
}: LiveCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(() =>
    calculateTimeRemaining(weddingDate, startTime)
  );
  const [prevProps, setPrevProps] = useState({ weddingDate, startTime });

  // Handle prop changes during render without setState in useEffect (React docs pattern)
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

  const accent = theme?.accentColor || "var(--gold, #B8955A)";
  const surface = theme?.surfaceColor || "rgba(255, 255, 255, 0.85)";
  const text = theme?.textColor || "var(--text, #2C2523)";
  const subText = theme?.secondaryTextColor || "var(--text-muted, #736862)";
  const border = theme?.borderColor || "var(--border, #EFE8DF)";

  // Event In Progress State
  if (timeRemaining.status === "in_progress") {
    return (
      <div
        className={`py-4 px-6 rounded-2xl border text-center shadow-xs ${className}`}
        style={{ backgroundColor: surface, borderColor: border }}
      >
        <span
          className="text-xs uppercase tracking-widest font-bold block mb-1"
          style={{ color: accent }}
        >
          Hari Bahagia
        </span>
        <p className="text-base sm:text-lg font-bold font-display" style={{ color: text }}>
          🎉 Majlis sedang berlangsung
        </p>
      </div>
    );
  }

  // Event Passed State
  if (timeRemaining.status === "ended") {
    return (
      <div
        className={`py-4 px-6 rounded-2xl border text-center shadow-xs ${className}`}
        style={{ backgroundColor: surface, borderColor: border }}
      >
        <span
          className="text-xs uppercase tracking-widest font-bold block mb-1"
          style={{ color: accent }}
        >
          Memori Indah
        </span>
        <p className="text-base sm:text-lg font-bold font-display" style={{ color: text }}>
          Majlis telah berlangsung
        </p>
      </div>
    );
  }

  // Upcoming Active Countdown Display
  const pad = (n: number) => String(n).padStart(2, "0");

  const units = [
    { label: "Hari", value: String(timeRemaining.days) },
    { label: "Jam", value: pad(timeRemaining.hours) },
    { label: "Minit", value: pad(timeRemaining.minutes) },
    { label: "Saat", value: pad(timeRemaining.seconds) },
  ];

  return (
    <div className={`space-y-3 text-center ${className}`}>
      <span
        className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold block"
        style={{ color: accent }}
      >
        Menghitung Hari
      </span>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="p-2.5 sm:p-3 rounded-2xl border shadow-xs flex flex-col items-center justify-center min-w-0 transition-transform duration-300"
            style={{ backgroundColor: surface, borderColor: border }}
          >
            <span
              className="text-xl sm:text-2xl md:text-3xl font-bold font-display leading-none tracking-tight"
              style={{ color: text }}
            >
              {unit.value}
            </span>
            <span
              className="text-[10px] sm:text-[11px] font-ui uppercase tracking-wider font-semibold mt-1"
              style={{ color: subText }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
