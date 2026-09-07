"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type ChateauRevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade"
  | "scale"
  | "slide-left"
  | "slide-right";

export interface ChateauRevealProps {
  children: React.ReactNode;
  variant?: ChateauRevealVariant;
  delay?: number; // in ms
  duration?: number; // in ms
  threshold?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PREMIUM_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function ChateauReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 750,
  threshold = 0.15,
  disabled = false,
  className = "",
  style,
}: ChateauRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Intersection Observer
  useEffect(() => {
    if (disabled || prefersReducedMotion) {
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [disabled, prefersReducedMotion, threshold]);

  // If disabled or reduced motion, render clean static markup immediately
  if (disabled || prefersReducedMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  // Define initial (hidden) transform
  let initialTransform = "none";
  switch (variant) {
    case "fade-up":
      initialTransform = "translateY(24px)";
      break;
    case "fade-down":
      initialTransform = "translateY(-24px)";
      break;
    case "scale":
      initialTransform = "scale(0.95)";
      break;
    case "slide-left":
      initialTransform = "translateX(-24px)";
      break;
    case "slide-right":
      initialTransform = "translateX(24px)";
      break;
    case "fade":
    default:
      initialTransform = "none";
      break;
  }

  const dynamicStyle: React.CSSProperties = {
    ...style,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "none" : initialTransform,
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: PREMIUM_EASING,
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? "auto" : "opacity, transform",
  };

  return (
    <div ref={elementRef} className={className} style={dynamicStyle}>
      {children}
    </div>
  );
}
