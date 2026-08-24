import React from "react";
import { getPaymentStatusInfo } from "@/lib/constants/payment";

interface AdminStatusBadgeProps {
  type: "invitation" | "payment" | "role";
  status: string;
  expiresAt?: string | null;
}

export function AdminStatusBadge({
  type,
  status,
  expiresAt,
}: AdminStatusBadgeProps) {
  if (type === "invitation") {
    const now = new Date().toISOString();
    const isExpired =
      status === "expired" ||
      (status === "published" && expiresAt && expiresAt < now);

    if (isExpired) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider bg-red-50 text-red-800 border border-red-200">
          Tamat Tempoh
        </span>
      );
    }

    if (status === "published") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          Diterbitkan
        </span>
      );
    }

    if (status === "archived") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
          Diarkibkan
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
        Draf
      </span>
    );
  }

  if (type === "payment") {
    if (status === "no_order") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider bg-stone-100 text-stone-500 border border-stone-200">
          Tiada Pesanan
        </span>
      );
    }

    const info = getPaymentStatusInfo(status);
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider border ${info.badgeClass}`}
      >
        {info.label}
      </span>
    );
  }

  if (type === "role") {
    if (status === "admin") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-bold uppercase tracking-wider bg-[var(--primary)] text-white">
          Admin
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-medium uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
        Pelanggan
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-medium uppercase tracking-wider bg-stone-100 text-stone-700">
      {status}
    </span>
  );
}
