"use client";

import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import { AnimatePresence } from "motion/react";
import { InvitationOpeningCover } from "./InvitationOpeningCover";
import type { InvitationTemplateData } from "@/templates/types";
import { normalizeTemplateDesignConfig } from "@/lib/templates/template-design";

export interface InvitationExperienceProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
  designConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

type PlaybackStatus = "unstarted" | "playing" | "paused" | "loading" | "error";

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

export function InvitationExperience({
  data,
  mode = "live",
  designConfig,
  children,
}: InvitationExperienceProps) {
  // Opening cover state
  // In editor mode, default to opened so editing is immediately visible, but allow manual cover preview
  const [isOpened, setIsOpened] = useState<boolean>(() => {
    if (mode === "editor") return true;
    return !data.openingCoverEnabled;
  });

  // Music playback states
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>("unstarted");
  const [hasInteracted, setHasInteracted] = useState(false);

  const playerRef = useRef<YTPlayerInstance | null>(null);
  const isPlayerReadyRef = useRef<boolean>(false);
  const playRequestedRef = useRef<boolean>(false);

  const reactId = useId();
  const containerId = `yt-player-experience-${reactId.replace(/:/g, "")}`;

  const config = normalizeTemplateDesignConfig(designConfig);
  const youtubeVideoId = data.musicEnabled ? data.musicYoutubeVideoId : null;

  // 1. YouTube Iframe API Initialization (Strict single instance)
  useEffect(() => {
    if (!youtubeVideoId) return;

    let isMounted = true;

    function initPlayer() {
      if (!window.YT || !window.YT.Player) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      try {
        playerRef.current = new window.YT.Player(containerId, {
          videoId: youtubeVideoId || undefined,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: data.musicLoop ? 1 : 0,
            playlist: data.musicLoop && youtubeVideoId ? youtubeVideoId : undefined,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: { target: YTPlayerInstance }) => {
              if (!isMounted) return;
              isPlayerReadyRef.current = true;
              event.target.setVolume(35); // 35% standard volume

              // Race condition handler: fulfill pending play request immediately
              if (playRequestedRef.current) {
                try {
                  event.target.playVideo();
                  setPlaybackStatus("playing");
                } catch {
                  setPlaybackStatus("paused");
                }
              } else {
                setPlaybackStatus("paused");
              }
            },
            onStateChange: (event: { target: YTPlayerInstance; data: number }) => {
              if (!isMounted) return;
              if (event.data === 1) {
                // PLAYING
                setPlaybackStatus("playing");
              } else if (event.data === 2) {
                // PAUSED
                setPlaybackStatus("paused");
              } else if (event.data === 0 && data.musicLoop) {
                // ENDED -> replay
                if (playerRef.current) {
                  playerRef.current.playVideo();
                } else if (event.target) {
                  event.target.playVideo();
                }
              }
            },
            onError: (err: { data: number }) => {
              console.warn("[WALIMATUL] YouTube Experience Notice:", err);
              if (isMounted) setPlaybackStatus("error");
            },
          },
        });
      } catch (err) {
        console.warn("[WALIMATUL] YouTube Experience init error:", err);
        if (isMounted) setPlaybackStatus("error");
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById("youtube-iframe-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        if (isMounted) initPlayer();
      };
    }

    return () => {
      isMounted = false;
      isPlayerReadyRef.current = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [youtubeVideoId, data.musicLoop, containerId]);

  // 2. Open Invitation & Trigger User-Gesture Audio Playback
  const handleOpenInvitation = useCallback(() => {
    setIsOpened(true);
    setHasInteracted(true);

    if (data.musicEnabled && youtubeVideoId) {
      playRequestedRef.current = true;

      // If player is already loaded, invoke playVideo immediately on this click gesture
      if (playerRef.current && isPlayerReadyRef.current) {
        try {
          playerRef.current.playVideo();
          setPlaybackStatus("loading");
          setTimeout(() => {
            setPlaybackStatus((prev) => (prev === "loading" ? "playing" : prev));
          }, 600);
        } catch (e) {
          console.warn("[WALIMATUL] Error starting audio on opening gesture:", e);
        }
      }
    }
  }, [data.musicEnabled, youtubeVideoId]);

  // 3. Floating Play/Pause Toggle
  const toggleFloatingAudio = useCallback(() => {
    setHasInteracted(true);

    if (!playerRef.current || !isPlayerReadyRef.current) {
      return;
    }

    try {
      if (playbackStatus === "playing") {
        playerRef.current.pauseVideo();
        setPlaybackStatus("paused");
      } else {
        setPlaybackStatus("loading");
        playerRef.current.playVideo();
        setTimeout(() => {
          setPlaybackStatus((prev) => (prev === "loading" ? "playing" : prev));
        }, 600);
      }
    } catch {
      setPlaybackStatus("error");
    }
  }, [playbackStatus]);

  const isPlaying = playbackStatus === "playing";
  const isLoading = playbackStatus === "loading";
  const showFloatingPlayer =
    isOpened &&
    data.musicEnabled &&
    Boolean(youtubeVideoId) &&
    playbackStatus !== "error";

  const groomName = data.groomShortName || data.groomName || "Pengantin Lelaki";
  const brideName = data.brideShortName || data.brideName || "Pengantin Perempuan";

  return (
    <div className="relative min-h-screen">
      {/* Hidden Single YouTube IFrame Player */}
      {youtubeVideoId && (
        <div
          id={containerId}
          aria-hidden="true"
          className="w-0 h-0 opacity-0 pointer-events-none absolute -top-9999px -left-9999px overflow-hidden"
        />
      )}

      {/* Opening Cover Screen */}
      <AnimatePresence mode="wait">
        {!isOpened && data.openingCoverEnabled && (
          <InvitationOpeningCover
            groomName={groomName}
            brideName={brideName}
            weddingDate={data.weddingDate}
            onOpen={handleOpenInvitation}
            musicEnabled={data.musicEnabled && Boolean(youtubeVideoId)}
            theme={{
              surfaceColor: config.colors.surface || "#FCF8F3",
              textColor: config.colors.primaryText || "#174F3A",
              accentColor: config.colors.accent || "#B8955A",
              secondaryTextColor: config.colors.secondaryText || "#6B5E59",
              buttonBg: config.colors.buttonBg || "#174F3A",
              buttonText: config.colors.buttonText || "#FFFFFF",
              borderColor: config.colors.border || "#E8DDD5",
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Invitation Content */}
      <div className={!isOpened && data.openingCoverEnabled ? "pointer-events-none select-none" : ""}>
        {children}
      </div>

      {/* Floating Audio Control (Visible once invitation is opened) */}
      {showFloatingPlayer && (
        <div
          className="fixed bottom-6 right-6 z-40 transition-all duration-300"
          style={{ WebkitTransform: "translateZ(0)" }}
        >
          <button
            type="button"
            onClick={toggleFloatingAudio}
            aria-label={isPlaying ? "Jeda muzik latar" : "Mainkan muzik latar"}
            className={`group relative flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95 ${
              isPlaying
                ? "bg-[var(--primary)] text-white border-[var(--primary)] ring-4 ring-[var(--primary)]/20"
                : "bg-white/90 dark:bg-stone-900/90 text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)]"
            }`}
          >
            {isLoading ? (
              <span className="w-5 h-5 flex items-center justify-center animate-spin">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
              </span>
            ) : isPlaying ? (
              <div className="flex items-center gap-0.5 h-4 px-0.5" aria-hidden="true">
                <span className="w-0.75 bg-current rounded-full animate-[bounce_1s_infinite_100ms] h-4" />
                <span className="w-0.75 bg-current rounded-full animate-[bounce_1s_infinite_300ms] h-2.5" />
                <span className="w-0.75 bg-current rounded-full animate-[bounce_1s_infinite_200ms] h-3.5" />
                <span className="w-0.75 bg-current rounded-full animate-[bounce_1s_infinite_400ms] h-2" />
              </div>
            ) : (
              <span className="text-base leading-none" aria-hidden="true">
                🎵
              </span>
            )}

            <span className="hidden sm:inline text-xs font-semibold font-ui tracking-wide">
              {isPlaying ? "Muzik Dimainkan" : "Muzik Latar"}
            </span>

            {!hasInteracted && !isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--primary)]" />
              </span>
            )}
          </button>
        </div>
      )}

      {/* Editor Test Helper Badge (Editor mode only) */}
      {mode === "editor" && data.openingCoverEnabled && (
        <div className="fixed top-3 right-3 z-30">
          <button
            type="button"
            onClick={() => setIsOpened((prev) => !prev)}
            className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black text-white text-[11px] font-ui font-semibold shadow-md backdrop-blur-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{isOpened ? "👁️ Uji Skrin Pembukaan" : "✕ Tutup Skrin"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
