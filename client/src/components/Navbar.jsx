import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAnalysisContext } from '../context/AnalysisContext';

export default function Navbar() {
  const { language, setLanguage, status, result } = useAnalysisContext();
  const location = useLocation();

  const isReportPage = location.pathname === '/report';

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-wordmark">
          <span className="brand-dot" />
          <span>Agreement RedFlag Reader</span>
        </Link>

        <div className="header-actions">
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
                ? (language === 'hi' ? 'रिपोर्ट देखें →' : 'View Report →')
                : (language === 'hi' ? 'स्टूडियो खोलें →' : 'Open Studio →')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
