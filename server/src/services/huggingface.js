/**
 * Hugging Face Inference Service for Cyclops AI
 *
 * Primary: Hugging Face Inference Providers API router
 * Fallback: Local Hugging Face Transformer pipeline (@xenova/transformers Xenova/toxic-bert)
 *
 * Ensures 100% operational uptime for hackathon demonstrations even when
 * remote cloud accounts encounter HTTP 402 (insufficient credits).
 */

import { pipeline } from '@xenova/transformers';

const DEFAULT_MODEL = 'unitary/toxic-bert';
const LOCAL_FALLBACK_MODEL = 'Xenova/toxic-bert';
const DEFAULT_TIMEOUT_MS = 20000;

// Singleton cache for local Hugging Face transformer pipeline
let localClassifierPromise = null;

async function getLocalClassifier() {
  if (!localClassifierPromise) {
    console.log(`[Hugging Face Engine] Initializing local Hugging Face transformer (${LOCAL_FALLBACK_MODEL})...`);
    localClassifierPromise = pipeline('text-classification', LOCAL_FALLBACK_MODEL);
  }
  return localClassifierPromise;
}

/**
 * Analyzes text using Hugging Face text-classification model
 * @param {string} message Text message to classify
 * @returns {Promise<{ normalizedScores: Object, confidence: number, rawLabels: Array }>}
 */
export async function analyzeText(message) {
  const token = process.env.HF_TOKEN;
  const model = process.env.HF_MODEL || DEFAULT_MODEL;
  const timeoutMs = parseInt(process.env.HF_TIMEOUT_MS, 10) || DEFAULT_TIMEOUT_MS;

  // If token is configured, try remote Hugging Face API first
  if (token && token.trim()) {
    const endpoint = `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(model)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          inputs: message,
          options: { wait_for_model: true, use_cache: true }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const resultData = await response.json();
        return normalizeClassificationOutput(resultData);
      }

      // If remote provider reports 402 Payment Required or 503 Model Loading,
      // seamlessly transition to the local Hugging Face ONNX model so demo never halts.
      if (response.status === 402 || response.status === 503) {
        console.warn(`[Hugging Face API] Remote serverless returned HTTP ${response.status} (Credits required). Falling back to local Hugging Face model (${LOCAL_FALLBACK_MODEL}).`);
        return await runLocalHuggingFaceInference(message);
      }

      if (response.status === 401 || response.status === 403) {
        const err = new Error('Hugging Face authentication failed. Please verify that your HF_TOKEN is valid.');
        err.code = 'HF_AUTH_ERROR';
        err.status = 401;
        throw err;
      }

      const errorText = await response.text();
      console.warn(`[Hugging Face API] Remote returned HTTP ${response.status}: ${errorText.slice(0, 100)}. Falling back to local engine.`);
      return await runLocalHuggingFaceInference(message);

    } catch (networkErr) {
      clearTimeout(timeoutId);
      if (networkErr.code === 'HF_AUTH_ERROR') throw networkErr;

      console.warn(`[Hugging Face API] Network issue: ${networkErr.message}. Executing local Hugging Face transformer.`);
      return await runLocalHuggingFaceInference(message);
    }
  }

  // If no token is configured, run local Hugging Face model directly
  console.log('[Hugging Face Engine] Running local Hugging Face transformer pipeline...');
  return await runLocalHuggingFaceInference(message);
}

/**
 * Runs local Hugging Face ONNX transformer model
 */
async function runLocalHuggingFaceInference(message) {
  try {
    const classifier = await getLocalClassifier();
    const output = await classifier(message, { topk: null });

    // Output shape: [ { label: 'toxic', score: 0.85 } ]
    return normalizeClassificationOutput(output);
  } catch (localErr) {
    console.error('[Hugging Face Engine] Local inference failed:', localErr);
    const err = new Error(`Hugging Face classification failed: ${localErr.message}`);
    err.code = 'INFERENCE_FAILED';
    err.status = 502;
    throw err;
  }
}

/**
 * Normalizes varied text-classification shapes into a standard score mapping
 */
function normalizeClassificationOutput(data) {
  let items = [];
  if (Array.isArray(data)) {
    if (Array.isArray(data[0])) {
      items = data[0];
    } else {
      items = data;
    }
  }

  if (items.length === 0) {
    throw new Error('Inference provider returned an empty classification result.');
  }

  const normalizedScores = {
    toxic: 0,
    severe_toxic: 0,
    obscene: 0,
    threat: 0,
    insult: 0,
    identity_hate: 0,
    toxicity: 0
  };

  let maxScore = 0;

  for (const item of items) {
    if (!item || typeof item.score !== 'number') continue;
    const labelKey = (item.label || '').toLowerCase().trim();
    const scoreVal = Math.max(0, Math.min(1, item.score));

    if (scoreVal > maxScore) {
      maxScore = scoreVal;
    }

    // Match known toxic-bert label keys
    if (labelKey.includes('severe')) {
      normalizedScores.severe_toxic = scoreVal;
    } else if (labelKey.includes('threat')) {
      normalizedScores.threat = scoreVal;
    } else if (labelKey.includes('insult')) {
      normalizedScores.insult = scoreVal;
    } else if (labelKey.includes('identity') || labelKey.includes('hate')) {
      normalizedScores.identity_hate = scoreVal;
    } else if (labelKey.includes('obscene')) {
      normalizedScores.obscene = scoreVal;
    } else if (labelKey.includes('toxic')) {
      normalizedScores.toxic = scoreVal;
    }

    // Generic toxicity indicator
    if (labelKey === 'toxic' || labelKey === 'toxicity' || labelKey === 'offensive') {
      normalizedScores.toxicity = scoreVal;
    }
  }

  return {
    normalizedScores,
    confidence: Number(maxScore.toFixed(3)),
    rawLabels: items
  };
}
