import { Router } from 'express';

const router = Router();

/**
 * GET /api/health
 * Verifies backend operational status without incurring external HF latency on every probe.
 * Transparently indicates whether model credentials are configured.
 */
router.get('/', (req, res) => {
  const hasToken = Boolean(process.env.HF_TOKEN && process.env.HF_TOKEN.trim());
  const configuredModel = process.env.HF_MODEL || 'unitary/toxic-bert';

  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'Cyclops AI Backend',
    version: '1.0.0',
    modelConfiguration: {
      configured: hasToken,
      model: configuredModel
    },
    timestamp: new Date().toISOString()
  });
});

export default router;

