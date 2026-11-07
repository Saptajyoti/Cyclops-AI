import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Filter, 
  Eye, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  X, 
  Download, 
  ScanText, 
  FileText, 
  Sparkles 
} from 'lucide-react';
import RiskBadge from './RiskBadge';
import CategoryBadge from './CategoryBadge';
import EmptyState from './EmptyState';
import { downloadSafetyReport } from '../utils/reportGenerator';

/**
 * HistoryTable component
 * Search, filter by risk, category, and analysis type (Text, OCR, Image).
 * Fully styled for Light Mode (Ivory × Deep Forest) and Dark Mode (Obsidian × Acid Lime).
 */
export default function HistoryTable({
  history = [],
  onSelectRecord,
  onDeleteRecord,
  onClearHistory
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Filtered dataset
  const filteredList = useMemo(() => {
    return history.filter((item) => {
      const query = searchTerm.toLowerCase().trim();
      const matchSearch = !query || 
        (item.message && item.message.toLowerCase().includes(query)) ||
        (item.explanation && item.explanation.toLowerCase().includes(query)) ||
        (item.id && item.id.toLowerCase().includes(query)) ||
        (item.imageMeta?.fileName && item.imageMeta.fileName.toLowerCase().includes(query));

      const matchRisk = riskFilter === 'all' || (item.riskLevel || '').toLowerCase() === riskFilter;
      const matchCategory = categoryFilter === 'all' || (item.category || '').toLowerCase() === categoryFilter;

      const itemType = (item.type || 'text').toLowerCase();
      const matchType = typeFilter === 'all' || 
        (typeFilter === 'text' && (itemType === 'text' || !item.type)) ||
        (typeFilter === 'ocr' && itemType === 'ocr') ||
        (typeFilter === 'image' && (itemType === 'image' || itemType === 'deepfake'));

      return matchSearch && matchRisk && matchCategory && matchType;
    });
  }, [history, searchTerm, riskFilter, categoryFilter, typeFilter]);

  const uniqueCategories = useMemo(() => {
    const set = new Set();
    history.forEach(item => {
      if (item.category) set.add(item.category.toLowerCase());
    });
    return Array.from(set);
  }, [history]);

  const getTypeBadge = (type) => {
    const t = (type || 'text').toLowerCase();
    if (t === 'ocr') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.6875rem',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--accent-primary)',
            fontWeight: '700'
          }}
        >
          <ScanText size={11} />
          <span>OCR</span>
        </span>
      );
    }
    if (t === 'image' || t === 'deepfake') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.6875rem',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--accent-primary)',
            fontWeight: '700'
          }}
        >
          <Sparkles size={11} />
          <span>Image</span>
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.6875rem',
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-secondary)',
          fontWeight: '600'
        }}
      >
        <FileText size={11} />
        <span>Text</span>
      </span>
    );
  };

  return (
    <div
      className="history-table-container"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-primary)',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Controls Bar: Search & Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}
      >
        {/* Search input */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 240px',
            maxWidth: '360px'
          }}
        >
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages, signals, or ID..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              padding: '8px 12px 8px 34px',
              color: 'var(--text-primary)',
              fontSize: '0.84375rem',
              outline: 'none'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters and Clear Actions */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {/* Analysis Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              padding: '7px 10px',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Types</option>
            <option value="text">Text Safety</option>
            <option value="ocr">Screenshot OCR</option>
            <option value="image">Image Analysis</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              padding: '7px 10px',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              padding: '7px 10px',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>

          {/* Clear All History Button */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                backgroundColor: 'var(--color-risk-high-bg)',
                border: '1px solid var(--color-risk-high-border)',
                borderRadius: '6px',
                color: 'var(--color-risk-high)',
                fontSize: '0.78125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease'
              }}
              title="Clear entire history"
            >
              <Trash2 size={13} />
              <span>Clear Ledger</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--overlay-bg)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-primary)',
              borderRadius: '10px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-risk-high-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-risk-high)'
                }}
              >
                <Trash2 size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Clear Entire Threat Ledger?
                </h4>
                <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                  This permanently removes all {history.length} records from browser storage.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowConfirmClear(false);
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--color-risk-high)',
                  color: 'var(--color-risk-high-contrast)',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Content */}
      {filteredList.length === 0 ? (
        <EmptyState
          title={searchTerm ? 'No Matching Records' : 'No Threat Records'}
          description={searchTerm ? `No records matched your search query "${searchTerm}".` : 'Completed analyses will be recorded in this local browser ledger.'}
        />
      ) : (
        <div className="table-responsive">
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.8125rem'
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)'
                }}
              >
                <th style={{ padding: '10px 12px', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Type</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Evaluated Content</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Category</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Risk Level</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Score</th>
                <th style={{ padding: '10px 12px', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Timestamp</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => {
                const dateStr = item.analyzedAt ? new Date(item.analyzedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown';

                return (
                  <tr
                    key={item.id}
                    className="history-row"
                    style={{
                      borderBottom: '1px solid var(--border-primary)',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '12px 12px' }}>
                      {getTypeBadge(item.type)}
                    </td>

                    <td style={{ padding: '12px 12px', maxWidth: '320px' }}>
                      <div
                        onClick={() => onSelectRecord && onSelectRecord(item)}
                        style={{
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer'
                        }}
                        title={item.message}
                      >
                        {item.message}
                      </div>
                      {item.imageMeta && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          {item.imageMeta.fileName}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '12px 12px' }}>
                      <CategoryBadge category={item.category} size="sm" />
                    </td>

                    <td style={{ padding: '12px 12px' }}>
                      <RiskBadge level={item.riskLevel} size="sm" />
                    </td>

                    <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {typeof item.riskScore === 'number' ? `${item.riskScore}/100` : '—'}
                    </td>

                    <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                      {dateStr}
                    </td>

                    <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => downloadSafetyReport(item)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-primary)',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Download plain text safety report"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(item.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-primary)',
                            borderRadius: '4px',
                            color: 'var(--color-risk-high)',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
