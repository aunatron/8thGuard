import { getEnv } from "./config";
import { getPaymentContact, getPaymentServerConfig, getPolarServerConfig } from "./payments/config";
import { hasSupabaseConfig } from "./supabase";

export type OpsReadinessItem = {
  label: string;
  ready: boolean;
  note: string;
};

export type OpsReadinessGroup = {
  title: string;
  items: OpsReadinessItem[];
};

function hasEnv(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function getOpsReadiness(): OpsReadinessGroup[] {
  const env = getEnv();
  const contact = getPaymentContact();
  const paystack = getPaymentServerConfig();
  const polar = getPolarServerConfig();

  return [
    {
      title: "Telegram",
      items: [
        {
          label: "Bot token",
          ready: hasEnv(env.telegramBotToken),
          note: "Required for bot replies, ops alerts, and result delivery."
        },
        {
          label: "Webhook secret",
          ready: hasEnv(env.telegramWebhookSecret),
          note: "Recommended for webhook spoofing protection."
        },
        {
          label: "Official Telegram link",
          ready: hasEnv(contact.officialTelegram),
          note: "Used by payment callback and public return links."
        },
        {
          label: "Ops alert chat",
          ready: hasEnv(env.adminTelegramChatId),
          note: "Use /chat_id in the private ops group to get this value."
        }
      ]
    },
    {
      title: "Admin Desk",
      items: [
        {
          label: "Admin review token",
          ready: hasEnv(env.adminReviewToken),
          note: "Required to unlock the protected review queue."
        },
        {
          label: "Supabase persistence",
          ready: hasSupabaseConfig(),
          note: "Required for live queue, status updates, entitlements, and delivery."
        }
      ]
    },
    {
      title: "Payments",
      items: [
        {
          label: "Paystack verification",
          ready: paystack.paystackSecretKeyConfigured,
          note: "Required for server-side Paystack reference verification."
        },
        {
          label: "Paystack callback",
          ready: hasEnv(paystack.paystackCallbackUrl),
          note: "Recommended so checkout returns users to 8thGuard."
        },
        {
          label: "Polar checkout",
          ready: polar.accessTokenConfigured,
          note: "Required for server-side Stripe/Polar checkout."
        },
        {
          label: "Polar webhook",
          ready: polar.webhookSecretConfigured,
          note: "Required to record paid Stripe/Polar orders."
        }
      ]
    },
    {
      title: "Public Site",
      items: [
        {
          label: "Site URL",
          ready: hasEnv(contact.siteUrl),
          note: "Required for checkout links, submit links, and admin hints."
        },
        {
          label: "Public contact",
          ready: hasEnv(contact.contactHandle),
          note: "Recommended for support and trust surfaces."
        }
      ]
    }
  ];
}
