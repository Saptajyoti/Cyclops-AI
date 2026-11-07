import React from 'react';
import { ShieldAlert, ArrowLeft, RotateCcw } from 'lucide-react';
import MessageAnalyzer from '../components/MessageAnalyzer';
import AnalysisResult from '../components/AnalysisResult';
import LoadingState from '../components/LoadingState';

/**
 * Analyzer page
 * The core interaction hub for submitting text, triggering AI inference,
 * and reviewing threat assessment reports.
 */
export default function Analyzer({
  currentResult,
  isLoading,
  setIsLoading,
  onAnalysisSuccess,
  onResetResult,
  onNotify
}) {
  return (
    <div className="analyzer-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title */}
      <div>
        <h2
          style={{
            margin: '0 0 6px 0',
            fontSize: '1.75rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}
        >
          Message Threat Analyzer
        </h2>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Evaluate chat messages, comments, or emails against multi-signal cyberbullying and harm models.
        </p>
      </div>

      {/* Input Section */}
      <MessageAnalyzer
        onAnalysisSuccess={onAnalysisSuccess}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onError={(msg) => onNotify({ type: 'error', message: msg })}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <LoadingState message="Analyzing message with AI detection model..." />
      )}

      {/* Current Result View */}
      {!isLoading && currentResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Latest Assessment Output
            </span>
            <button
              type="button"
              onClick={onResetResult}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-primary)',
                borderRadius: '6px',
                padding: '4px 10px',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} />
              <span>Clear Result View</span>
            </button>
          </div>

          <AnalysisResult
            result={currentResult}
            onCopyMessage={() => onNotify({ type: 'success', message: 'Message text copied to clipboard!' })}
          />
        </div>
      )}
    </div>
  );
}

