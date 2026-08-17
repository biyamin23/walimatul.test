/**
 * WALIMATUL — Payment Configuration Constants
 *
 * Central source of truth for payment methods, pricing, validity,
 * QR asset references, and upload constraints.
 */

export const PAYMENT_CONFIG = {
  method: "tng_ewallet_qr",
  methodLabel: "Touch ’n Go eWallet",
  currency: "MYR",
  currencySymbol: "RM",
  amount: 49.0,
  amountDisplay: "RM49",
  amountDetailedDisplay: "RM49.00",
  validityMonths: 6,
  validityLabel: "6 bulan akses",

  // Canonical QR asset path
  // Real Touch 'n Go QR code provided in /public/images/payment/
  qrAssetPath: "/images/payment/tng-payment-qr.JPG",

  // Upload constraints
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".pdf"],
  maxSizeBytes: 5 * 1024 * 1024, // 5 MB
  maxSizeLabel: "5 MB",

// Storage bucket name
  storageBucket: "payment-proofs",
} as const;

export type PaymentMethod = typeof PAYMENT_CONFIG.method;

export type CanonicalPaymentStatus =
  | "pending_payment"
  | "pending_verification"
  | "paid"
  | "payment_rejected"
  | "cancelled"
  | "refunded";

export interface PaymentStatusInfo {
  key: CanonicalPaymentStatus;
  label: string;
  badgeClass: string;
  description: string;
}

export const PAYMENT_STATUS_CONFIG: Record<
  CanonicalPaymentStatus,
  PaymentStatusInfo
> = {
  pending_verification: {
    key: "pending_verification",
    label: "Menunggu Pengesahan",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    description:
      "Klien telah memuat naik bukti pembayaran dan sedang menunggu semakan admin.",
  },
  paid: {
    key: "paid",
    label: "Telah Dibayar",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    description: "Pembayaran telah disahkan dan jemputan telah diterbitkan.",
  },
  payment_rejected: {
    key: "payment_rejected",
    label: "Bayaran Ditolak",
    badgeClass: "bg-red-50 text-red-800 border-red-200",
    description:
      "Pembayaran telah ditolak dan klien boleh memuat naik semula bukti.",
  },
  pending_payment: {
    key: "pending_payment",
    label: "Menunggu Bayaran",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Pesanan telah dibuat dan menunggu klien membuat bayaran.",
  },
  cancelled: {
    key: "cancelled",
    label: "Dibatalkan",
    badgeClass: "bg-stone-100 text-stone-600 border-stone-200",
    description: "Pesanan telah dibatalkan.",
  },
  refunded: {
    key: "refunded",
    label: "Dipulangkan",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    description: "Bayaran telah dipulangkan.",
  },
};

export function getPaymentStatusInfo(status: string): PaymentStatusInfo {
  return (
    PAYMENT_STATUS_CONFIG[status as CanonicalPaymentStatus] || {
      key: status as CanonicalPaymentStatus,
      label: status,
      badgeClass: "bg-stone-100 text-stone-600 border-stone-200",
      description: "",
    }
  );
}

