import React, { useState } from 'react';
import { History as HistoryIcon, X, FileText, ArrowLeft } from 'lucide-react';
import HistoryTable from '../components/HistoryTable';
import AnalysisResult from '../components/AnalysisResult';

/**
 * History page
 * Search, filter, view and manage all stored analysis history.
 */
export default function History({
  history,
  onDeleteRecord,
  onClearHistory,
  onNotify
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="history-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
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
          Analysis History
        </h2>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Locally preserved record of past message analyses, detection signals, and recommendations.
        </p>
      </div>

      {/* Main History Table */}
      <HistoryTable
        history={history}
        onSelectRecord={(item) => setSelectedItem(item)}
        onDeleteRecord={(id) => {
          onDeleteRecord(id);
          if (selectedItem?.id === id) setSelectedItem(null);
          onNotify({ type: 'info', message: 'Analysis record removed from LocalStorage.' });
        }}
        onClearHistory={() => {
          onClearHistory();
          setSelectedItem(null);
          onNotify({ type: 'info', message: 'All analysis history successfully cleared.' });
        }}
      />

      {/* Inspection Modal / Drawer for detailed record view */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-primary)',
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--bg-surface)',
                zIndex: 10
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                Historical Report Details
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px'
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <AnalysisResult
                result={selectedItem}
                onCopyMessage={() => onNotify({ type: 'success', message: 'Message copied!' })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

