"use client";

import React, { useState, useEffect, useRef, useCallback, useId } from "react";

export interface FloatingMusicPlayerProps {
  youtubeVideoId: string | null;
  loop?: boolean;
  className?: string;
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
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

export function FloatingMusicPlayer({
  youtubeVideoId,
  loop = true,
  className = "",
}: FloatingMusicPlayerProps) {
  const [status, setStatus] = useState<PlaybackStatus>("unstarted");
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const reactId = useId();
  const containerId = `yt-player-${reactId.replace(/:/g, "")}`;

  // Load YouTube Iframe API once
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
            loop: loop ? 1 : 0,
            playlist: loop ? youtubeVideoId : undefined,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              event.target.setVolume(35); // Conservative volume (35%)
              setStatus("paused");
            },
            onStateChange: (event) => {
              if (!isMounted) return;
              if (event.data === 1) {
                // PLAYING
                setStatus("playing");
              } else if (event.data === 2) {
                // PAUSED
                setStatus("paused");
              } else if (event.data === 0 && loop) {
                // ENDED -> replay if loop
                if (playerRef.current) {
                  playerRef.current.playVideo();
                } else if (event.target) {
                  event.target.playVideo();
                }
              }
            },
            onError: (err) => {
              console.warn("[WALIMATUL] YouTube Player Notice:", err);
              if (isMounted) setStatus("error");
            },
          },
        });
      } catch (err) {
        console.warn("[WALIMATUL] YouTube init error:", err);
        if (isMounted) setStatus("error");
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
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        playerRef.current = null;
      }
    };
  }, [youtubeVideoId, loop, containerId]);

  const togglePlayback = useCallback(() => {
    setHasInteracted(true);

    if (!playerRef.current) {
      return;
    }

    try {
      if (status === "playing") {
        playerRef.current.pauseVideo();
        setStatus("paused");
      } else {
        setStatus("loading");
        playerRef.current.playVideo();
        // Fallback status change in case state change event is delayed
        setTimeout(() => {
          setStatus((prev) => (prev === "loading" ? "playing" : prev));
        }, 800);
      }
    } catch {
      setStatus("error");
    }
  }, [status]);

  if (!youtubeVideoId || status === "error") {
    return null;
  }

  const isPlaying = status === "playing";
  const isLoading = status === "loading";

  return (
    <>
      {/* Hidden YouTube Iframe Container */}
      <div
        id={containerId}
        aria-hidden="true"
        className="w-0 h-0 opacity-0 pointer-events-none absolute -top-9999px -left-9999px overflow-hidden"
      />

      {/* Floating Action Button */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${className}`}
        style={{ WebkitTransform: "translateZ(0)" }}
      >
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Jeda muzik latar" : "Mainkan muzik latar"}
          className={`group relative flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95 ${
            isPlaying
              ? "bg-[var(--primary)] text-white border-[var(--primary)] ring-4 ring-[var(--primary)]/20"
              : "bg-white/90 dark:bg-stone-900/90 text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)]"
          }`}
        >
          {/* Animated sound bars or play icon */}
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

          {/* First-time prompt pulse on unstarted state */}
          {!hasInteracted && !isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--primary)]" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}
