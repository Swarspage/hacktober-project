import React, { useState } from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';

export default function NegotiationCard({
  flag,
  index,
  negotiationState = 'pending',
  onUpdateState,
  onUpdateCustomClause,
  customClause,
  language = 'en',
}) {
  const { activeHighlightQuote, setActiveHighlightQuote } = useAnalysisContext();
  const [copiedStrategy, setCopiedStrategy] = useState(false);
  const [copiedClause, setCopiedClause] = useState(false);
  const [isEditingClause, setIsEditingClause] = useState(false);
  const [editedText, setEditedText] = useState(customClause || flag.revised_clause || '');

  const isActive = activeHighlightQuote === flag.quote;

  const handleCopyStrategy = () => {
    if (!flag.what_to_ask) return;
    navigator.clipboard.writeText(flag.what_to_ask);
    setCopiedStrategy(true);
    setTimeout(() => setCopiedStrategy(false), 2000);
  };

  const handleCopyClause = () => {
    const clauseToCopy = editedText || flag.revised_clause || flag.what_to_ask;
    if (!clauseToCopy) return;
    navigator.clipboard.writeText(clauseToCopy);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2000);
  };

  const handleSaveEditedClause = () => {
    onUpdateCustomClause(index, editedText);
    setIsEditingClause(false);
  };

  const severity = (flag.severity || 'medium').toLowerCase();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'negotiated':
        return {
          label: language === 'hi' ? '✓ स्वीकृत / सुलझाया गया' : '✓ Agreed by Owner',
          className: 'status-negotiated',
        };
      case 'waived':
        return {
          label: language === 'hi' ? 'स्वीकार किया (जोखिम वहन)' : 'Waived (Accept Risk)',
          className: 'status-waived',
        };
      case 'dealbreaker':
        return {
          label: language === 'hi' ? '⚠️ अनिवार्य शर्त (Dealbreaker)' : '⚠️ Must-Change (Dealbreaker)',
          className: 'status-dealbreaker',
        };
      case 'pending':
      default:
        return {
          label: language === 'hi' ? '🔴 बातचीत के लिए' : '🔴 To Negotiate',
          className: 'status-pending',
        };
    }
  };

  const currentStatusInfo = getStatusBadge(negotiationState);

  return (
    <article
      className={`flag-card negotiation-card border-sev-${severity} ${
        negotiationState === 'negotiated' ? 'card-resolved' : ''
      } ${isActive ? 'flag-card-active' : ''}`}
    >
      <div className="flag-card-header negotiation-card-header">
        <div className="neg-header-left">
          <span className="flag-category-badge">{flag.category || 'Rental Clause'}</span>
          <span className={`severity-pill sev-${severity}`}>
            {severity.toUpperCase()}
          </span>
        </div>

        <div className="neg-status-selector-wrap">
          <label htmlFor={`status-select-${index}`} className="sr-only">Negotiation Status</label>
          <select
            id={`status-select-${index}`}
            value={negotiationState}
            onChange={(e) => onUpdateState(index, e.target.value)}
            className={`neg-status-select ${currentStatusInfo.className}`}
            title="Update negotiation progress to dynamically update risk score"
          >
            <option value="pending">🔴 {language === 'hi' ? 'बातचीत के लिए (सक्रिय)' : 'To Negotiate (Active)'}</option>
            <option value="dealbreaker">⚠️ {language === 'hi' ? 'अहम शर्त (Dealbreaker)' : 'Must-Change (Dealbreaker)'}</option>
            <option value="negotiated">✓ {language === 'hi' ? 'मकान मालिक सहमत (सुलझा)' : 'Agreed by Landlord (Resolved)'}</option>
            <option value="waived">⚪ {language === 'hi' ? 'स्वीकार किया (जोखिम मंजूर)' : 'Waived (Accept Risk)'}</option>
          </select>

          {flag.quote && (
            <button
              type="button"
              className="locate-clause-btn"
              onClick={() => setActiveHighlightQuote(flag.quote)}
              title="Highlight this exact sentence in document view"
            >
              🔍 {language === 'hi' ? 'दस्तावेज़ में देखें' : 'Locate'}
            </button>
          )}
        </div>
      </div>

      {flag.quote && (
        <div className="quote-block">
          <span className="quote-tag">Original Clause:</span>
          "{flag.quote}"
        </div>
      )}

      {flag.why_risky && (
        <div className="flag-section-block">
          <div className="flag-section-label">
            ⚠️ {language === 'hi' ? 'यह जोखिम भरा क्यों है' : "Legal & Financial Risk"}
          </div>
          <p className="flag-section-text">{flag.why_risky}</p>
        </div>
      )}

      {flag.what_to_ask && (
        <div className="counter-offer-box">
          <div className="counter-offer-header">
            <span className="counter-offer-title">
              💡 {language === 'hi' ? 'बातचीत की रणनीति (मकान मालिक से क्या कहें)' : 'Strategic Negotiation Ask'}
            </span>
            <button
              type="button"
              className={`copy-counter-btn ${copiedStrategy ? 'copy-success' : ''}`}
              onClick={handleCopyStrategy}
            >
              {copiedStrategy ? '✓ Copied Ask' : 'Copy Strategy'}
            </button>
          </div>
          <p className="counter-offer-text">{flag.what_to_ask}</p>
        </div>
      )}

      <div className="redline-clause-box">
        <div className="redline-header">
          <div className="redline-title-group">
            <span className="redline-icon">⚖️</span>
            <span className="redline-title">
              {language === 'hi' ? 'प्रस्तावित संशोधित क्लॉज़ (अनुबंध संशोधन हेतु)' : 'Proposed Contract Redline (Replacement Clause)'}
            </span>
          </div>

          <div className="redline-actions">
            {!isEditingClause ? (
              <button
                type="button"
                className="btn-edit-redline"
                onClick={() => setIsEditingClause(true)}
              >
                ✏️ {language === 'hi' ? 'बदलें' : 'Edit wording'}
              </button>
            ) : (
              <button
                type="button"
                className="btn-save-redline"
                onClick={handleSaveEditedClause}
              >
                ✓ {language === 'hi' ? 'सहेजें' : 'Done'}
              </button>
            )}

            <button
              type="button"
              className={`copy-counter-btn ${copiedClause ? 'copy-success' : ''}`}
              onClick={handleCopyClause}
            >
              {copiedClause ? '✓ Copied Clause' : 'Copy Redline'}
            </button>
          </div>
        </div>

        {isEditingClause ? (
          <textarea
            className="redline-editor-textarea"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={3}
          />
        ) : (
          <p className="redline-clause-text">
            {editedText || flag.revised_clause || flag.what_to_ask}
          </p>
        )}
      </div>
    </article>
  );
}
