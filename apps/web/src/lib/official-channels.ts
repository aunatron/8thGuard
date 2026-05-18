export type OfficialChannel = {
  label: string;
  value: string;
  href?: string;
  status: "active" | "preparing" | "backup";
  note: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getOfficialSiteUrl(): string {
  return readEnv("NEXT_PUBLIC_SITE_URL") || "https://8thguard.com";
}

export function getOfficialTelegramUrl(): string {
  return readEnv("NEXT_PUBLIC_OFFICIAL_TELEGRAM") || "https://t.me/8thGuardBot";
}

export function getBackupTelegramUrl(): string | undefined {
  return readEnv("NEXT_PUBLIC_BACKUP_TELEGRAM");
}

export function getTelegramBotUsername(): string {
  const configuredUsername = readEnv("NEXT_PUBLIC_TELEGRAM_BOT_USERNAME");
  if (configuredUsername) return configuredUsername.replace(/^@/, "");

  const telegramUrl = getOfficialTelegramUrl();
  const match = telegramUrl.match(/t\.me\/([^/?#]+)/i);
  return match?.[1] || "8thGuardBot";
}

export function getOfficialChannelsUrl(): string {
  const baseUrl = getOfficialSiteUrl().replace(/\/$/, "");
  return `${baseUrl}/official`;
}

export function getOfficialChannels(): OfficialChannel[] {
  const telegram = getOfficialTelegramUrl();
  const backupTelegram = getBackupTelegramUrl();
  const whatsapp = readEnv("NEXT_PUBLIC_OFFICIAL_WHATSAPP");
  const siteUrl = getOfficialSiteUrl();
  const contact = readEnv("NEXT_PUBLIC_CONTACT_HANDLE");

  return [
    {
      label: "Official website",
      value: siteUrl,
      href: siteUrl,
      status: "active",
      note: "Use the website to verify the current official channels before paying or submitting a review."
    },
    {
      label: "Telegram bot",
      value: telegram,
      href: telegram,
      status: "active",
      note: "Primary live bot for paid review sessions, payment guidance, and result delivery."
    },
    {
      label: "Backup Telegram",
      value: backupTelegram || "Not published yet",
      href: backupTelegram,
      status: backupTelegram ? "backup" : "preparing",
      note: "Only trust a backup bot if it is listed here on the official website."
    },
    {
      label: "WhatsApp",
      value: whatsapp || "Preparing official WhatsApp channel",
      href: whatsapp,
      status: whatsapp ? "active" : "preparing",
      note: "WhatsApp will route users into the same paid safety desk when the official number is approved."
    },
    {
      label: "Support contact",
      value: contact || "Use the official bot or website",
      status: contact ? "active" : "preparing",
      note: "Never send seed phrases, private keys, wallet passwords, or unnecessary identity documents."
    }
  ];
}

export function getTelegramResilienceLines(): string[] {
  const lines = [
    `Official page: ${getOfficialChannelsUrl()}`,
    `Active Telegram: ${getOfficialTelegramUrl()}`
  ];
  const backup = getBackupTelegramUrl();
  if (backup) lines.push(`Backup Telegram: ${backup}`);
  lines.push("Only trust backup channels listed on the official page.");
  return lines;
}
