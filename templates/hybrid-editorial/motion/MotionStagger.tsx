"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type {
  CardAnimationPreset,
  CardAnimationDuration,
} from "@/lib/templates/template-design";

export interface MotionStaggerProps {
  children: React.ReactNode;
  preset?: CardAnimationPreset;
  duration?: CardAnimationDuration;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  staggerInterval?: number;
}

export interface MotionItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DURATION_MAP: Record<CardAnimationDuration, number> = {
  normal: 0.58,
  slow: 0.88,
};

const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: EASE_PREMIUM,
    },
  },
};

export function MotionStagger({
  children,
  preset = "staggered-reveal",
  duration = "normal",
  triggerOnce = true,
  className = "",
  style,
  staggerInterval = 0.1,
}: MotionStaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (preset === "none" || shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  // If preset is not staggered-reveal, we can animate the whole container using standard presets
  if (preset !== "staggered-reveal") {
    const durSec = DURATION_MAP[duration] || 0.58;
    const variants: Variants = {
      hidden:
        preset === "soft-fade"
          ? { opacity: 0 }
          : preset === "gentle-scale"
          ? { opacity: 0, scale: 0.97 }
          : { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: durSec, ease: EASE_PREMIUM },
      },
    };

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: triggerOnce, amount: 0.15 }}
        variants={variants}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  const durSec = DURATION_MAP[duration] || 0.58;
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerInterval,
        delayChildren: 0.05,
      },
    },
  };

  const dynamicItemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durSec,
        ease: EASE_PREMIUM,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: triggerOnce, amount: 0.12 }}
      variants={containerVariants}
      className={className}
      style={style}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div variants={dynamicItemVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function MotionItem({ children, className = "" }: MotionItemProps) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
