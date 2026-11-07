/**
 * Impersonation & Social Engineering Risk Indicators
 *
 * Rule-based heuristic analysis to identify common patterns of:
 * - Credential harvesting (passwords, OTPs, PINs)
 * - Financial urgency (urgent wire transfers, crypto, gift cards)
 * - Authority/Institution impersonation (Bank Fraud Dept, IRS, Police, CEO)
 * - Platform diversion (moving to Telegram, WhatsApp, untrusted URLs)
 * - Pressure tactics (immediate account suspension deadlines)
 *
 * NOTE: These are transparent rule-based risk indicators, NOT identity verification.
 */

export function detectImpersonationSignals(text = '') {
  if (!text || typeof text !== 'string') return [];

  const lower = text.toLowerCase();
  const indicators = [];

  // 1. Password / OTP / Credential Harvesting
  const otpRegex = /\b(otp|one[- ]time password|verification code|security code|passcode|pin code|temporary password|login credentials|share your password)\b/i;
  if (otpRegex.test(lower)) {
    indicators.push({
      id: 'credential_harvest',
      category: 'Credential Solicitation',
      pattern: 'Request for sensitive security codes or passwords',
      explanation: 'Legitimate institutions and support teams never ask users to disclose one-time passwords (OTPs), PINs, or account passwords.',
      action: 'Never share verification codes or passwords with anyone, even if they claim to represent technical support.',
      severity: 'high'
    });
  }

  // 2. Urgent Financial Demands / Money Transfers
  const financialRegex = /\b(send money|wire transfer|western union|moneygram|crypto|bitcoin|gift card|apple gift card|steam card|cash app|venmo immediately|urgent transfer|pay immediately)\b/i;
  if (financialRegex.test(lower)) {
    indicators.push({
      id: 'financial_demand',
      category: 'Urgent Financial Demand',
      pattern: 'Urgent monetary transfer or non-standard payment instructions',
      explanation: 'Demanding immediate payment via gift cards, cryptocurrency, or wire transfer is a recognized indicator of impersonation and financial fraud.',
      action: 'Refuse all immediate payment requests and independently verify the requester\'s identity through trusted official channels.',
      severity: 'high'
    });
  }

  // 3. Authority & Institutional Impersonation
  const authorityRegex = /\b(irs|fraud department|security department|police department|federal agent|fbi|internal revenue|bank manager|ceo|executive office|legal department|account security team)\b/i;
  if (authorityRegex.test(lower)) {
    indicators.push({
      id: 'authority_claim',
      category: 'Authority Claim',
      pattern: 'Representation of official authority or enforcement body',
      explanation: 'Attackers frequently impersonate corporate executives, IT security teams, or government agencies to bypass user skepticism.',
      action: 'Do not follow commands provided in this message. Contact the organization directly using a verified phone number or portal.',
      severity: 'medium'
    });
  }

  // 4. Pressure Tactics & Imminent Account Suspension
  const pressureRegex = /\b(account (will be|has been) (suspended|terminated|locked|closed)|within (24|12|48) hours|immediate action required|act now or|final warning|last notice)\b/i;
  if (pressureRegex.test(lower)) {
    indicators.push({
      id: 'pressure_tactic',
      category: 'Artificial Urgency',
      pattern: 'Manufactured deadline or threat of account suspension',
      explanation: 'Creating artificial urgency limits careful evaluation and pressures victims into hasty compliance.',
      action: 'Take a step back. High-pressure deadlines are intended to cause panic. Log into your account through an independent browser tab to check status.',
      severity: 'medium'
    });
  }

  // 5. Platform Diversion / Suspicious Link Off-ramping
  const diversionRegex = /\b(switch to whatsapp|chat on telegram|message me on signal|click (here|this link) to verify|verify your account at|update your billing info)\b/i;
  if (diversionRegex.test(lower)) {
    indicators.push({
      id: 'platform_diversion',
      category: 'Channel Diversion',
      pattern: 'Attempt to divert interaction to encrypted or external channels',
      explanation: 'Scammers frequently attempt to move conversations off-platform where standard platform moderation and safety tools cannot protect you.',
      action: 'Keep interactions strictly within verified platforms. Do not open unverified links or move to third-party messaging apps.',
      severity: 'medium'
    });
  }

  return indicators;
}

