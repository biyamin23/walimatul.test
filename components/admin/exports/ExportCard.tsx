import React from "react";

export interface ExportCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  endpoint: string;
  fields: string[];
  rangeParams: string;
}

export function ExportCard({
  id,
  title,
  description,
  icon,
  endpoint,
  fields,
  rangeParams,
}: ExportCardProps) {
  const downloadUrl = `${endpoint}${rangeParams ? `?${rangeParams}` : ""}`;

  return (
    <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between space-y-4 hover:border-[var(--primary)]/40 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg bg-[var(--surface-warm)] border border-[var(--border-soft)]">
              {icon}
            </span>
            <div>
              <h3 className="text-base font-bold font-display text-[var(--text)]">
                {title}
              </h3>
              <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Fields list */}
        <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] font-ui block">
            Medan Data:
          </span>
          <p className="text-[11px] font-mono text-gray-700 leading-relaxed break-words">
            {fields.join(", ")}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border-soft)]">
        <a
          id={`btn-download-${id}`}
          href={downloadUrl}
          download
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-2xs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Muat Turun CSV
        </a>
      </div>
    </div>
  );
}
