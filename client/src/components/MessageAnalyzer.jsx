import React, { useState } from 'react';
import { 
  Send, 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  ShieldAlert, 
  Info,
  RotateCcw
} from 'lucide-react';
import { analyzeMessage } from '../services/api';

const MAX_CHAR_LIMIT = 2000;

// Curated demonstration samples with clear classification labels
const SAMPLE_MESSAGES = [
  {
    label: 'Friendly Chat',
    categoryHint: 'Safe Conversation',
    text: 'Hey everyone! Thanks for helping out with the group project today, really appreciate everyone stepping up!'
  },
  {
    label: 'Targeted Harassment',
    categoryHint: 'Harassment Pattern',
    text: 'Nobody wants you in this group. Stop commenting on our posts or we will make sure you get humiliated everywhere.'
  },
  {
    label: 'Threatening Language',
    categoryHint: 'Threat Signal',
    text: 'You better watch your back tomorrow after class. You are going to regret ever crossing us.'
  },
  {
    label: 'Toxic Insult',
    categoryHint: 'Toxicity Pattern',
    text: 'What a completely brainless and worthless post. Do everyone a favor and delete your account forever.'
  }
];

export default function MessageAnalyzer({
  onAnalysisSuccess,
  isLoading,
  setIsLoading,
  onError
}) {
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(null);

  const charCount = message.length;
  const isOverLimit = charCount > MAX_CHAR_LIMIT;
  const isEmpty = !message.trim();
  const isButtonDisabled = isEmpty || isOverLimit || isLoading;

  const handleClear = () => {
    setMessage('');
    setValidationError('');
    setSelectedSampleIndex(null);
  };

  const handleSelectSample = (sample, index) => {
    setMessage(sample.text);
    setValidationError('');
    setSelectedSampleIndex(index);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (isEmpty) {
      setValidationError('Please enter a message to analyze.');
      return;
    }

    if (isOverLimit) {
      setValidationError(`Message is too long (${charCount}/${MAX_CHAR_LIMIT} characters). Please shorten it.`);
      return;
    }

    setValidationError('');
    setIsLoading(true);

    try {
      const response = await analyzeMessage(message);

      if (response.success && response.data) {
        onAnalysisSuccess(response.data);
      } else {
        const errorMsg = response.error?.message || 'Unable to analyze message. Please check the backend connection and try again.';
        setValidationError(errorMsg);
        if (onError) onError(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred during analysis. Please try again.';
      setValidationError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="message-analyzer-card"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        borderRadius: '10px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2
            style={{
              margin: '0 0 4px 0',
              fontSize: '1.1875rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <ShieldAlert size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Analyze a Message</span>
          </h2>
          <p style={{ margin: 0, fontSize: '0.84375rem', color: 'var(--text-secondary)' }}>
            Inspect online communication for harassment, threat patterns, and social engineering.
          </p>
        </div>

        {/* Clear Button */}
        {message && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              padding: '5px 10px',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Clear text"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Demo Mode / Sample Message Picker */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Try Demonstration Samples:
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SAMPLE_MESSAGES.map((sample, idx) => {
            const isSelected = selectedSampleIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample, idx)}
                disabled={isLoading}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'var(--bg-active)' : 'var(--bg-secondary)',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{sample.label}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>({sample.categoryHint})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Textarea */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (validationError) setValidationError('');
          }}
          disabled={isLoading}
          rows={5}
          placeholder="Paste a comment, chat message, or online conversation here..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: 'var(--bg-input)',
            border: isOverLimit
              ? '1px solid var(--color-risk-high)'
              : validationError
                ? '1px solid var(--color-risk-high)'
                : '1px solid var(--border-primary)',
            borderRadius: '8px',
            padding: '12px 14px',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            resize: 'vertical',
            minHeight: '120px',
            outline: 'none',
            transition: 'border-color 0.15s ease'
          }}
          onFocus={(e) => {
            if (!isOverLimit && !validationError) {
              e.target.style.borderColor = 'var(--border-focus)';
            }
          }}
          onBlur={(e) => {
            if (!isOverLimit && !validationError) {
              e.target.style.borderColor = 'var(--border-primary)';
            }
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isButtonDisabled) {
              handleSubmit(e);
            }
          }}
        />

        {/* Character Counter */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '4px 2px 0',
            fontSize: '0.71875rem',
            fontFamily: 'var(--font-mono)',
            color: isOverLimit ? 'var(--color-risk-high)' : charCount > MAX_CHAR_LIMIT * 0.85 ? 'var(--color-risk-medium)' : 'var(--text-muted)'
          }}
        >
          {charCount} / {MAX_CHAR_LIMIT}
        </div>
      </div>

      {/* Validation Error Banner */}
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
            fontSize: '0.8125rem',
            marginBottom: '14px'
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Bottom Bar: Privacy Note & Action Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '440px' }}>
          <Info size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
            Analyzed securely through local/protected models. Avoid submitting sensitive personal info.
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: isButtonDisabled ? 'var(--bg-secondary)' : 'var(--accent-primary)',
            border: 'none',
            color: isButtonDisabled ? 'var(--text-muted)' : 'var(--text-on-accent)',
            fontSize: '0.84375rem',
            fontWeight: '700',
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (!isButtonDisabled) e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            if (!isButtonDisabled) e.currentTarget.style.opacity = '1';
          }}
        >
          {isLoading ? (
            <>
              <RotateCcw size={15} className="spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze Message</span>
              <Send size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
