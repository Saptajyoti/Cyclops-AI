/**
 * Category & Signal Detection for Cyclops AI
 *
 * Supported Categories:
 * - safe
 * - harassment
 * - threat
 * - hate_speech
 * - cyberbullying
 * - toxic
 *
 * Maps Hugging Face multi-label probabilities and transparent linguistic heuristics
 * to categorize communication and extract concrete detection signals.
 */

export function detectCategoryAndSignals(normalizedScores, messageText = '') {
  const {
    toxic = 0,
    severe_toxic = 0,
    threat = 0,
    insult = 0,
    identity_hate = 0,
    toxicity = 0
  } = normalizedScores;

  const detectedSignals = [];
  const lowerMsg = (messageText || '').toLowerCase();

  // 1. Threat Detection
  const hasThreatKeyword = lowerMsg.includes('kill') || lowerMsg.includes('hunt you') || lowerMsg.includes('destroy you') || lowerMsg.includes('hurt') || lowerMsg.includes('watch your back') || lowerMsg.includes('regret') || lowerMsg.includes('die') || lowerMsg.includes('beat you');
  const hasThreatScore = threat >= 0.35 || (hasThreatKeyword && (threat >= 0.1 || true));
  if (hasThreatScore || threat >= 0.3) {
    const severity = threat >= 0.6 ? 'high' : 'medium';
    detectedSignals.push({
      name: 'Threat-related language',
      description: 'Potential indication of physical harm, violence, or intimidation.',
      severity
    });
  }

  // 2. Identity-based Attack / Hate Speech
  if (identity_hate >= 0.3) {
    const severity = identity_hate >= 0.5 ? 'high' : 'medium';
    detectedSignals.push({
      name: 'Identity-based attack',
      description: 'Hostile or demeaning language directed at protected identity characteristics.',
      severity
    });
  }

  // 3. Targeted Insult & Harassment
  const hasSecondPerson = /\b(you|you're|your|u|ur)\b/i.test(lowerMsg);
  if (insult >= 0.35) {
    const isTargeted = hasSecondPerson && (insult >= 0.5 || lowerMsg.includes('nobody') || lowerMsg.includes('worthless') || lowerMsg.includes('loser') || lowerMsg.includes('stupid'));
    detectedSignals.push({
      name: isTargeted ? 'Targeted insult' : 'Insulting language',
      description: isTargeted 
        ? 'Potentially humiliating or demeaning language directed directly at an individual.'
        : 'Derogatory or offensive phrasing detected in text.',
      severity: insult >= 0.6 ? 'high' : 'medium'
    });
  }

  // 4. Toxic Language
  const effectiveToxicity = Math.max(toxic, severe_toxic, toxicity);
  if (effectiveToxicity >= 0.4) {
    detectedSignals.push({
      name: 'Toxic language',
      description: 'Profane, aggressive, or hostile expressions identified.',
      severity: effectiveToxicity >= 0.7 ? 'high' : 'medium'
    });
  }

  // Determine Primary Category
  let category = 'safe';
  let explanation = 'No significant indicators of hostility or harmful language were detected.';
  let isToxic = false;

  if (hasThreatScore && threat >= 0.35) {
    category = 'threat';
    explanation = 'The message contains language that may indicate threatening communication or potential harm.';
    isToxic = true;
  } else if (identity_hate >= 0.35) {
    category = 'hate_speech';
    explanation = 'The message contains expressions that may represent identity-based discrimination or hostile bias.';
    isToxic = true;
  } else if (insult >= 0.45 && hasSecondPerson) {
    // If targeted harassment/bullying pattern
    if (lowerMsg.includes('nobody') || lowerMsg.includes('delete') || lowerMsg.includes('group') || lowerMsg.includes('leave') || lowerMsg.includes('disappear')) {
      category = 'cyberbullying';
      explanation = 'The message exhibits patterns of targeted social exclusion, intimidation, or cyberbullying.';
    } else {
      category = 'harassment';
      explanation = 'The message contains language that may indicate targeted harassment or interpersonal hostility.';
    }
    isToxic = true;
  } else if (effectiveToxicity >= 0.45 || insult >= 0.4) {
    category = 'toxic';
    explanation = 'The message contains language classified as generally toxic or abrasive.';
    isToxic = true;
  } else {
    // Check if slight low-level signals exist
    if (detectedSignals.length > 0) {
      category = 'toxic';
      explanation = 'The message contains mild communication signals that may warrant attention.';
      isToxic = true;
    } else {
      category = 'safe';
      explanation = 'The message does not show patterns of harassment, threats, or toxic communication.';
      isToxic = false;
    }
  }

  return {
    category,
    detectedSignals,
    explanation,
    isToxic
  };
}

