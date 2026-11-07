/**
 * LocalStorage management utility for CyberShield AI
 * Safely persists analysis history locally without sending to external servers.
 *
 * CRITICAL RULE: Never store raw Base64 image payloads in LocalStorage.
 * Store only sanitized metadata, risk metrics, and classification results.
 */

const STORAGE_KEY = 'cyclops_ai_history';

/**
 * Retrieve all saved analysis records from LocalStorage
 * @returns {Array} Array of analysis history items sorted by date descending
 */
export function getStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => new Date(b.analyzedAt || 0) - new Date(a.analyzedAt || 0));
  } catch (error) {
    console.error('Failed to read CyberShield AI history from localStorage:', error);
    return [];
  }
}

/**
 * Cleanse record to guarantee NO Base64 or heavy binary strings enter LocalStorage
 */
function sanitizeRecordForStorage(record) {
  if (!record || typeof record !== 'object') return null;

  const {
    id,
    message,
    text,
    category,
    riskScore,
    riskLevel,
    isToxic,
    confidence,
    detectedSignals = [],
    impersonationIndicators = [],
    explanation,
    recommendations = [],
    analyzedAt,
    type = 'text',
    imageMeta = null
  } = record;

  // Sanitize image metadata to avoid raw image data
  let cleanImageMeta = null;
  if (imageMeta) {
    cleanImageMeta = {
      fileName: imageMeta.fileName || 'image',
      fileSize: imageMeta.fileSize || 0,
      mimeType: imageMeta.mimeType || 'image/png'
    };
  }

  return {
    id: id || `analysis_${Date.now()}`,
    message: message || text || '',
    category: category || 'unspecified',
    riskScore: typeof riskScore === 'number' ? riskScore : 0,
    riskLevel: riskLevel || 'low',
    isToxic: Boolean(isToxic),
    confidence: typeof confidence === 'number' ? confidence : null,
    detectedSignals: Array.isArray(detectedSignals) ? detectedSignals : [],
    impersonationIndicators: Array.isArray(impersonationIndicators) ? impersonationIndicators : [],
    explanation: explanation || '',
    recommendations: Array.isArray(recommendations) ? recommendations : [],
    analyzedAt: analyzedAt || new Date().toISOString(),
    type: type || 'text',
    imageMeta: cleanImageMeta
  };
}

/**
 * Save a newly completed analysis record to LocalStorage
 * @param {Object} record Analysis result returned from backend or OCR
 * @returns {Array} Updated history array
 */
export function saveAnalysisRecord(record) {
  try {
    const cleanRecord = sanitizeRecordForStorage(record);
    if (!cleanRecord || !cleanRecord.id) return getStoredHistory();

    const current = getStoredHistory();
    // Prepend new record, ensure uniqueness by id
    const filtered = current.filter(item => item.id !== cleanRecord.id);
    const updated = [cleanRecord, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save record to localStorage:', error);
    return getStoredHistory();
  }
}

/**
 * Delete a single analysis record by ID
 * @param {string} id Record ID to remove
 * @returns {Array} Updated history array
 */
export function deleteAnalysisRecord(id) {
  try {
    const current = getStoredHistory();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to delete record from localStorage:', error);
    return getStoredHistory();
  }
}

/**
 * Clear all analysis history from LocalStorage
 * @returns {boolean} Success status
 */
export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history from localStorage:', error);
    return false;
  }
}

/**
 * Calculate dashboard statistics directly from saved history
 * Returns real counts (all 0 for fresh installation)
 * @param {Array} history Optional pre-fetched history list
 * @returns {Object} Dashboard stats
 */
export function calculateStats(history = null) {
  const records = history || getStoredHistory();
  const total = records.length;

  if (total === 0) {
    return {
      totalAnalyzed: 0,
      threatsDetected: 0,
      highRiskCount: 0,
      safeCount: 0,
      textCount: 0,
      imageCount: 0,
      ocrCount: 0,
      riskDistribution: [
        { name: 'Low Risk', value: 0, key: 'low', color: '#547A46' },
        { name: 'Medium Risk', value: 0, key: 'medium', color: '#946A18' },
        { name: 'High Risk', value: 0, key: 'high', color: '#B43B36' }
      ]
    };
  }

  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;
  let threatsDetected = 0;
  let safeCount = 0;
  let textCount = 0;
  let imageCount = 0;
  let ocrCount = 0;

  for (const item of records) {
    const level = (item.riskLevel || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const isToxic = Boolean(item.isToxic);
    const type = (item.type || 'text').toLowerCase();

    if (type === 'image' || type === 'deepfake') {
      imageCount++;
    } else if (type === 'ocr') {
      ocrCount++;
    } else {
      textCount++;
    }

    if (level === 'high') {
      highRiskCount++;
    } else if (level === 'medium') {
      mediumRiskCount++;
    } else {
      lowRiskCount++;
    }

    if (isToxic || (category && category !== 'safe') || level === 'high') {
      threatsDetected++;
    } else {
      safeCount++;
    }
  }

  return {
    totalAnalyzed: total,
    threatsDetected,
    highRiskCount,
    safeCount,
    textCount,
    imageCount,
    ocrCount,
    riskDistribution: [
      { name: 'Low Risk', value: lowRiskCount, key: 'low', color: '#547A46' },
      { name: 'Medium Risk', value: mediumRiskCount, key: 'medium', color: '#946A18' },
      { name: 'High Risk', value: highRiskCount, key: 'high', color: '#B43B36' }
    ]
  };
}
