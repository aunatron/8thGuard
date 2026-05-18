type OfficialChannel = {
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

export function getOfficialChannels(): OfficialChannel[] {
  const telegram = readEnv("NEXT_PUBLIC_OFFICIAL_TELEGRAM") || "https://t.me/8thGuardBot";
  const backupTelegram = readEnv("NEXT_PUBLIC_BACKUP_TELEGRAM");
  const whatsapp = readEnv("NEXT_PUBLIC_OFFICIAL_WHATSAPP");
  const siteUrl = readEnv("NEXT_PUBLIC_SITE_URL") || "https://8thguard.com";
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
