"use client";

import React from "react";
import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import type {
  CardAnimationPreset,
  CardAnimationDuration,
} from "@/lib/templates/template-design";

export interface MotionRevealProps {
  children: React.ReactNode;
  preset?: CardAnimationPreset;
  duration?: CardAnimationDuration;
  triggerOnce?: boolean;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DURATION_MAP: Record<CardAnimationDuration, number> = {
  normal: 0.62,
  slow: 0.92,
};

const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function MotionReveal({
  children,
  preset = "fade-up",
  duration = "normal",
  triggerOnce = true,
  delay = 0,
  className = "",
  style,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // If no animation is chosen or user prefers reduced motion, render clean static markup
  if (preset === "none" || shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const durationSec = DURATION_MAP[duration] || 0.62;
  const transition: Transition = {
    duration: durationSec,
    ease: EASE_PREMIUM,
    delay,
  };

  const getVariants = (): Variants => {
    switch (preset) {
      case "soft-fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition },
        };
      case "fade-up":
        return {
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition },
        };
      case "gentle-scale":
        return {
          hidden: { opacity: 0, scale: 0.97 },
          visible: { opacity: 1, scale: 1, transition },
        };
      case "staggered-reveal":
        // Single block fallback for staggered preset
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition },
        };
      default:
        return {
          hidden: {},
          visible: {},
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: triggerOnce, amount: 0.15 }}
      variants={getVariants()}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
