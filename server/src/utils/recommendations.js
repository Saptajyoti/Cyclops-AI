/**
 * Safety Recommendations Generator for Cyclops AI
 *
 * Provides actionable, de-escalating, non-retaliatory safety guidance
 * tailored to the detected risk level and category.
 */

export function generateRecommendations(category, riskLevel) {
  const normCategory = (category || 'safe').toLowerCase();
  const normRisk = (riskLevel || 'low').toLowerCase();

  switch (normCategory) {
    case 'threat':
      return [
        'Preserve the message and capture full screenshots with timestamps.',
        'Avoid engaging or confronting the sender directly.',
        'Reach out to trusted security personnel, school administrators, or workplace HR.',
        'Contact local emergency services immediately if you feel in imminent physical danger.'
      ];

    case 'harassment':
      return [
        'Preserve relevant evidence, including conversation history and sender handles.',
        'Consider blocking or muting the sender to prevent continued contact.',
        'Report the message through the platform\'s abusive behavior reporting flow.',
        'Seek support from a trusted friend, counselor, or community advocate.'
      ];

    case 'cyberbullying':
      return [
        'Take screenshots of the comments, messages, and sender profiles for evidence.',
        'Do not respond or retaliate, as engagement often fuels bullying behavior.',
        'Block the account and report the targeted harassment to platform moderators.',
        'Confide in a counselor, mentor, or trusted person about what is happening.'
      ];

    case 'hate_speech':
      return [
        'Report the violating content through platform community standard reporting tools.',
        'Document and archive the exchange for institutional or platform review.',
        'Mute or block the user and associated accounts to safeguard your well-being.'
      ];

    case 'toxic':
      return [
        'Step away from the conversation to avoid reciprocating hostilities.',
        'Consider muting notifications or disengaging from the thread.',
        'Flag inappropriate language if it violates server or platform guidelines.'
      ];

    case 'safe':
    default:
      if (normRisk === 'medium') {
        return [
          'Review the context of the conversation if any phrasing felt uncomfortable.',
          'Maintain respectful communication boundaries.'
        ];
      }
      return [
        'No immediate protective action is indicated by the classifier.'
      ];
  }
}

