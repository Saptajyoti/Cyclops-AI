import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Analyzer from './pages/Analyzer';
import History from './pages/History';
import About from './pages/About';
import ImageAnalyzer from './components/ImageAnalyzer';
import ScreenshotAnalyzer from './components/ScreenshotAnalyzer';
import { 
  getStoredHistory, 
  saveAnalysisRecord, 
  deleteAnalysisRecord, 
  clearAllHistory, 
  calculateStats 
} from './utils/storage';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [history, setHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Backend connection status state
  const [backendStatus, setBackendStatus] = useState({
    available: false,
    status: 'Checking...',
    details: null
  });

  // Load history from LocalStorage on mount
  useEffect(() => {
    const loaded = getStoredHistory();
    setHistory(loaded);
  }, []);

  // Compute live dashboard stats from history state
  const stats = calculateStats(history);

  // Poll backend health check
  const refreshHealth = useCallback(async () => {
    setBackendStatus((prev) => ({ ...prev, status: 'Checking...' }));
    const result = await checkBackendHealth();
    setBackendStatus(result);
  }, []);

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 30000);
    return () => clearInterval(interval);
  }, [refreshHealth]);

  // Handle successful analysis result from backend or OCR
  const handleAnalysisSuccess = (analysisData) => {
    const updatedHistory = saveAnalysisRecord(analysisData);
    setHistory(updatedHistory);
    setCurrentResult(analysisData);
    setActiveTab('analyzer');
    setToast({
      type: 'success',
      message: 'Analysis completed successfully and saved to local history!'
    });
  };

  // Delete individual record
  const handleDeleteRecord = (id) => {
    const updated = deleteAnalysisRecord(id);
    setHistory(updated);
    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  // Clear all records
  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
    setCurrentResult(null);
  };

  // Select historical record to inspect in analyzer
  const handleSelectRecordFromOverview = (record) => {
    setCurrentResult(record);
    setActiveTab('analyzer');
  };

  // Page titles
  const pageTitles = {
    dashboard: { title: 'Intelligence Overview', subtitle: 'Threat Telemetry & Real-Time Monitoring' },
    analyzer: { title: 'Text Safety Analyzer', subtitle: 'Multi-Signal Harm & Cyberbullying Detection' },
    'image-analyzer': { title: 'Image Safety Inspector', subtitle: 'AI Generation & Deepfake Tampering Analysis' },
    'screenshot-analyzer': { title: 'Screenshot Safety Analysis (OCR)', subtitle: 'Conversation Text Extraction & Threat Screening' },
    history: { title: 'Analysis History', subtitle: 'Local Browser Threat Ledger' },
    about: { title: 'About CyberShield AI', subtitle: 'Responsible Cyber Safety Architecture' }
  };

  const currentNav = pageTitles[activeTab] || pageTitles.dashboard;

  return (
    <ThemeProvider>
      <div className="cyclops-app" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className="cyclops-main-wrapper"
        style={{
          flex: 1,
          marginLeft: '260px',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh'
        }}
      >
        {/* Top Navbar */}
        <Navbar
          currentTitle={currentNav.title}
          subtitle={currentNav.subtitle}
          backendStatus={backendStatus}
          onRefreshHealth={refreshHealth}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content Container */}
        <main
          className="cyclops-main-content"
          style={{
            flex: 1,
            padding: '28px 32px',
            maxWidth: '1360px',
            width: '100%',
            boxSizing: 'border-box',
            margin: '0 auto'
          }}
        >
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              history={history}
              onSelectRecord={handleSelectRecordFromOverview}
              onNavigateToAnalyzer={() => setActiveTab('analyzer')}
            />
          )}

          {activeTab === 'analyzer' && (
            <Analyzer
              currentResult={currentResult}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onAnalysisSuccess={handleAnalysisSuccess}
              onResetResult={() => setCurrentResult(null)}
              onNotify={(t) => setToast(t)}
            />
          )}

          {activeTab === 'image-analyzer' && (
            <ImageAnalyzer
              onSaveResult={handleAnalysisSuccess}
              onNotify={(t) => setToast(t)}
            />
          )}

          {activeTab === 'screenshot-analyzer' && (
            <ScreenshotAnalyzer
              onAnalysisSuccess={handleAnalysisSuccess}
              onNotify={(t) => setToast(t)}
            />
          )}

          {activeTab === 'history' && (
            <History
              history={history}
              onDeleteRecord={handleDeleteRecord}
              onClearHistory={handleClearHistory}
              onNotify={(t) => setToast(t)}
            />
          )}

          {activeTab === 'about' && (
            <About />
          )}
        </main>
      </div>

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  </ThemeProvider>
  );
}
