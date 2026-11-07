/**
 * API Service for CyberShield AI
 * Communicates with the backend analysis service.
 * Never calls Hugging Face directly from the frontend or exposes API tokens.
 */

// Default to relative path '' so Vite dev server proxy seamlessly routes /api requests to port 5000
const API_BASE_URL = (import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : '').replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = 25000;

/**
 * Helper to execute fetch with timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Analysis request timed out. The server or AI model took too long to respond.');
    }
    throw error;
  }
}

/**
 * Check backend health & connectivity
 * Endpoint: GET /api/health
 * @returns {Promise<{ available: boolean, status: string, details?: any }>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    }, 5000);

    if (!response.ok) {
      return {
        available: false,
        status: 'Backend unavailable',
        error: `Server returned HTTP ${response.status}`
      };
    }

    const data = await response.json();
    return {
      available: true,
      status: 'Connected',
      details: data
    };
  } catch (error) {
    return {
      available: false,
      status: 'Backend unavailable',
      error: error.message || 'Cannot reach backend server'
    };
  }
}

/**
 * Analyze an online message for cyberbullying, threats, and harmful language
 * Endpoint: POST /api/analyze
 * @param {string} message Text string to analyze
 * @returns {Promise<{ success: boolean, data?: Object, error?: { code: string, message: string } }>}
 */
export async function analyzeMessage(message) {
  // Client-side validation prior to network call
  if (!message || typeof message !== 'string' || !message.trim()) {
    return {
      success: false,
      error: {
        code: 'EMPTY_INPUT',
        message: 'Please enter a message to analyze.'
      }
    };
  }

  const trimmed = message.trim();
  const MAX_CHARS = 5000;
  if (trimmed.length > MAX_CHARS) {
    return {
      success: false,
      error: {
        code: 'EXCESSIVE_LENGTH',
        message: `Message exceeds maximum allowed length of ${MAX_CHARS} characters.`
      }
    };
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message: trimmed, text: trimmed })
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch {
      return {
        success: false,
        error: {
          code: 'INVALID_JSON_RESPONSE',
          message: 'The server returned an invalid response. Please try again.'
        }
      };
    }

    if (!response.ok) {
      const errMessage = responseData?.error?.message || 
        (response.status === 429 ? 'Rate limit exceeded. Please wait a moment before trying again.' :
         response.status === 503 ? 'AI service is temporarily unavailable or starting up. Please retry shortly.' :
         `Request failed with status ${response.status}.`);

      return {
        success: false,
        error: {
          code: responseData?.error?.code || `HTTP_${response.status}`,
          message: errMessage
        }
      };
    }

    if (responseData && responseData.success && responseData.data) {
      return {
        success: true,
        data: responseData.data
      };
    }

    return {
      success: false,
      error: {
        code: responseData?.error?.code || 'UNEXPECTED_RESPONSE',
        message: responseData?.error?.message || 'Unable to analyze this message right now. Please try again.'
      }
    };

  } catch (networkError) {
    let friendlyMessage = 'Unable to connect to the backend analysis server. Please ensure the backend is running at ' + API_BASE_URL;
    if (networkError.message.includes('timed out')) {
      friendlyMessage = 'Analysis request timed out. The backend or AI inference model took too long to respond.';
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: friendlyMessage
      }
    };
  }
}

/**
 * Analyze an image for AI Generation or Deepfake manipulation
 * Endpoint: POST /api/analyze-image
 * @param {File} imageFile The image file to analyze
 * @param {'ai_generated' | 'deepfake'} analysisType Type of image analysis
 * @returns {Promise<{ success: boolean, data?: Object, error?: { code: string, message: string } }>}
 */
export async function analyzeImage(imageFile, analysisType = 'ai_generated') {
  if (!imageFile) {
    return {
      success: false,
      error: {
        code: 'NO_IMAGE',
        message: 'Please select an image file to analyze.'
      }
    };
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('analysisType', analysisType);

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/analyze-image`, {
      method: 'POST',
      // Note: Do NOT set Content-Type header manually; browser sets boundary
      body: formData
    });

    if (response.status === 404 || response.status === 501) {
      const modeLabel = analysisType === 'deepfake' ? 'Deepfake detection' : 'AI-generated image detection';
      return {
        success: false,
        error: {
          code: 'BACKEND_NOT_INTEGRATED',
          message: `${modeLabel} is awaiting backend model integration.`
        }
      };
    }

    let responseData;
    try {
      responseData = await response.json();
    } catch {
      return {
        success: false,
        error: {
          code: 'INVALID_JSON_RESPONSE',
          message: 'The server returned an invalid response for image analysis.'
        }
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: responseData?.error?.code || `HTTP_${response.status}`,
          message: responseData?.error?.message || 'Image analysis request failed.'
        }
      };
    }

    return {
      success: true,
      data: responseData.data || responseData
    };

  } catch (networkError) {
    let friendlyMessage = 'Unable to connect to the backend analysis server. Please ensure the backend is running at http://localhost:5000.';
    if (networkError.message && networkError.message.includes('timed out')) {
      friendlyMessage = 'Image analysis request timed out. Please retry with a smaller image or check backend connectivity.';
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: friendlyMessage
      }
    };
  }
}
