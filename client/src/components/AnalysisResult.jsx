import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Copy, 
  Check, 
  Clock, 
  Cpu, 
  Flame, 
  CheckCircle2, 
  Download, 
  ScanText 
} from 'lucide-react';
import RiskBadge from './RiskBadge';
import RiskGauge from './RiskGauge';
import CategoryBadge from './CategoryBadge';
import DetectionSignals from './DetectionSignals';
import SafetyRecommendations from './SafetyRecommendations';
import ImpersonationIndicators from './ImpersonationIndicators';
import { detectImpersonationSignals } from '../utils/impersonation';
import { downloadSafetyReport } from '../utils/reportGenerator';

/**
 * AnalysisResult component
 * Displays full cybersecurity intelligence breakdown for an analyzed message,
 * including multi-signal toxicity, impersonation risk indicators, and downloadable reports.
 * Fully compliant with Light (Ivory x Deep Forest) & Dark (Obsidian x Acid Lime) themes.
 */
export default function AnalysisResult({ result, onCopyMessage }) {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!result) return null;

  const {
    id,
    message,
    category,
    riskScore,
    riskLevel,
    isToxic,
    confidence,
    detectedSignals = [],
    explanation,
    recommendations = [],
    analyzedAt,
    type = 'text',
    imageMeta = null
  } = result;

  // Run or extract impersonation indicators
  const impersonationIndicators = result.impersonationIndicators?.length 
    ? result.impersonationIndicators 
    : detectImpersonationSignals(message);

  const formattedDate = analyzedAt ? new Date(analyzedAt).toLocaleString() : 'Just now';

  const handleCopy = () => {
    if (message) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyMessage) onCopyMessage();
    }
  };

  const handleDownload = () => {
    const success = downloadSafetyReport({
      ...result,
      impersonationIndicators
    });
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const isOcr = type === 'ocr';

  return (
    <div
      className="analysis-result-panel"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        borderRadius: '10px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Result Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}
          >
            {isOcr ? <ScanText size={18} /> : <ShieldAlert size={18} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Threat Assessment Report
              </h3>
              {isOcr && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--accent-primary)',
                    fontWeight: '700'
                  }}
                >
                  OCR Extracted
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              <Clock size={11} />
              <span>{formattedDate}</span>
              {id && <span style={{ marginLeft: '6px' }}>• ID: {id.slice(0, 12)}</span>}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <RiskBadge level={riskLevel} size="md" />
          <CategoryBadge category={category} size="md" />

          {/* Download Report Button */}
          <button
            type="button"
            onClick={handleDownload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: downloadSuccess ? 'var(--color-safe-bg)' : 'var(--bg-secondary)',
              border: `1px solid ${downloadSuccess ? 'var(--color-safe-border)' : 'var(--border-primary)'}`,
              color: downloadSuccess ? 'var(--color-safe)' : 'var(--text-primary)',
              fontSize: '0.78125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Download formatted text report"
          >
            {downloadSuccess ? <Check size={13} /> : <Download size={13} />}
            <span>{downloadSuccess ? 'Downloaded!' : 'Download Report'}</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Risk Gauge & Overview */}
      <div
        className="result-top-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '160px 1fr',
          gap: '20px',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px'
        }}
      >
        {/* Left: Circular Risk Gauge */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RiskGauge score={riskScore} level={riskLevel} size={130} />
        </div>

        {/* Right: Summary Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 8px',
                borderRadius: '4px',
                backgroundColor: isToxic ? 'var(--color-risk-high-bg)' : 'var(--color-safe-bg)',
                border: isToxic ? '1px solid var(--color-risk-high-border)' : '1px solid var(--color-safe-border)',
                color: isToxic ? 'var(--color-risk-high)' : 'var(--color-safe)',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}
            >
              {isToxic ? <Flame size={12} /> : <CheckCircle2 size={12} />}
              <span>{isToxic ? 'Toxicity Detected' : 'Non-Toxic'}</span>
            </div>

            {typeof confidence === 'number' && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <Cpu size={12} style={{ color: 'var(--accent-primary)' }} />
                <span>Confidence: {Math.round(confidence <= 1 ? confidence * 100 : confidence)}%</span>
              </div>
            )}
          </div>

          <div>
            <span style={{ fontSize: '0.71875rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Assessment Summary
            </span>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.84375rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {explanation || 'Analysis completed. Review the detection signals, impersonation indicators, and suggested mitigation measures below.'}
            </p>
          </div>
        </div>
      </div>

      {/* Evaluated Message Text Card */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.71875rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {isOcr ? 'Evaluated Text (From Screenshot OCR)' : 'Analyzed Message Text'}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? 'var(--color-safe)' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 4px'
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            fontSize: '0.84375rem',
            lineHeight: 1.5,
            wordBreak: 'break-word',
            fontStyle: 'italic',
            maxHeight: '120px',
            overflowY: 'auto'
          }}
        >
          "{message}"
        </div>
      </div>

      {/* Impersonation Risk Indicators */}
      {impersonationIndicators && impersonationIndicators.length > 0 && (
        <ImpersonationIndicators indicators={impersonationIndicators} />
      )}

      {/* Two Column Section: Detection Signals & Recommendations */}
      <div
        className="result-bottom-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Signals */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Cpu size={14} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Detection Signals ({detectedSignals.length})
            </span>
          </div>
          <DetectionSignals signals={detectedSignals} />
        </div>

        {/* Safety Recommendations */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ShieldAlert size={14} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recommended Actions
            </span>
          </div>
          <SafetyRecommendations recommendations={recommendations} />
        </div>
      </div>
    </div>
  );
}
