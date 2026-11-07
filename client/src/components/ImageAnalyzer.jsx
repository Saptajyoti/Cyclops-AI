import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  RotateCcw, 
  Info,
  Sparkles, 
  Layers, 
  FileQuestion, 
  Download 
} from 'lucide-react';
import { validateImageFile, formatFileSize } from '../utils/imageValidation';
import { analyzeImage } from '../services/api';
import { downloadSafetyReport } from '../utils/reportGenerator';
import RiskBadge from './RiskBadge';

/**
 * ImageAnalyzer Component
 * Provides both AI-Generated Image Detection and Deepfake Detection modes.
 * Displays preview, format/size validation, interactive demo samples, and shows real backend results.
 * Fully styled for Light Mode (Ivory × Deep Forest) and Dark Mode (Obsidian × Acid Lime).
 */
export default function ImageAnalyzer({ onSaveResult, onNotify }) {
  const [activeMode, setActiveMode] = useState('ai_generated'); // 'ai_generated' | 'deepfake'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [backendUnavailable, setBackendUnavailable] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError('');
    setAnalysisResult(null);
    setBackendUnavailable(null);
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError('');
    setAnalysisResult(null);
    setBackendUnavailable(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = (sampleType) => {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    if (sampleType === 'ai') {
      const grad = ctx.createLinearGradient(0, 0, 440, 320);
      grad.addColorStop(0, '#173D32');
      grad.addColorStop(0.5, '#2A5C4E');
      grad.addColorStop(1, '#A5B99B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 440, 320);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(70 + i * 60, 160 + Math.sin(i) * 50, 45, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Synthetic Diffusion Concept Art', 220, 145);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText('[Midjourney / Latent Diffusion Synthesis]', 220, 175);

      canvas.toBlob(async (blob) => {
        const arrayBuf = await blob.arrayBuffer();
        const marker = new TextEncoder().encode('tEXtparameters: Midjourney v6 prompt: futuristic cyberpunk avatar --v 6.0');
        const merged = new Uint8Array(arrayBuf.byteLength + marker.byteLength);
        merged.set(new Uint8Array(arrayBuf), 0);
        merged.set(marker, arrayBuf.byteLength);
        const file = new File([merged], 'sample-midjourney-art.png', { type: 'image/png' });
        setActiveMode('ai_generated');
        handleFileChange(file);
      }, 'image/png');

    } else if (sampleType === 'deepfake') {
      const grad = ctx.createRadialGradient(220, 160, 40, 220, 160, 200);
      grad.addColorStop(0, '#252B25');
      grad.addColorStop(1, '#101110');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 440, 320);

      ctx.fillStyle = '#FF8A80';
      ctx.beginPath();
      ctx.ellipse(220, 140, 65, 85, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#B43B36';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.ellipse(220, 140, 72, 92, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Facial Tampering / Inpainting Test', 220, 275);

      canvas.toBlob(async (blob) => {
        const arrayBuf = await blob.arrayBuffer();
        const marker = new TextEncoder().encode('stable diffusion facial inpainting automatic1111');
        const merged = new Uint8Array(arrayBuf.byteLength + marker.byteLength);
        merged.set(new Uint8Array(arrayBuf), 0);
        merged.set(marker, arrayBuf.byteLength);
        const file = new File([merged], 'sample-deepfake-portrait.png', { type: 'image/png' });
        setActiveMode('deepfake');
        handleFileChange(file);
      }, 'image/png');

    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, 320);
      grad.addColorStop(0, '#547A46');
      grad.addColorStop(0.7, '#A5B99B');
      grad.addColorStop(1, '#ECEDE5');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 440, 320);

      ctx.fillStyle = '#20231F';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Natural Optical Landscape Photo', 220, 145);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = 'rgba(32, 35, 31, 0.85)';
      ctx.fillText('Optical Camera Sensor Capture', 220, 175);

      canvas.toBlob(async (blob) => {
        const arrayBuf = await blob.arrayBuffer();
        const marker = new TextEncoder().encode('Make: Canon Model: EOS 5D Mark IV ExposureTime: 1/250 FNumber: 2.8 ISOSpeedRatings: 100');
        const merged = new Uint8Array(arrayBuf.byteLength + marker.byteLength);
        merged.set(new Uint8Array(arrayBuf), 0);
        merged.set(marker, arrayBuf.byteLength);
        const file = new File([merged], 'sample-canon-photo.jpg', { type: 'image/jpeg' });
        setActiveMode('ai_generated');
        handleFileChange(file);
      }, 'image/jpeg');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setValidationError('Please select an image first.');
      return;
    }

    setValidationError('');
    setIsLoading(true);
    setBackendUnavailable(null);

    try {
      const response = await analyzeImage(selectedFile, activeMode);

      if (response.success && response.data) {
        setAnalysisResult(response.data);
        if (onSaveResult) {
          onSaveResult({
            ...response.data,
            message: `Image: ${selectedFile.name} (${activeMode === 'deepfake' ? 'Deepfake Inspection' : 'AI-Generation Analysis'})`,
            type: activeMode === 'deepfake' ? 'deepfake' : 'image',
            imageMeta: {
              fileName: selectedFile.name,
              fileSize: selectedFile.size,
              mimeType: selectedFile.type
            }
          });
        }
        if (onNotify) {
          onNotify({ type: 'success', message: 'Image analysis complete!' });
        }
      } else {
        if (response.error?.code === 'BACKEND_NOT_INTEGRATED') {
          setBackendUnavailable(response.error.message);
        } else {
          setValidationError(response.error?.message || 'Failed to analyze image.');
        }
      }
    } catch (err) {
      setValidationError('An unexpected error occurred during image inspection.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDeepfakeMode = activeMode === 'deepfake';

  return (
    <div
      className="image-analyzer-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Mode Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border-primary)',
          width: 'fit-content'
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveMode('ai_generated');
            setAnalysisResult(null);
            setBackendUnavailable(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: !isDeepfakeMode ? 'var(--accent-primary)' : 'transparent',
            color: !isDeepfakeMode ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            fontSize: '0.84375rem',
            fontWeight: !isDeepfakeMode ? '700' : '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={15} />
          <span>AI-Generated Image Detection</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('deepfake');
            setAnalysisResult(null);
            setBackendUnavailable(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isDeepfakeMode ? 'var(--accent-primary)' : 'transparent',
            color: isDeepfakeMode ? 'var(--text-on-accent)' : 'var(--text-secondary)',
            fontSize: '0.84375rem',
            fontWeight: isDeepfakeMode ? '700' : '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={15} />
          <span>Deepfake Face Manipulation</span>
        </button>
      </div>

      {/* Quick Test Demo Presets */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          padding: '8px 14px'
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Quick Demo Presets:
        </span>
        <button
          type="button"
          onClick={() => handleLoadSample('ai')}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.78125rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />
          <span>Sample AI Art (Midjourney)</span>
        </button>
        <button
          type="button"
          onClick={() => handleLoadSample('deepfake')}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.78125rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Layers size={13} style={{ color: 'var(--accent-primary)' }} />
          <span>Sample Deepfake Face</span>
        </button>
        <button
          type="button"
          onClick={() => handleLoadSample('authentic')}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.78125rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <CheckCircle2 size={13} style={{ color: 'var(--color-safe)' }} />
          <span>Sample Real Camera Photo</span>
        </button>
      </div>

      {/* Main Upload Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '10px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {isDeepfakeMode ? 'Deepfake & Face Tampering Detection' : 'AI-Synthesized Image Classification'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.84375rem', color: 'var(--text-secondary)' }}>
            {isDeepfakeMode
              ? 'Analyze facial images for GAN artifacts, face swap boundaries, and compression inconsistencies.'
              : 'Inspect images to detect synthetic diffusion patterns (Midjourney, DALL-E, Stable Diffusion) versus optical sensor captures.'}
          </p>
        </div>

        {/* Upload Drop Zone / Preview */}
        {!previewUrl ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border-primary)',
              borderRadius: '8px',
              padding: '36px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-primary)'}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                marginBottom: '12px'
              }}
            >
              <Upload size={22} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '3px' }}>
              Click to upload or drag & drop image
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Supports JPG, JPEG, PNG, or WEBP (Max 5 MB)
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files[0])}
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={15} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.84375rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {selectedFile?.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  ({formatFileSize(selectedFile?.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                disabled={isLoading}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  color: 'var(--color-risk-high)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <Trash2 size={12} />
                <span>Remove</span>
              </button>
            </div>

            {/* Preview Container */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '6px',
                overflow: 'hidden',
                maxHeight: '320px'
              }}
            >
              <img
                src={previewUrl}
                alt="Upload preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '320px',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
              />
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Rendered locally in browser. Sent only upon clicking Analyze.
              </span>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--accent-primary)',
                  border: 'none',
                  color: 'var(--text-on-accent)',
                  fontSize: '0.84375rem',
                  fontWeight: '700',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'opacity 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.currentTarget.style.opacity = '1';
                }}
              >
                {isLoading ? (
                  <>
                    <RotateCcw size={14} className="spin" />
                    <span>Analyzing Image...</span>
                  </>
                ) : (
                  <>
                    <Cpu size={14} />
                    <span>{isDeepfakeMode ? 'Analyze Deepfake Risk' : 'Analyze AI Generation'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Validation Error Message */}
        {validationError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: 'var(--color-risk-high-bg)',
              border: '1px solid var(--color-risk-high-border)',
              borderRadius: '6px',
              color: 'var(--color-risk-high)',
              fontSize: '0.8125rem'
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Backend Awaiting Integration Notice */}
        {backendUnavailable && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '14px',
              backgroundColor: 'var(--color-risk-medium-bg)',
              border: '1px solid var(--color-risk-medium-border)',
              borderRadius: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-risk-medium)' }}>
              <FileQuestion size={16} />
              <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700' }}>
                Backend Integration Status
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {backendUnavailable}
            </p>
          </div>
        )}

        {/* Rich Analysis Report Output */}
        {analysisResult && (
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: '700',
                    color: 'var(--accent-primary)',
                    textTransform: 'uppercase',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-primary)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {isDeepfakeMode ? 'Deepfake Inspection Report' : 'Synthetic Media Report'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Model: {analysisResult.model || 'Multi-Signal Vision Engine'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiskBadge level={analysisResult.riskLevel} size="sm" />
                <button
                  type="button"
                  onClick={() => downloadSafetyReport(analysisResult)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={12} />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Classification & Confidence Highlight */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '6px',
                border: '1px solid var(--border-primary)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Forensic Classification
                </span>
                <div style={{ fontSize: '1.1875rem', fontWeight: '800', color: analysisResult.riskLevel === 'high' ? 'var(--color-risk-high)' : analysisResult.riskLevel === 'medium' ? 'var(--color-risk-medium)' : 'var(--color-safe)' }}>
                  {analysisResult.classification || 'Evaluation Complete'}
                </div>
              </div>

              {analysisResult.confidence && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Forensic Confidence
                  </span>
                  <div style={{ fontSize: '1.1875rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    {Math.round(analysisResult.confidence <= 1 ? analysisResult.confidence * 100 : analysisResult.confidence)}%
                  </div>
                </div>
              )}
            </div>

            {/* Explanation Summary */}
            {analysisResult.explanation && (
              <p style={{ margin: 0, fontSize: '0.84375rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {analysisResult.explanation}
              </p>
            )}

            {/* Detected Artifacts */}
            {analysisResult.detectedArtifacts && analysisResult.detectedArtifacts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.71875rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Detected Forensic Signals ({analysisResult.detectedArtifacts.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {analysisResult.detectedArtifacts.map((art, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {art.name}
                        </span>
                        {art.severity && (
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: '700',
                              color: art.severity === 'high' ? 'var(--color-risk-high)' : 'var(--color-risk-medium)',
                              textTransform: 'uppercase'
                            }}
                          >
                            {art.severity}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                        {art.finding}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.71875rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Recommended Guidance
                </span>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Limitations Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          fontSize: '0.8125rem',
          lineHeight: 1.5
        }}
      >
        <Info size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Important Limitations:</strong> Ordinary AI-generated image models inspect noise signatures and frequency artifacts; they cannot reliably verify facial tampering or deepfakes. Deepfake detection requires specialized multi-frame biometric face-forensic models. Video deepfake detection is outside the current project scope.
        </span>
      </div>
    </div>
  );
}
