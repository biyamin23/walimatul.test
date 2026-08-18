import React from "react";
import Image from "next/image";
import type { TemplateDesignOverlay } from "@/lib/templates/template-design";

export interface OverlayAnimationProps {
  config: TemplateDesignOverlay;
}

export function OverlayAnimation({ config }: OverlayAnimationProps) {
  if (!config.enabled || config.animationPreset === "none") {
    return null;
  }

  const speedDuration =
    config.speed === "slow" ? "14s" : config.speed === "fast" ? "6s" : "9s";

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      style={{ opacity: config.opacity }}
    >
      <style>{`
        @keyframes float-gentle {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes sparkle-pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes bokeh-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -25px) scale(1.15); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes petal-fall {
          0% { transform: translateY(-10%) rotate(0deg) translateX(0); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(360deg) translateX(40px); opacity: 0; }
        }

        @keyframes radial-glow {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .anim-float {
          animation: float-gentle ${speedDuration} ease-in-out infinite;
        }

        .anim-sparkle {
          animation: sparkle-pulse ${speedDuration} ease-in-out infinite;
        }

        .anim-bokeh {
          animation: bokeh-drift ${speedDuration} ease-in-out infinite;
        }

        .anim-petals {
          animation: petal-fall ${speedDuration} linear infinite;
        }

        .anim-glow {
          animation: radial-glow ${speedDuration} ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-float, .anim-sparkle, .anim-bokeh, .anim-petals, .anim-glow {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Preset: Custom Asset Floating (if provided) */}
      {config.customAssetUrl && (
        <div className="absolute inset-0">
          {[
            { top: "10%", left: "15%", size: 36, delay: "0s" },
            { top: "35%", right: "12%", size: 28, delay: "2s" },
            { top: "60%", left: "10%", size: 32, delay: "4s" },
            { top: "80%", right: "18%", size: 40, delay: "1.5s" },
          ].map((pos, idx) => (
            <div
              key={idx}
              className={`absolute ${
                config.animationPreset === "petals"
                  ? "anim-petals"
                  : config.animationPreset === "sparkle"
                  ? "anim-sparkle"
                  : "anim-float"
              }`}
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                animationDelay: pos.delay,
                width: pos.size,
                height: pos.size,
              }}
            >
              <Image
                src={config.customAssetUrl!}
                alt=""
                width={pos.size}
                height={pos.size}
                className="w-full h-full object-contain pointer-events-none"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      {/* Preset: Sparkle without custom asset */}
      {!config.customAssetUrl && config.animationPreset === "sparkle" && (
        <div className="absolute inset-0">
          {[
            { top: "12%", left: "20%", delay: "0s", size: "w-2.5 h-2.5" },
            { top: "25%", right: "18%", delay: "1.8s", size: "w-3 h-3" },
            { top: "50%", left: "12%", delay: "3.2s", size: "w-2 h-2" },
            { top: "72%", right: "22%", delay: "0.9s", size: "w-3 h-3" },
            { top: "88%", left: "30%", delay: "2.4s", size: "w-2.5 h-2.5" },
          ].map((p, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full bg-[var(--template-accent,#b8955a)] shadow-xs anim-sparkle ${p.size}`}
              style={{
                top: p.top,
                left: p.left,
                right: p.right,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Preset: Bokeh without custom asset */}
      {!config.customAssetUrl && config.animationPreset === "bokeh" && (
        <div className="absolute inset-0">
          {[
            { top: "15%", left: "10%", size: "w-24 h-24", delay: "0s" },
            { top: "45%", right: "8%", size: "w-32 h-32", delay: "3s" },
            { top: "75%", left: "18%", size: "w-28 h-28", delay: "1.5s" },
          ].map((b, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full bg-[var(--template-accent,#b8955a)]/20 blur-xl anim-bokeh ${b.size}`}
              style={{
                top: b.top,
                left: b.left,
                right: b.right,
                animationDelay: b.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Preset: Falling Petals without custom asset */}
      {!config.customAssetUrl && config.animationPreset === "petals" && (
        <div className="absolute inset-0">
          {[
            { left: "15%", delay: "0s", size: "w-3 h-4" },
            { left: "38%", delay: "3.5s", size: "w-2.5 h-3.5" },
            { left: "62%", delay: "1.8s", size: "w-3.5 h-4.5" },
            { left: "82%", delay: "5.2s", size: "w-2.5 h-3" },
          ].map((petal, idx) => (
            <div
              key={idx}
              className={`absolute rounded-[100%_0%_100%_0%] bg-[var(--template-accent,#b8955a)]/40 anim-petals ${petal.size}`}
              style={{
                left: petal.left,
                top: "-5%",
                animationDelay: petal.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Preset: Gentle Radial Glow */}
      {!config.customAssetUrl && config.animationPreset === "gentle-glow" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[85%] h-[60%] rounded-full bg-[var(--template-accent,#b8955a)]/15 blur-3xl anim-glow" />
        </div>
      )}
    </div>
  );
}
