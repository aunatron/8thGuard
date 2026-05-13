export type InlineKeyboardButton = {
  text: string;
  callback_data?: string;
  url?: string;
};

export type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

export const mainMenuKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "Check Wallet", callback_data: "check_wallet" },
      { text: "Check Transaction", callback_data: "check_tx" }
    ],
    [
      { text: "Check Agent", callback_data: "check_agent" },
      { text: "Report Scam", callback_data: "report_scam" }
    ],
    [
      { text: "Pricing", callback_data: "pricing" },
      { text: "Pay", callback_data: "pay" }
    ],
    [
      { text: "Crypto Pay", callback_data: "crypto_pay" },
      { text: "Guarded Send", callback_data: "guarded_send" }
    ],
    [{ text: "Contact", callback_data: "contact" }]
  ]
};

export const guardedFlowKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "Check Wallet", callback_data: "check_wallet" },
      { text: "Fee Quote", callback_data: "fee_quote" }
    ],
    [
      { text: "Payment Session", callback_data: "payment_session" },
      { text: "Protected Flow", callback_data: "protected_flow" }
    ]
  ]
};

export const paymentKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "Pricing", callback_data: "pricing" },
      { text: "Payment Session", callback_data: "payment_session" }
    ],
    [{ text: "Paystack", callback_data: "pay" }],
    [
      { text: "Crypto Pay", callback_data: "crypto_pay" },
      { text: "Payment Warning", callback_data: "payment_warning" }
    ],
    [
      { text: "Submit Payment", callback_data: "submit_payment" },
      { text: "Verify Paystack", callback_data: "verify_paystack_payment" }
    ]
  ]
};

export const cryptoRailKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "XRP", callback_data: "crypto:xrp" },
      { text: "BTC", callback_data: "crypto:btc" }
    ],
    [
      { text: "USDT TRC20", callback_data: "crypto:usdt_trc20" },
      { text: "USDT BEP20/EVM", callback_data: "crypto:usdt_bep20" }
    ],
    [
      { text: "TON", callback_data: "crypto:ton" },
      { text: "Solana", callback_data: "crypto:solana" }
    ],
    [
      { text: "Submit Tx Hash", callback_data: "verify_crypto_payment" },
      { text: "Payment Warning", callback_data: "payment_warning" }
    ]
  ]
};

export const walletCheckKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "Pay for Detailed Review", callback_data: "pay" },
      { text: "Report Scam", callback_data: "report_scam" }
    ],
    [
      { text: "Check Another Wallet", callback_data: "check_wallet" },
      { text: "Pricing", callback_data: "pricing" },
    ]
  ]
};

export const scamReportKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: "Submit Payment", callback_data: "submit_payment" },
      { text: "Contact", callback_data: "contact" }
    ],
    [{ text: "Payment Warning", callback_data: "payment_warning" }]
  ]
};
