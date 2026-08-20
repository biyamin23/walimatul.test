import React from "react";
import Image from "next/image";
import type { TemplateDesignOverlay } from "@/lib/templates/template-design";

export interface OverlayAnimationProps {
  config: TemplateDesignOverlay;
}

export function OverlayAnimation({ config }: OverlayAnimationProps) {
  const preset = config.preset || config.animationPreset || "none";

  if (!config.enabled || preset === "none") {
    return null;
  }

  const speedMultiplier =
    config.speed === "slow" ? 1.6 : config.speed === "fast" ? 0.6 : 1.0;

  const floatDuration = `${(8 * speedMultiplier).toFixed(1)}s`;
  const sparkleDuration = `${(3.5 * speedMultiplier).toFixed(1)}s`;
  const bokehDuration = `${(10 * speedMultiplier).toFixed(1)}s`;
  const petalDuration = `${(7 * speedMultiplier).toFixed(1)}s`;
  const glowDuration = `${(5 * speedMultiplier).toFixed(1)}s`;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-20 select-none"
      style={{ opacity: Math.max(0.2, config.opacity) }}
    >
      <style>{`
        @keyframes walimatul-float {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-24px) rotate(6deg) scale(1.05); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }

        @keyframes walimatul-sparkle {
          0%, 100% { opacity: 0.15; transform: scale(0.6) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(45deg); filter: drop-shadow(0 0 6px var(--template-accent, #B8955A)); }
        }

        @keyframes walimatul-bokeh {
          0% { transform: translate(0, 0) scale(0.9); opacity: 0.3; }
          50% { transform: translate(25px, -35px) scale(1.2); opacity: 0.7; }
          100% { transform: translate(0, 0) scale(0.9); opacity: 0.3; }
        }

        @keyframes walimatul-petal {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% {
            transform: translateY(1200px) translateX(60px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes walimatul-glow {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.75; transform: scale(1.08); filter: drop-shadow(0 0 20px var(--template-accent, #B8955A)); }
        }

        .anim-walimatul-float {
          animation: walimatul-float ${floatDuration} ease-in-out infinite;
        }

        .anim-walimatul-sparkle {
          animation: walimatul-sparkle ${sparkleDuration} ease-in-out infinite;
        }

        .anim-walimatul-bokeh {
          animation: walimatul-bokeh ${bokehDuration} ease-in-out infinite;
        }

        .anim-walimatul-petal {
          animation: walimatul-petal ${petalDuration} linear infinite;
        }

        .anim-walimatul-glow {
          animation: walimatul-glow ${glowDuration} ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-walimatul-float,
          .anim-walimatul-sparkle,
          .anim-walimatul-bokeh,
          .anim-walimatul-petal,
          .anim-walimatul-glow {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* ── Preset A: Custom Uploaded Asset ── */}
      {config.customAssetUrl && (() => {
        const sizeScale =
          config.ornamentSize === "small"
            ? 1.0
            : config.ornamentSize === "large"
            ? 2.3
            : 1.6; // default medium (~72-88px)

        return (
          <div className="absolute inset-0 pointer-events-none">
            {[
              { top: "6%", left: "10%", baseSize: 48, delay: "0s" },
              { top: "22%", right: "8%", baseSize: 42, delay: "1.8s" },
              { top: "42%", left: "6%", baseSize: 46, delay: "3.4s" },
              { top: "60%", right: "10%", baseSize: 52, delay: "1.2s" },
              { top: "78%", left: "12%", baseSize: 40, delay: "2.6s" },
              { top: "90%", right: "6%", baseSize: 44, delay: "4.2s" },
            ].map((pos, idx) => {
              const actualSize = Math.round(pos.baseSize * sizeScale);
              return (
                <div
                  key={idx}
                  className={`absolute pointer-events-none ${
                    preset === "petals"
                      ? "anim-walimatul-petal"
                      : preset === "sparkle"
                      ? "anim-walimatul-sparkle"
                      : "anim-walimatul-float"
                  }`}
                  style={{
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                    animationDelay: pos.delay,
                    width: actualSize,
                    height: actualSize,
                  }}
                >
                  <Image
                    src={config.customAssetUrl!}
                    alt=""
                    width={actualSize}
                    height={actualSize}
                    className="w-full h-full object-contain pointer-events-none"
                    unoptimized
                  />
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* ── Preset B: Soft Float (Built-in Motifs if no custom asset) ── */}
      {!config.customAssetUrl && preset === "soft-float" && (
        <div className="absolute inset-0 pointer-events-none text-[var(--template-accent,#B8955A)]">
          {[
            { top: "8%", left: "10%", delay: "0s", symbol: "✦", size: "text-lg" },
            { top: "18%", right: "12%", delay: "2.1s", symbol: "✧", size: "text-sm" },
            { top: "35%", left: "8%", delay: "4.2s", symbol: "❀", size: "text-base" },
            { top: "52%", right: "10%", delay: "1.5s", symbol: "✦", size: "text-base" },
            { top: "68%", left: "12%", delay: "3.1s", symbol: "✧", size: "text-sm" },
            { top: "82%", right: "14%", delay: "0.8s", symbol: "✿", size: "text-base" },
            { top: "94%", left: "16%", delay: "2.8s", symbol: "✦", size: "text-xs" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`absolute pointer-events-none anim-walimatul-float font-serif ${item.size}`}
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                animationDelay: item.delay,
              }}
            >
              {item.symbol}
            </div>
          ))}
        </div>
      )}

      {/* ── Preset C: Sparkle (Twinkling Glimmers) ── */}
      {!config.customAssetUrl && preset === "sparkle" && (
        <div className="absolute inset-0 pointer-events-none text-[var(--template-accent,#B8955A)]">
          {[
            { top: "7%", left: "18%", delay: "0s", size: "text-base", symbol: "✦" },
            { top: "15%", right: "14%", delay: "1.2s", size: "text-xs", symbol: "✧" },
            { top: "28%", left: "10%", delay: "2.4s", size: "text-sm", symbol: "✨" },
            { top: "40%", right: "20%", delay: "0.7s", size: "text-xs", symbol: "✦" },
            { top: "54%", left: "14%", delay: "1.9s", size: "text-base", symbol: "✧" },
            { top: "66%", right: "12%", delay: "3.1s", size: "text-sm", symbol: "✨" },
            { top: "78%", left: "18%", delay: "0.4s", size: "text-xs", symbol: "✦" },
            { top: "89%", right: "16%", delay: "2.2s", size: "text-sm", symbol: "✧" },
          ].map((p, idx) => (
            <div
              key={idx}
              className={`absolute pointer-events-none anim-walimatul-sparkle ${p.size}`}
              style={{
                top: p.top,
                left: p.left,
                right: p.right,
                animationDelay: p.delay,
              }}
            >
              {p.symbol}
            </div>
          ))}
        </div>
      )}

      {/* ── Preset D: Bokeh Light (Luminous Orbs) ── */}
      {!config.customAssetUrl && preset === "bokeh" && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { top: "8%", left: "12%", size: "w-28 h-28", delay: "0s" },
            { top: "30%", right: "8%", size: "w-36 h-36", delay: "3.2s" },
            { top: "55%", left: "6%", size: "w-32 h-32", delay: "1.6s" },
            { top: "75%", right: "12%", size: "w-40 h-40", delay: "4.5s" },
            { top: "90%", left: "15%", size: "w-28 h-28", delay: "2.1s" },
          ].map((b, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full bg-[var(--template-accent,#B8955A)]/35 blur-2xl anim-walimatul-bokeh pointer-events-none ${b.size}`}
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

      {/* ── Preset E: Falling Petals ── */}
      {!config.customAssetUrl && preset === "petals" && (
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: "12%", delay: "0s", size: "w-3.5 h-4.5" },
            { left: "28%", delay: "2.8s", size: "w-3 h-4" },
            { left: "46%", delay: "1.4s", size: "w-4 h-5" },
            { left: "64%", delay: "4.2s", size: "w-3 h-3.5" },
            { left: "82%", delay: "0.8s", size: "w-3.5 h-4.5" },
            { left: "92%", delay: "3.5s", size: "w-2.5 h-3.5" },
          ].map((petal, idx) => (
            <div
              key={idx}
              className={`absolute rounded-[100%_0%_100%_0%] bg-[var(--template-accent,#B8955A)]/60 shadow-xs anim-walimatul-petal pointer-events-none ${petal.size}`}
              style={{
                left: petal.left,
                top: "-40px",
                animationDelay: petal.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Preset F: Gentle Radial Glow ── */}
      {!config.customAssetUrl && preset === "gentle-glow" && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-around">
          <div className="w-[85%] h-[350px] rounded-full bg-[var(--template-accent,#B8955A)]/25 blur-3xl anim-walimatul-glow" />
          <div className="w-[85%] h-[350px] rounded-full bg-[var(--template-accent,#B8955A)]/20 blur-3xl anim-walimatul-glow" style={{ animationDelay: "2.5s" }} />
        </div>
      )}
    </div>
  );
}
