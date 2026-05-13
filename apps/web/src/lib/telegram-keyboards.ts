export type InlineKeyboardButton = {
  text: string;
  callback_data: string;
};

export type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

export const mainMenuKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: "Check Wallet", callback_data: "check_wallet" }],
    [{ text: "Check Transaction", callback_data: "check_tx" }],
    [{ text: "Check Agent", callback_data: "check_agent" }],
    [{ text: "Report Scam", callback_data: "report_scam" }],
    [{ text: "Pricing", callback_data: "pricing" }],
    [{ text: "Pay", callback_data: "pay" }],
    [{ text: "Crypto Pay", callback_data: "crypto_pay" }],
    [{ text: "Contact", callback_data: "contact" }]
  ]
};

export const paymentKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: "Pricing", callback_data: "pricing" }],
    [{ text: "Paystack", callback_data: "pay" }],
    [{ text: "Crypto Pay", callback_data: "crypto_pay" }],
    [{ text: "Payment Warning", callback_data: "payment_warning" }],
    [{ text: "Submit Payment", callback_data: "submit_payment" }]
  ]
};

export const walletCheckKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: "Pricing", callback_data: "pricing" }],
    [{ text: "Pay for Manual Review", callback_data: "pay" }],
    [{ text: "Report Scam", callback_data: "report_scam" }],
    [{ text: "Check Another Wallet", callback_data: "check_wallet" }]
  ]
};

export const scamReportKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: "Submit Payment", callback_data: "submit_payment" }],
    [{ text: "Contact", callback_data: "contact" }],
    [{ text: "Payment Warning", callback_data: "payment_warning" }]
  ]
};
