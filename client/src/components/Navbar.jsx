import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAnalysisContext } from '../context/AnalysisContext';

export default function Navbar() {
  const { language, setLanguage, status, result, riskMetrics, setIsConfigModalOpen } = useAnalysisContext();
  const location = useLocation();

  const isReportPage = location.pathname === '/report';

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical':
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#D97706';
      case 'low':
      default:
        return '#059669';
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-wordmark">
          <span className="brand-dot" />
          <span>Agreement RedFlag Reader</span>
          <span className="brand-pill">LegalTech AI</span>
        </Link>

        <div className="header-actions">
          {/* Quick Config Button if on Report */}
          {isReportPage && result && (
            <button
              type="button"
              className="nav-config-quick-btn"
              onClick={() => setIsConfigModalOpen(true)}
              title="Configure Dynamic Risk Model"
            >
              ⚙️ <span>{language === 'hi' ? 'मॉडल सेटिंग्स' : 'Config Model'}</span>
            </button>
          )}

          {/* Mini Score indicator in Navbar */}
          {result && (
            <div
              className="nav-score-indicator"
              style={{ borderColor: getRiskColor(riskMetrics?.riskLevel) }}
              title="Dynamic Contract Risk Index"
            >
              <span
                className="nav-score-dot"
                style={{ backgroundColor: getRiskColor(riskMetrics?.riskLevel) }}
              />
              <span className="nav-score-text">
                {riskMetrics?.currentScore || 0} <small>/ 100</small>
              </span>
            </div>
          )}

          {/* Language Toggle */}
          <div className="lang-toggle" role="group" aria-label="Language selector">
            <button
              type="button"
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              disabled={status === 'loading'}
            >
              English
            </button>
            <button
              type="button"
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
              disabled={status === 'loading'}
            >
              हिन्दी
            </button>
          </div>

          {/* Navigation Links */}
          {isReportPage ? (
            <Link to="/" className="header-nav-btn secondary-nav-btn">
              ← {language === 'hi' ? 'नया समझौता' : 'New Agreement'}
            </Link>
          ) : (
            <Link to="/report" className="header-nav-btn primary-nav-btn">
              {result
                ? (language === 'hi' ? 'ऑडिट व बातचीत रिपोर्ट →' : 'View Audit & Negotiation →')
                : (language === 'hi' ? 'स्टूडियो खोलें →' : 'Open Studio →')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
