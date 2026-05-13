import { formatGhs } from "./products";

export type PaystackVerificationResult = {
  configured: boolean;
  reference: string;
  status: "success" | "failed" | "pending" | "unknown";
  amount?: number;
  currency?: string;
  paidAt?: string;
  channel?: string;
  customerEmail?: string;
  notes: string[];
};

async function fetchJsonWithTimeout<T>(url: string, init?: RequestInit, timeoutMs = 5500): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {})
      }
    });
    if (!response.ok) throw new Error(`status_${response.status}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function verifyPaystackReference(reference: string): Promise<PaystackVerificationResult> {
  const cleanReference = reference.trim();
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

  if (!secretKey) {
    return {
      configured: false,
      reference: cleanReference,
      status: "unknown",
      notes: ["PAYSTACK_SECRET_KEY is not configured, so the bot cannot verify this reference automatically yet."]
    };
  }

  try {
    const json = await fetchJsonWithTimeout<{
      status?: boolean;
      message?: string;
      data?: {
        status?: string;
        reference?: string;
        amount?: number;
        currency?: string;
        paid_at?: string;
        channel?: string;
        customer?: { email?: string };
      };
    }>(`https://api.paystack.co/transaction/verify/${encodeURIComponent(cleanReference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` }
    });
    const data = json.data;
    const status = data?.status === "success" ? "success" : data?.status === "failed" ? "failed" : data?.status ? "pending" : "unknown";

    return {
      configured: true,
      reference: data?.reference || cleanReference,
      status,
      amount: data?.amount,
      currency: data?.currency,
      paidAt: data?.paid_at,
      channel: data?.channel,
      customerEmail: data?.customer?.email,
      notes: [
        json.message || "Paystack verification completed.",
        status === "success" ? "Paystack reports this transaction as successful." : "Do not fulfill automatically unless the status is success."
      ]
    };
  } catch {
    return {
      configured: true,
      reference: cleanReference,
      status: "unknown",
      notes: ["Paystack verification failed or timed out. Check the reference in the Paystack dashboard before fulfillment."]
    };
  }
}

export function formatPaystackVerification(result: PaystackVerificationResult, sessionId?: string): string {
  const amount =
    typeof result.amount === "number"
      ? result.currency === "GHS"
        ? formatGhs(result.amount / 100)
        : `${result.currency || "currency"} ${result.amount / 100}`
      : undefined;

  return [
    "Paystack Payment Check",
    "",
    sessionId ? `Session ID: ${sessionId}` : undefined,
    `Reference: ${result.reference}`,
    `Status: ${result.status}`,
    result.configured ? "Verifier: Paystack API" : "Verifier: Not configured",
    amount ? `Amount: ${amount}` : undefined,
    result.currency ? `Currency: ${result.currency}` : undefined,
    result.channel ? `Channel: ${result.channel}` : undefined,
    result.paidAt ? `Paid at: ${result.paidAt}` : undefined,
    result.customerEmail ? `Customer email: ${result.customerEmail}` : undefined,
    "",
    "Notes:",
    ...result.notes.map((note) => `- ${note}`),
    "",
    "Only fulfill the paid service once the reference is confirmed and not already used."
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}
