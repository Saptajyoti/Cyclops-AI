/**
 * Risk Scoring Utility for Cyclops AI
 *
 * Methodology:
 * Computes an integer risk score (0-100) based strictly on normalized classification
 * scores returned by the Hugging Face model and threat signals.
 *
 * Prototype Thresholds:
 *   0 - 30:  'low'
 *  31 - 60:  'medium'
 *  61 - 100: 'high'
 */

export function calculateRiskScore(normalizedScores, category = 'safe') {
  if (!normalizedScores || typeof normalizedScores !== 'object') {
    throw new Error('Invalid model output provided for risk scoring.');
  }

  const {
    toxic = 0,
    severe_toxic = 0,
    threat = 0,
    insult = 0,
    identity_hate = 0,
    obscene = 0
  } = normalizedScores;

  // Multi-label composite: critical harms (threats, severe_toxic, identity_hate)
  const criticalHarm = Math.max(
    threat,
    severe_toxic,
    identity_hate
  );

  const moderateHarm = Math.max(
    toxic,
    insult,
    obscene
  );

  let compositeScore = 0;
  if (criticalHarm > 0.3) {
    compositeScore = Math.max(criticalHarm, moderateHarm * 0.9);
  } else {
    compositeScore = Math.max(moderateHarm, criticalHarm);
  }

  // Convert to integer 0 - 100
  let riskScore = Math.min(100, Math.max(0, Math.round(compositeScore * 100)));

  // If a high-severity category was explicitly detected (e.g. threat, severe cyberbullying)
  if (category === 'threat' && riskScore < 65) {
    riskScore = Math.max(riskScore, 75);
  } else if (category === 'hate_speech' && riskScore < 60) {
    riskScore = Math.max(riskScore, 70);
  } else if (category === 'cyberbullying' && riskScore < 50) {
    riskScore = Math.max(riskScore, 65);
  } else if (category === 'harassment' && riskScore < 45) {
    riskScore = Math.max(riskScore, 55);
  }

  // Assign risk level based on prototype thresholds
  let riskLevel = 'low';
  if (riskScore >= 61) {
    riskLevel = 'high';
  } else if (riskScore >= 31) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  return {
    riskScore,
    riskLevel
  };
}
