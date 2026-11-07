import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Cpu, 
  Lock, 
  ScanText, 
  UserCheck 
} from 'lucide-react';
import CyclopsLogo from '../components/CyclopsLogo';

/**
 * About page
 * Explains project vision, problem statement, multi-modal AI architecture, safety recommendations,
 * and essential responsible AI limitations.
 * Fully dual-theme compliant (Light Ivory x Deep Forest / Dark Obsidian x Acid Lime).
 */
export default function About() {
  return (
    <div className="about-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '960px' }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '14px' }}>
          <CyclopsLogo size={14} />
          <span>CYBER SAFETY INTELLIGENCE PLATFORM</span>
        </div>

        <h2 style={{ margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          About Cyclops AI
        </h2>

        <p style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
          "See the Threat. Stop the Harm."
        </p>

        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '780px' }}>
          Cyclops AI is a multi-modal cybersecurity intelligence web application engineered to identify online threats, targeted harassment, cyberbullying, social engineering, and synthetic media manipulation across text messages, screenshot conversations, and visual media.
        </p>
      </div>

      {/* 2-Column: Problem & Solution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* The Problem */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'var(--color-risk-high-bg)', color: 'var(--color-risk-high)', display: 'flex' }}>
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              The Problem
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.84375rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Modern digital abuse spans diverse vectors: abusive text comments, screenshots of targeted chat harassment, identity impersonation scams, and manipulated synthetic imagery. Users lack unified instruments to evaluate incoming threats and obtain immediate, actionable guidance.
          </p>
        </div>

        {/* The Proposed Solution */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)', display: 'flex' }}>
              <Shield size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              The Proposed Solution
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.84375rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Cyclops AI integrates neural text threat evaluation, client-side Tesseract OCR for screenshot scanning, social engineering heuristics, and synthetic media inspection into a single cohesive, privacy-conscious security instrument.
          </p>
        </div>
      </div>

      {/* Core Capabilities */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '10px',
          padding: '22px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ margin: '0 0 14px 0', fontSize: '1.0625rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Multi-Modal Cyber Safety Capabilities
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <Cpu size={16} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Text Safety Engine
            </h4>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Rapid classification across Harassment, Threat, Hate Speech, Cyberbullying, and General Toxicity.
            </p>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <ScanText size={16} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Screenshot OCR Scanning
            </h4>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              In-browser Tesseract.js optical character recognition extracts message content from screenshots with editable review.
            </p>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <UserCheck size={16} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Impersonation Indicators
            </h4>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Identifies credential harvesting (OTPs, passwords), artificial urgency, and financial pressure patterns.
            </p>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Image & Deepfake Safety
            </h4>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Inspects images for AI synthesis artifacts, camera EXIF headers, and facial tampering markers.
            </p>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <FileText size={16} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Downloadable Reports
            </h4>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Generate comprehensive plain text assessment summaries for documentation and incident records.
            </p>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            <Lock size={16} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Local-First Privacy
            </h4>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Analysis history is stored solely inside the browser's LocalStorage. No screenshots or image Base64 strings are persisted.
            </p>
          </div>
        </div>
      </div>

      {/* Responsible AI & Limitations Notice */}
      <div
        style={{
          backgroundColor: 'var(--color-risk-medium-bg)',
          border: '1px solid var(--color-risk-medium-border)',
          borderRadius: '8px',
          padding: '16px 20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start'
        }}
      >
        <AlertTriangle size={20} style={{ color: 'var(--color-risk-medium)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Important Limitations & Responsible AI Disclaimer
          </h4>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            AI-generated classifications and rule-based risk indicators are supportive diagnostic instruments, not a replacement for human judgment, legal counsel, or emergency services. Machine learning models may produce false positives or false negatives depending on context, sarcasm, and slang. Rule-based risk indicators detect social engineering patterns, not proof of account identity or authenticity. In case of immediate physical danger, contact local emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
