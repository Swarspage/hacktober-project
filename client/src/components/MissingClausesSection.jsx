import React, { useState } from 'react';

export default function MissingClausesSection({
  missing = [],
  language = 'en',
}) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!missing || missing.length === 0) return null;

  const handleCopyClause = (clause, idx) => {
    if (!clause) return;
    navigator.clipboard.writeText(clause);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <section className="missing-safeguards-card fade-in">
      <div className="missing-card-top">
        <div className="missing-title-row">
          <span className="missing-badge-icon">⚠️</span>
          <div>
            <h3 className="missing-main-title">
              {language === 'hi'
                ? 'अनुबंध में अनुपस्थित आवश्यक किरायेदार सुरक्षा शर्तें'
                : 'Essential Tenant Protections Missing From Agreement'}
            </h3>
            <p className="missing-subtitle">
              {language === 'hi'
                ? 'इन मानक शर्तों की अनुपस्थिति किरायेदार को अनपेक्षित खर्चों और विवादों के प्रति असुरक्षित बनाती है।'
                : 'Omission of standard safeguards creates legal vulnerability. Propose adding these clauses to your lease.'}
            </p>
          </div>
        </div>
        <span className="missing-count-badge">
          {missing.length} {language === 'hi' ? 'अनुपस्थित शर्तें' : 'Missing Safeguards'}
        </span>
      </div>

      <div className="missing-items-grid">
        {missing.map((rawItem, idx) => {
          const item =
            typeof rawItem === 'string'
              ? {
                  item: rawItem,
                  importance: 'high',
                  why_needed:
                    'Omitting this standard term exposes the tenant to unilateral discretion and unexpected liabilities.',
                  suggested_clause: `It is agreed that ${rawItem} shall be strictly maintained and adhered to per model Maharashtra residential tenancy guidelines.`,
                }
              : rawItem;

          const imp = (item.importance || 'high').toLowerCase();
          const isCopied = copiedIdx === idx;

          return (
            <div key={idx} className={`missing-item-card border-imp-${imp}`}>
              <div className="missing-item-header">
                <span className="missing-item-name">{item.item}</span>
                <span className={`importance-tag imp-${imp}`}>
                  {imp === 'critical'
                    ? language === 'hi'
                      ? 'गंभीर'
                      : 'Critical'
                    : imp === 'high'
                    ? language === 'hi'
                      ? 'उच्च'
                      : 'High'
                    : language === 'hi'
                    ? 'मध्यम'
                    : 'Standard'}
                </span>
              </div>

              {item.why_needed && (
                <p className="missing-item-reason">
                  <span className="reason-label">
                    {language === 'hi' ? 'जोखिम:' : 'Vulnerability:'}{' '}
                  </span>
                  {item.why_needed}
                </p>
              )}

              {item.suggested_clause && (
                <div className="missing-suggested-box">
                  <div className="missing-box-header">
                    <span className="missing-box-title">
                      {language === 'hi'
                        ? 'प्रस्तावित सुरक्षा क्लॉज़ (अनुबंध में जोड़ने हेतु):'
                        : 'Suggested Protective Clause to Insert:'}
                    </span>
                    <button
                      type="button"
                      className={`copy-counter-btn ${isCopied ? 'copy-success' : ''}`}
                      onClick={() => handleCopyClause(item.suggested_clause, idx)}
                    >
                      {isCopied ? '✓ Copied' : 'Copy Clause'}
                    </button>
                  </div>
                  <p className="missing-clause-content">"{item.suggested_clause}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
