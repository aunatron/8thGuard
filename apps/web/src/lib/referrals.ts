/**
 * Referral system for 8thGuard.
 *
 * Generates unique invite links per Telegram user.
 * Tracks referral source via audit logging.
 * No database required — referral attribution is logged and can be
 * cross-referenced in Supabase audit events later.
 */

export type ReferralLink = {
  userId: number;
  code: string;
  link: string;
};

/**
 * Generates a deterministic referral code from a Telegram user ID.
 * Uses a simple base36 encoding with a prefix for readability.
 */
export function generateReferralCode(userId: number): string {
  const base = userId.toString(36).toUpperCase();
  return `8G${base}`;
}

/**
 * Builds a Telegram deep link for the referral code.
 * When clicked, the user opens the bot with /start <code> which
 * allows us to attribute the referral in the webhook handler.
 */
export function buildReferralLink(botUsername: string, userId: number): ReferralLink {
  const code = generateReferralCode(userId);
  return {
    userId,
    code,
    link: `https://t.me/${botUsername}?start=${code}`
  };
}

/**
 * Extracts a referral code from the /start argument if present.
 * Returns undefined if no referral code is detected.
 */
export function extractReferralCode(startArg: string): string | undefined {
  const trimmed = startArg.trim();
  if (trimmed.startsWith("8G") && trimmed.length >= 3) return trimmed;
  return undefined;
}

/**
 * Resolves a referral code back to the original user ID.
 * Returns undefined if the code is not a valid referral format.
 */
export function resolveReferralUserId(code: string): number | undefined {
  if (!code.startsWith("8G") || code.length < 3) return undefined;
  const base36 = code.slice(2);
  const parsed = parseInt(base36, 36);
  return isNaN(parsed) ? undefined : parsed;
}
