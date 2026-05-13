import { formatGhs } from "./products";
import { PRODUCT_BY_ID, type ProductId } from "./products";

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

export type PaystackInitializeResult =
  | {
      ok: true;
      authorizationUrl: string;
      accessCode: string;
      reference: string;
      sessionId: string;
      productId: ProductId;
    }
  | {
      ok: false;
      sessionId: string;
      productId: ProductId;
      reason: string;
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

function createPaystackReference(sessionId: string, productId: ProductId): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${sessionId}-${productId.slice(0, 10)}-${suffix}`.replace(/[^A-Za-z0-9\-.=]/g, "-");
}

function siteUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/+$/, "") || undefined;
}

export async function initializePaystackTransaction(input: {
  productId: ProductId;
  sessionId: string;
  email: string;
  telegramChatId?: number;
  telegramUserId?: number;
  telegramUsername?: string;
}): Promise<PaystackInitializeResult> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();
  const product = PRODUCT_BY_ID[input.productId];

  if (!secretKey) {
    return {
      ok: false,
      sessionId: input.sessionId,
      productId: input.productId,
      reason: "PAYSTACK_SECRET_KEY is not configured."
    };
  }

  if (!product) {
    return {
      ok: false,
      sessionId: input.sessionId,
      productId: input.productId,
      reason: "Unknown product."
    };
  }

  const cleanEmail = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      ok: false,
      sessionId: input.sessionId,
      productId: input.productId,
      reason: "A valid customer email is required for Paystack checkout."
    };
  }

  const baseUrl = siteUrl();
  const callbackUrl =
    process.env.PAYSTACK_CALLBACK_URL?.trim() ||
    (baseUrl ? `${baseUrl}/pay/callback?session_id=${encodeURIComponent(input.sessionId)}` : undefined);
  const reference = createPaystackReference(input.sessionId, input.productId);
  const metadata = {
    session_id: input.sessionId,
    product_id: input.productId,
    product_name: product.name,
    telegram_chat_id: input.telegramChatId,
    telegram_user_id: input.telegramUserId,
    telegram_username: input.telegramUsername,
    custom_fields: [
      { display_name: "8thGuard Session ID", variable_name: "session_id", value: input.sessionId },
      { display_name: "Product", variable_name: "product", value: product.name },
      { display_name: "Telegram Username", variable_name: "telegram_username", value: input.telegramUsername || "not_provided" }
    ]
  };

  try {
    const json = await fetchJsonWithTimeout<{
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; access_code?: string; reference?: string };
    }>("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: cleanEmail,
        amount: product.paystackSubunit,
        currency: "GHS",
        reference,
        callback_url: callbackUrl,
        channels: ["card", "bank", "ussd", "mobile_money", "bank_transfer"],
        metadata: JSON.stringify(metadata)
      })
    });

    if (!json.status || !json.data?.authorization_url || !json.data.access_code || !json.data.reference) {
      return {
        ok: false,
        sessionId: input.sessionId,
        productId: input.productId,
        reason: json.message || "Paystack did not return a checkout URL."
      };
    }

    return {
      ok: true,
      authorizationUrl: json.data.authorization_url,
      accessCode: json.data.access_code,
      reference: json.data.reference,
      sessionId: input.sessionId,
      productId: input.productId
    };
  } catch {
    return {
      ok: false,
      sessionId: input.sessionId,
      productId: input.productId,
      reason: "Paystack checkout initialization failed or timed out."
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
