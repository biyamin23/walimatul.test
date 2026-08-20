"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { CardAnimationPreset, CardAnimationDuration } from "@/lib/templates/template-design";

export interface MotionHeroProps {
  children: React.ReactNode;
  preset?: CardAnimationPreset;
  duration?: CardAnimationDuration;
  className?: string;
  style?: React.CSSProperties;
}

const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function MotionHero({
  children,
  preset = "fade-up",
  className = "",
  style,
}: MotionHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  if (preset === "none" || shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: preset === "soft-fade" ? 0 : 16,
      scale: preset === "gentle-scale" ? 0.98 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: EASE_PREMIUM,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
      style={style}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return <motion.div variants={itemVariants}>{child}</motion.div>;
      })}
    </motion.div>
  );
}
