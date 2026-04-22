type CardType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'verve'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'unknown';

export function detectCardType(pan: string): CardType {
  const card = pan.replace(/\s+/g, '');

  const patterns: { type: CardType; regex: RegExp }[] = [
    { type: 'visa', regex: /^4\d{12}(\d{3})?$/ },

    // Mastercard: 51–55, 2221–2720
    { type: 'mastercard', regex: /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/ },

    { type: 'amex', regex: /^3[47]\d{13}$/ },

    { type: 'discover', regex: /^(6011\d{12}|65\d{14}|64[4-9]\d{13})$/ },

    { type: 'diners', regex: /^3(0[0-5]|[68]\d)\d{11}$/ },

    { type: 'jcb', regex: /^(?:2131|1800|35\d{3})\d{11}$/ },

    // Verve (common in Africa)
    { type: 'verve', regex: /^(5060|5061|5078|5079|6500)\d+$/ },
  ];

  for (const p of patterns) {
    if (p.regex.test(card)) {
      return p.type;
    }
  }

  return 'unknown';
}