import { Router } from 'express';
import { randomUUID } from 'crypto';
import { analyzeText } from '../services/huggingface.js';
import { calculateRiskScore } from '../utils/riskScore.js';
import { detectCategoryAndSignals } from '../utils/categoryDetection.js';
import { generateRecommendations } from '../utils/recommendations.js';

const router = Router();
const MAX_MESSAGE_LENGTH = 5000;

/**
 * POST /api/analyze
 * Analyzes an incoming message using Hugging Face text-classification,
 * calculates risk scores, identifies detection signals, and returns safety recommendations.
 */
router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body || {};

    // 1. Input Validation
    if (message === undefined || message === null || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MESSAGE',
          message: 'Please provide a valid message string in the request body.'
        }
      });
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_MESSAGE',
          message: 'Message cannot be empty or contain only whitespace.'
        }
      });
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MESSAGE_TOO_LONG',
          message: `Message exceeds maximum allowed limit of ${MAX_MESSAGE_LENGTH} characters.`
        }
      });
    }

    // 2. Hugging Face Inference
    const { normalizedScores, confidence } = await analyzeText(trimmedMessage);

    // 3. Category & Detection Signals
    const { category, detectedSignals, explanation, isToxic } = detectCategoryAndSignals(
      normalizedScores,
      trimmedMessage
    );

    // 4. Risk Score Computation
    const { riskScore, riskLevel } = calculateRiskScore(normalizedScores, category);

    // 5. Safety Recommendations
    const recommendations = generateRecommendations(category, riskLevel);

    // 6. Return Structured Output conforming to API Contract
    const analysisId = `analysis_${randomUUID()}`;
    const analyzedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      data: {
        id: analysisId,
        message: trimmedMessage,
        category,
        riskScore,
        riskLevel,
        isToxic,
        confidence,
        detectedSignals,
        explanation,
        recommendations,
        analyzedAt
      }
    });

  } catch (error) {
    next(error);
  }
});

export default router;

