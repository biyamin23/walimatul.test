/**
 * WALIMATUL — YouTube URL Parsing & Validation Utility
 *
 * Extracts and validates YouTube video IDs from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 *
 * Rules:
 * - Only official YouTube video IDs (11 characters: [a-zA-Z0-9_-]{11}) are accepted.
 * - Never allow arbitrary iframe URLs or non-YouTube domains.
 */

const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. If user entered just the 11-char ID
  if (YOUTUBE_VIDEO_ID_REGEX.test(trimmed)) {
    return trimmed;
  }

  // 2. Parse URL
  try {
    let urlString = trimmed;
    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      urlString = `https://${urlString}`;
    }

    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    // Case A: youtu.be/VIDEO_ID
    if (host === "youtu.be") {
      const pathname = parsed.pathname.slice(1); // remove leading '/'
      const id = pathname.split("/")[0]?.split("?")[0];
      if (id && YOUTUBE_VIDEO_ID_REGEX.test(id)) {
        return id;
      }
      return null;
    }

    // Case B: youtube.com or m.youtube.com
    if (host === "youtube.com" || host === "m.youtube.com") {
      // 1. Query parameter ?v=VIDEO_ID
      const v = parsed.searchParams.get("v");
      if (v && YOUTUBE_VIDEO_ID_REGEX.test(v)) {
        return v;
      }

      // 2. Shorts: /shorts/VIDEO_ID
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.replace("/shorts/", "").split("/")[0];
        if (id && YOUTUBE_VIDEO_ID_REGEX.test(id)) {
          return id;
        }
      }

      // 3. Embed: /embed/VIDEO_ID
      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.replace("/embed/", "").split("/")[0];
        if (id && YOUTUBE_VIDEO_ID_REGEX.test(id)) {
          return id;
        }
      }

      // 4. Live / Watch path alternatives: /live/VIDEO_ID
      if (parsed.pathname.startsWith("/live/")) {
        const id = parsed.pathname.replace("/live/", "").split("/")[0];
        if (id && YOUTUBE_VIDEO_ID_REGEX.test(id)) {
          return id;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function isValidYouTubeUrl(input: string | null | undefined): boolean {
  return extractYouTubeVideoId(input) !== null;
}
