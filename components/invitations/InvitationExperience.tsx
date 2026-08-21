"use client";

import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import { AnimatePresence } from "motion/react";
import { InvitationOpeningCover } from "./InvitationOpeningCover";
import { FloatingMusicControl } from "@/components/music/FloatingMusicPlayer";
import type { InvitationTemplateData } from "@/templates/types";
import { normalizeTemplateDesignConfig } from "@/lib/templates/template-design";

export interface InvitationExperienceProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
  templateKey?: string;
  designConfig?: Record<string, unknown>;
  children: React.ReactNode;
}

type PlaybackStatus = "unstarted" | "playing" | "paused" | "loading" | "error";

// Declare YT window global for TypeScript
declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { target: YTPlayerInstance; data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

export function InvitationExperience({
  data,
  mode = "live",
  templateKey,
  designConfig,
  children,
}: InvitationExperienceProps) {
  // 1. Opening Cover State
  // In editor mode, default to opened so editing is immediately accessible, but allow manual testing
  const [isOpened, setIsOpened] = useState<boolean>(() => {
    if (mode === "editor") return true;
    return !data.openingCoverEnabled;
  });

  // 2. Playback State
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>("unstarted");
  const [hasInteracted, setHasInteracted] = useState(false);

  const playerRef = useRef<YTPlayerInstance | null>(null);
  const isPlayerReadyRef = useRef<boolean>(false);
  const playRequestedRef = useRef<boolean>(false);

  const reactId = useId();
  const containerId = `yt-experience-player-${reactId.replace(/:/g, "")}`;

  const config = normalizeTemplateDesignConfig(designConfig);
  const youtubeVideoId = data.musicEnabled ? data.musicYoutubeVideoId : null;

  // 3. YouTube IFrame API Lifecycle (Single Authoritative Player)
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
            playsinline: 1,
            enablejsapi: 1,
            loop: data.musicLoop ? 1 : 0,
            playlist: data.musicLoop && youtubeVideoId ? youtubeVideoId : undefined,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: { target: YTPlayerInstance }) => {
              if (!isMounted) return;
              isPlayerReadyRef.current = true;

              try {
                event.target.unMute();
                event.target.setVolume(35); // 35% conservative volume
              } catch {
                // Ignore initial audio setup errors
              }

              // Race condition resolution: If user already clicked "Buka Jemputan", fulfill immediately
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
              } else if (event.data === 3) {
                // BUFFERING
                setPlaybackStatus("loading");
              } else if (event.data === 0 && data.musicLoop) {
                // ENDED -> loop
                if (playerRef.current) {
                  playerRef.current.playVideo();
                } else if (event.target) {
                  event.target.playVideo();
                }
              }
            },
            onError: (err: { data: number }) => {
              console.warn("[WALIMATUL] YouTube Player Notice:", err);
              if (isMounted) setPlaybackStatus("error");
            },
          },
        });
      } catch (err) {
        console.warn("[WALIMATUL] YouTube init error:", err);
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
          // ignore cleanup errors
        }
        playerRef.current = null;
      }
    };
  }, [youtubeVideoId, data.musicLoop, containerId]);

  // 4. Open Invitation & Trigger Synchronous User-Gesture Audio Playback
  const handleOpenInvitation = useCallback(() => {
    setIsOpened(true);
    setHasInteracted(true);

    if (data.musicEnabled && youtubeVideoId) {
      playRequestedRef.current = true;

      // When player is ready, call playVideo directly within the click event turn
      if (playerRef.current && isPlayerReadyRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.playVideo();
          setPlaybackStatus("loading");
          setTimeout(() => {
            setPlaybackStatus((prev) => (prev === "loading" ? "playing" : prev));
          }, 600);
        } catch (e) {
          console.warn("[WALIMATUL] Audio start notice on open gesture:", e);
        }
      }
    }
  }, [data.musicEnabled, youtubeVideoId]);

  // 5. Floating Music Button Toggle
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
        playerRef.current.unMute();
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

  // Canonical couple name resolution (never automatically truncated)
  const groomDisplayName = data.groomShortName || data.groomName || "Pengantin Lelaki";
  const brideDisplayName = data.brideShortName || data.brideName || "Pengantin Perempuan";

  // Theme resolution
  const resolvedTemplateKey = templateKey || "blush-garden";

  return (
    <div className="relative min-h-screen">
      {/* 
        Single Hidden YouTube IFrame Container.
        Uses a fixed 1px footprint so mobile WebKit/Safari & Chrome do not suspend offscreen video playback.
      */}
      {youtubeVideoId && (
        <div
          id={containerId}
          aria-hidden="true"
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "1px",
            height: "1px",
            opacity: 0.001,
            pointerEvents: "none",
            zIndex: -10,
          }}
        />
      )}

      {/* Opening Cover Screen */}
      <AnimatePresence mode="wait">
        {!isOpened && data.openingCoverEnabled && (
          <InvitationOpeningCover
            groomName={groomDisplayName}
            brideName={brideDisplayName}
            weddingDate={data.weddingDate}
            onOpen={handleOpenInvitation}
            theme={{
              templateKey: resolvedTemplateKey,
              backgroundColor: config.colors.background || "#FAF7F2",
              surfaceColor: config.colors.surfaceCard || "#FFFFFF",
              textColor: config.colors.primaryText || "#174F3A",
              accentColor: config.colors.accent || "#B8955A",
              secondaryTextColor: config.colors.secondaryText || "#6B5E59",
              buttonBg: config.colors.buttonBg || "#174F3A",
              buttonText: config.colors.buttonText || "#FFFFFF",
              borderColor: config.colors.border || "#E8DDD5",
              fontScript: "var(--template-font-script)",
              fontHeading: "var(--template-font-heading)",
              fontBody: "var(--template-font-body)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Invitation Content */}
      <div className={!isOpened && data.openingCoverEnabled ? "pointer-events-none select-none" : ""}>
        {children}
      </div>

      {/* Floating Audio Control (Synchronized with single player instance) */}
      {showFloatingPlayer && (
        <FloatingMusicControl
          isPlaying={isPlaying}
          isLoading={isLoading}
          hasInteracted={hasInteracted}
          onToggle={toggleFloatingAudio}
        />
      )}

      {/* Editor Preview Helper Controls (Editor mode only) */}
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
