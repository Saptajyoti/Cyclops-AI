import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  Edit3, 
  Info,
  ScanText,
  ShieldAlert
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { validateImageFile, formatFileSize } from '../utils/imageValidation';
import { analyzeMessage } from '../services/api';

/**
 * ScreenshotAnalyzer Component
 * Client-side OCR using Tesseract.js with full dual-theme support.
 * Extracts conversation text from screenshots, allows user corrections,
 * and seamlessly routes the text to the primary safety detection engine.
 */
export default function ScreenshotAnalyzer({ onAnalysisSuccess, onNotify }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState('');

  // OCR Processing States
  const [isExtracting, setIsExtracting] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [ocrCompleted, setOcrCompleted] = useState(false);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError('');
    setSelectedFile(file);
    setExtractedText('');
    setOcrCompleted(false);
    setOcrProgress(0);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError('');
    setExtractedText('');
    setOcrCompleted(false);
    setOcrProgress(0);
    setOcrStatusText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSampleChat = (sampleType) => {
    const canvas = document.createElement('canvas');
    canvas.width = 460;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    // Phone dark chat background
    ctx.fillStyle = '#191C19';
    ctx.fillRect(0, 0, 460, 240);

    // Chat header bar
    ctx.fillStyle = '#202420';
    ctx.fillRect(0, 0, 460, 44);
    ctx.fillStyle = '#F1F1E9';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(sampleType === 'harassment' ? 'Anonymous Sender • Direct Message' : 'Project Study Group • Active', 20, 28);

    if (sampleType === 'harassment') {
      // Abusive bubble
      ctx.fillStyle = '#303630';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(20, 60, 400, 75, 8);
      else ctx.rect(20, 60, 400, 75);
      ctx.fill();

      ctx.fillStyle = '#F1F1E9';
      ctx.font = '15px sans-serif';
      ctx.fillText('You are worthless and nobody likes you.', 35, 90);
      ctx.fillText('Delete your account or else.', 35, 115);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'screenshot-harassment-dm.png', { type: 'image/png' });
        handleFileChange(file);
      }, 'image/png');

    } else {
      // Friendly bubble
      ctx.fillStyle = '#173D32';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(20, 60, 400, 75, 8);
      else ctx.rect(20, 60, 400, 75);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '15px sans-serif';
      ctx.fillText('Hey! Thanks for helping out today,', 35, 90);
      ctx.fillText('the group project presentation was great!', 35, 115);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'screenshot-friendly-chat.png', { type: 'image/png' });
        handleFileChange(file);
      }, 'image/png');
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      setValidationError('Please upload a screenshot first.');
      return;
    }

    setValidationError('');
    setIsExtracting(true);
    setOcrProgress(0);
    setOcrStatusText('Initializing OCR optical recognition engine...');

    let worker = null;
    try {
      worker = await createWorker('eng');

      setOcrStatusText('Scanning screenshot pixels for conversation text...');
      const ret = await worker.recognize(selectedFile);
      const text = ret?.data?.text || '';

      const cleaned = text.trim();
      if (!cleaned) {
        setValidationError('No text could be recognized in this screenshot. Please ensure the image is clear or type the message manually.');
      } else {
        setExtractedText(cleaned);
        setOcrCompleted(true);
        if (onNotify) {
          onNotify({ type: 'success', message: 'Text extracted from screenshot! You can review or edit it below.' });
        }
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setValidationError('Failed to extract text from screenshot. Please try a clearer screenshot or paste the text directly.');
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setIsExtracting(false);
      setOcrStatusText('');
    }
  };

  const handleAnalyzeExtractedText = async () => {
    if (!extractedText.trim()) {
      setValidationError('The extracted text box is empty. Please enter or correct the text before analyzing.');
      return;
    }

    setValidationError('');
    setIsAnalyzing(true);

    try {
      const response = await analyzeMessage(extractedText);

      if (response.success && response.data) {
        onAnalysisSuccess({
          ...response.data,
          type: 'ocr',
          imageMeta: {
            fileName: selectedFile?.name || 'screenshot.png',
            fileSize: selectedFile?.size || 0,
            mimeType: selectedFile?.type || 'image/png'
          }
        });
      } else {
        setValidationError(response.error?.message || 'Failed to analyze extracted text.');
      }
    } catch (err) {
      setValidationError('An unexpected error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className="screenshot-analyzer-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
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
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1875rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ScanText size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Screenshot Conversation Safety Analysis (OCR)</span>
          </h3>
          <p style={{ margin: 0, fontSize: '0.84375rem', color: 'var(--text-secondary)' }}>
            Upload a screenshot of a suspicious chat, comment thread, or DM. Client-side OCR extracts the conversation text so you can review and analyze it for cyberbullying and online threats.
          </p>
        </div>

        {/* Quick Demo Screenshot Presets */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            backgroundColor: 'var(--bg-secondary)',
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
            onClick={() => handleLoadSampleChat('harassment')}
            disabled={isExtracting || isAnalyzing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              color: 'var(--color-risk-high)',
              fontSize: '0.78125rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <ShieldAlert size={13} />
            <span>Sample Harassment Chat Screenshot</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSampleChat('friendly')}
            disabled={isExtracting || isAnalyzing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              color: 'var(--color-safe)',
              fontSize: '0.78125rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <CheckCircle2 size={13} />
            <span>Sample Friendly Chat Screenshot</span>
          </button>
        </div>

        {/* Upload Drop Zone / Preview */}
        {!previewUrl ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
            }}
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
              Click to upload screenshot or drag & drop image
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
                <FileText size={15} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.84375rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {selectedFile?.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  ({formatFileSize(selectedFile?.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                disabled={isExtracting || isAnalyzing}
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
                  cursor: (isExtracting || isAnalyzing) ? 'not-allowed' : 'pointer'
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
                maxHeight: '280px'
              }}
            >
              <img
                src={previewUrl}
                alt="Screenshot preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '280px',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
              />
            </div>

            {/* Extract OCR Trigger Button */}
            {!ocrCompleted && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleExtractText}
                  disabled={isExtracting}
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
                    cursor: isExtracting ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {isExtracting ? (
                    <>
                      <RotateCcw size={14} className="spin" />
                      <span>Extracting text with OCR...</span>
                    </>
                  ) : (
                    <>
                      <ScanText size={14} />
                      <span>Extract Text with OCR</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* OCR Progress Indicator */}
        {isExtracting && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78125rem', color: 'var(--text-primary)' }}>
              <span>{ocrStatusText || 'Running OCR extraction...'}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)' }}>
                {Math.round(ocrProgress)}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '5px',
                backgroundColor: 'var(--border-primary)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${ocrProgress}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-primary)',
                  transition: 'width 0.2s ease'
                }}
              />
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

        {/* Editable Extracted Text Area */}
        {ocrCompleted && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '18px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={15} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Extracted Conversation Text (Review & Edit)
                </span>
              </div>
              <span style={{ fontSize: '0.71875rem', color: 'var(--text-secondary)' }}>
                You can correct any OCR typos before analyzing
              </span>
            </div>

            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={4}
              placeholder="Extracted text will appear here. Edit as needed..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Note: Client-side OCR does not verify authenticity of screenshots.
              </span>

              <button
                type="button"
                onClick={handleAnalyzeExtractedText}
                disabled={isAnalyzing || !extractedText.trim()}
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
                  cursor: (isAnalyzing || !extractedText.trim()) ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw size={14} className="spin" />
                    <span>Analyzing Extracted Text...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Extracted Text</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OCR Limitations Disclaimer */}
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
          <strong>Important OCR Note:</strong> Optical Character Recognition (OCR) operates entirely in your browser using Tesseract.js. It extracts visible text but does not verify whether a conversation screenshot is genuine, fabricated, or digitally staged. Always inspect the extracted text to verify correctness.
        </span>
      </div>
    </div>
  );
}
