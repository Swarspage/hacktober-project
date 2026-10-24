import React, { useState } from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';

export default function FlagCard({ flag, riskLevel = 'high' }) {
  const { activeHighlightQuote, setActiveHighlightQuote, language } = useAnalysisContext();
  const [copied, setCopied] = useState(false);

  const isActive = activeHighlightQuote === flag.quote;

  const handleCopyCounterOffer = () => {
    if (!flag.what_to_ask) return;
    navigator.clipboard.writeText(flag.what_to_ask);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const borderClass =
    riskLevel === 'high'
      ? 'border-risk-high'
      : riskLevel === 'medium'
      ? 'border-risk-medium'
      : 'border-risk-low';

  return (
    <article className={`flag-card ${borderClass} ${isActive ? 'flag-card-active' : ''}`}>
      <div className="flag-card-header">
        <span className="flag-category-badge">{flag.category || 'Rental Clause'}</span>
        {flag.quote && (
          <button
            type="button"
            className="locate-clause-btn"
            onClick={() => setActiveHighlightQuote(flag.quote)}
          >
            🔍 {language === 'hi' ? 'दस्तावेज़ में देखें' : 'Locate in text'}
          </button>
        )}
      </div>

      {flag.quote && (
        <div className="quote-block">
          "{flag.quote}"
        </div>
      )}

      {flag.why_risky && (
        <div className="flag-section-block">
          <div className="flag-section-label">
            {language === 'hi' ? 'यह जोखिम भरा क्यों है' : "Why it's risky"}
          </div>
          <p className="flag-section-text">{flag.why_risky}</p>
        </div>
      )}

      {flag.what_to_ask && (
        <div className="counter-offer-box">
          <div className="counter-offer-header">
            <span className="counter-offer-title">
              💡 {language === 'hi' ? 'मकान मालिक से क्या मांगें (सुझाव)' : 'Suggested counter-offer to owner'}
            </span>
            <button
              type="button"
              className={`copy-counter-btn ${copied ? 'copy-success' : ''}`}
              onClick={handleCopyCounterOffer}
            >
              {copied ? '✓ Copied' : 'Copy proposal'}
            </button>
          </div>
          <p className="counter-offer-text">{flag.what_to_ask}</p>
        </div>
      )}
    </article>
  );
}
