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
  // Replace with real Touch 'n Go merchant/personal QR asset in production
  qrAssetPath: "/images/payment/tng-payment-qr.svg",

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
