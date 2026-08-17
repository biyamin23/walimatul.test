/**
 * WALIMATUL — Blush Garden Template (Phase 3 Placeholder)
 *
 * This is a structural placeholder for the Blush Garden invitation design.
 * The full, production-ready Blush Garden template will be implemented in Phase 4.
 *
 * Current state: renders a branded preview placeholder with couple + date info.
 * Phase 4: full Playfair Display / blush / ivory / muted gold invitation design.
 *
 * @see templates/types.ts for InvitationTemplateData contract
 * @see templates/blush-garden/config.ts for static config
 */

import type { TemplateComponentProps } from "../types";

export function BlushGardenTemplate({ data, mode = "live" }: TemplateComponentProps) {
  const groomDisplay = data.groomShortName || data.groomName || "Groom";
  const brideDisplay = data.brideShortName || data.brideName || "Bride";

  // Format wedding date for display
  let formattedDate = "Date TBC";
  if (data.weddingDate) {
    try {
      formattedDate = new Date(data.weddingDate).toLocaleDateString("en-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      formattedDate = data.weddingDate;
    }
  }

  return (
    <div
      style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        minHeight: "100vh",
        background: "#FCF8F3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        color: "#174F3A",
      }}
    >
      {/* Phase 3 placeholder indicator — remove in Phase 4 */}
      {mode === "preview" && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontSize: "10px",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#B8955A",
            background: "#FCF8F3",
            border: "1px solid #F5DDD6",
            padding: "4px 10px",
            borderRadius: "999px",
          }}
        >
          Preview
        </div>
      )}

      {/* Decorative top border */}
      <div
        style={{
          width: "60px",
          height: "2px",
          background: "linear-gradient(90deg, #B8955A, #F5DDD6)",
          marginBottom: "2rem",
        }}
      />

      {/* Template name (placeholder only) */}
      <p
        style={{
          fontSize: "10px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#B8955A",
          fontFamily: "Inter, sans-serif",
          marginBottom: "2rem",
        }}
      >
        Blush Garden
      </p>

      {/* Couple names */}
      <h1
        style={{
          fontSize: "clamp(2rem, 8vw, 3.5rem)",
          fontWeight: 400,
          lineHeight: 1.1,
          textAlign: "center",
          color: "#174F3A",
          margin: "0 0 1rem",
        }}
      >
        {groomDisplay}
        <br />
        <span style={{ color: "#B8955A", fontSize: "0.6em" }}>&amp;</span>
        <br />
        {brideDisplay}
      </h1>

      {/* Separator */}
      <div
        style={{
          width: "40px",
          height: "1px",
          background: "#B8955A",
          margin: "1.5rem auto",
        }}
      />

      {/* Wedding date */}
      <p
        style={{
          fontSize: "0.875rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#174F3A",
          fontFamily: "Inter, sans-serif",
          opacity: 0.7,
          marginBottom: "0.5rem",
        }}
      >
        {formattedDate}
      </p>

      {/* Venue */}
      {data.venueName && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "#174F3A",
            fontFamily: "Inter, sans-serif",
            opacity: 0.6,
            textAlign: "center",
            maxWidth: "300px",
          }}
        >
          {data.venueName}
        </p>
      )}

      {/* Decorative bottom border */}
      <div
        style={{
          width: "60px",
          height: "2px",
          background: "linear-gradient(90deg, #F5DDD6, #B8955A)",
          marginTop: "2rem",
        }}
      />

      {/* Phase 4 placeholder notice (only shown outside live mode) */}
      {mode !== "live" && (
        <p
          style={{
            marginTop: "3rem",
            fontSize: "11px",
            fontFamily: "Inter, sans-serif",
            color: "#B8955A",
            textAlign: "center",
            opacity: 0.6,
          }}
        >
          Full Blush Garden design — Phase 4
        </p>
      )}
    </div>
  );
}
