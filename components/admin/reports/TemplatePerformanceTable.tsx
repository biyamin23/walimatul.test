"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TemplatePerformanceItem } from "@/types/reports";

interface Props {
  templates: TemplatePerformanceItem[];
  rangeLabel: string;
}

type SortField = "revenue" | "invitations" | "paidOrders" | "conversion";

function fmtMYR(val: number): string {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(val);
}

export function TemplatePerformanceTable({ templates, rangeLabel }: Props) {
  const [sortBy, setSortBy] = useState<SortField>("revenue");

  const sortedList = [...templates].sort((a, b) => {
    if (sortBy === "revenue") {
      return b.revenue - a.revenue || b.paidOrdersCount - a.paidOrdersCount;
    }
    if (sortBy === "invitations") {
      return b.invitationsCount - a.invitationsCount || b.revenue - a.revenue;
    }
    if (sortBy === "paidOrders") {
      return b.paidOrdersCount - a.paidOrdersCount || b.revenue - a.revenue;
    }
    return b.conversionRate - a.conversionRate || b.revenue - a.revenue;
  });

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-0.5">
            Prestasi Produk
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text)]">
            Prestasi Komersial Templat
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
            Pecahan penggunaan, pesanan disahkan, dan sumbangan pendapatan ({rangeLabel})
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] self-start sm:self-auto">
          <span className="text-[10px] font-semibold uppercase text-[var(--text-muted)] font-ui px-2">
            Susun:
          </span>
          {(
            [
              { field: "revenue", label: "Pendapatan" },
              { field: "invitations", label: "Penggunaan" },
              { field: "paidOrders", label: "Pesanan" },
              { field: "conversion", label: "Penukaran" },
            ] as const
          ).map((btn) => (
            <button
              key={btn.field}
              onClick={() => setSortBy(btn.field)}
              className="px-2.5 py-1 rounded-lg text-xs font-ui font-semibold transition-all"
              style={{
                background: sortBy === btn.field ? "var(--primary)" : "transparent",
                color: sortBy === btn.field ? "#ffffff" : "var(--text-muted)",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-soft)]">
        <table className="w-full text-left text-xs font-ui border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-soft)] bg-[var(--surface-warm)] text-[var(--text-muted)] font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3.5 px-4">Templat</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Penggunaan (Dicipta)</th>
              <th className="py-3.5 px-4 text-right">Pesanan Berbayar</th>
              <th className="py-3.5 px-4 text-right">Kadar Penukaran</th>
              <th className="py-3.5 px-4 text-right">Pendapatan</th>
              <th className="py-3.5 px-4 text-right">Sumbangan (Share)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-soft)] bg-white">
            {sortedList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[var(--text-muted)] font-ui">
                  Tiada templat direkodkan.
                </td>
              </tr>
            ) : (
              sortedList.map((tpl) => (
                <tr key={tpl.id} className="hover:bg-[var(--surface-warm)]/50 transition-colors">
                  {/* Template Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-[var(--border)] relative">
                        {tpl.thumbnail_url ? (
                          <Image
                            src={tpl.thumbnail_url}
                            alt={tpl.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            🎨
                          </div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/admin/templates/${tpl.id}/edit`}
                          className="font-semibold text-[var(--text)] hover:text-[var(--primary)] hover:underline"
                        >
                          {tpl.name}
                        </Link>
                        <span className="text-[11px] text-[var(--text-muted)] block font-mono">
                          {tpl.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        tpl.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {tpl.status === "active" ? "Aktif" : "Arkib"}
                    </span>
                  </td>

                  {/* Invitations Count */}
                  <td className="py-3.5 px-4 text-right font-medium text-[var(--text)]">
                    {tpl.invitationsCount}
                  </td>

                  {/* Paid Orders Count */}
                  <td className="py-3.5 px-4 text-right font-medium text-emerald-700">
                    {tpl.paidOrdersCount}
                  </td>

                  {/* Conversion */}
                  <td className="py-3.5 px-4 text-right font-semibold text-[var(--text)]">
                    {tpl.conversionRate.toFixed(1)}%
                  </td>

                  {/* Revenue from orders.amount */}
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                    {fmtMYR(tpl.revenue)}
                  </td>

                  {/* Share Bar */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${(tpl.revenueShare * 100).toFixed(0)}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-700 text-[11px] min-w-[36px]">
                        {(tpl.revenueShare * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
