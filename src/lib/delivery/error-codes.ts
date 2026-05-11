export type DeliveryFailureCode =
  | "INVALID_EMAIL"
  | "PROVIDER_REJECTED"
  | "RATE_LIMITED"
  | "SMTP_POOL_EXHAUSTED"
  | "CERT_GENERATION_FAILED"
  | "UNKNOWN";

export function mapFailureCode(message?: string): DeliveryFailureCode {
  const m = (message || "").toLowerCase();
  if (!m) return "UNKNOWN";
  if (m.includes("invalid") && m.includes("email")) return "INVALID_EMAIL";
  if (m.includes("rate") && m.includes("limit")) return "RATE_LIMITED";
  if (m.includes("smtp") && m.includes("credential")) return "SMTP_POOL_EXHAUSTED";
  if (m.includes("certificate") && m.includes("failed")) return "CERT_GENERATION_FAILED";
  if (m.includes("reject") || m.includes("denied") || m.includes("forbidden")) return "PROVIDER_REJECTED";
  return "UNKNOWN";
}
