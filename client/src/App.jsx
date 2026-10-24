import React, { useState, useEffect } from 'react';
import { SAMPLES } from './samples';

const I18N = {
  en: {
    title: 'Rental Agreement Red-Flag Reader',
    subtitle: "Review Maharashtra rental and Leave and Licence agreements to spot unfair clauses, penalties, and missing tenant protections.",
    placeholder: 'Paste your rental agreement here...',
    selectSample: 'Choose a sample agreement...',
    loadSample: 'Load sample',
    analyze: 'Analyze agreement',
    analyzing: 'Analyzing',
    charLimit: '15,000',
    emptyState: 'Paste an agreement to see which clauses could cost you money.',
    overallRisk: 'Overall risk',
    highRisk: 'High risk',
    mediumRisk: 'Medium risk',
    lowRisk: 'Low risk',
    whyRisky: "Why it's risky",
    whatToAsk: 'What to ask the owner',
    missingTitle: 'Missing from your agreement',
    droppedNotice: (count) => `${count} unverified ${count === 1 ? 'item was' : 'items were'} removed.`,
    errorEmpty: 'Please paste agreement text to analyze.',
    errorTooLong: 'Agreement text exceeds the 15,000 character limit.',
    disclaimer: 'Not legal advice. Your document is never stored.'
  },
  hi: {
    title: 'किराया समझौता रेड-फ्लैग रीडर',
    subtitle: 'महाराष्ट्र रेंटल और लीव एंड लाइसेंस समझौते में छुपे जोखिम, भारी पेनल्टी और जरूरी शर्तों की जांच करें।',
    placeholder: 'अपना किराया समझौता यहाँ पेस्ट करें...',
    selectSample: 'एक नमूना समझौता चुनें...',
    loadSample: 'नमूना लोड करें',
    analyze: 'समझौते का विश्लेषण करें',
    analyzing: 'विश्लेषण जारी है',
    charLimit: '15,000',
    emptyState: 'समझौता पेस्ट करें और देखें कि कौन से नियम आपके लिए नुकसानदेह हो सकते हैं।',
    overallRisk: 'समग्र जोखिम',
    highRisk: 'उच्च जोखिम',
    mediumRisk: 'मध्यम जोखिम',
    lowRisk: 'कम जोखिम',
    whyRisky: 'यह जोखिम भरा क्यों है',
    whatToAsk: 'मकान मालिक से क्या मांगें',
    missingTitle: 'आपके समझौते में गैर-मौजूद',
    droppedNotice: (count) => `${count} असत्यापित ${count === 1 ? 'शर्त हटाई गई' : 'शर्तें हटाई गईं'}।`,
    errorEmpty: 'कृपया विश्लेषण के लिए समझौता टेक्स्ट पेस्ट करें।',
    errorTooLong: 'समझौता टेक्स्ट 15,000 अक्षरों की सीमा से अधिक है।',
    disclaimer: 'यह कानूनी सलाह नहीं है। आपका दस्तावेज़ कभी भी संग्रहीत नहीं किया जाता है।'
  }
};

export default function App() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLES[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const t = I18N[language] || I18N.en;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleSelectSample = (sampleId) => {
    setSelectedSampleId(sampleId);
    const chosen = SAMPLES.find((s) => s.id === sampleId);
    if (chosen) {
      setText(chosen.content);
      setError(null);
    }
  };

  const handleLoadSample = () => {
    const chosen = SAMPLES.find((s) => s.id === selectedSampleId) || SAMPLES[0];
    if (chosen) {
      setText(chosen.content);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError(t.errorEmpty);
      return;
    }
    if (text.length > 15000) {
      setError(t.errorTooLong);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'The analysis failed. Check your connection and try again.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'The analysis failed. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLabel = (level) => {
    const normalized = (level || '').toLowerCase();
    if (normalized === 'high') return t.highRisk;
    if (normalized === 'medium') return t.mediumRisk;
    return t.lowRisk;
  };

  const getRiskClass = (level) => {
    const normalized = (level || '').toLowerCase();
    if (normalized === 'high') return 'risk-high';
    if (normalized === 'medium') return 'risk-medium';
    return 'risk-low';
  };

  const getBorderRiskClass = (level) => {
    const normalized = (level || '').toLowerCase();
    if (normalized === 'high') return 'border-risk-high';
    if (normalized === 'medium') return 'border-risk-medium';
    return 'border-risk-low';
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">{t.title}</h1>
        <p className="app-desc">{t.subtitle}</p>
      </header>

      {/* Input Panel */}
      <section className="input-panel" aria-label="Agreement Input Form">
        <textarea
          className="agreement-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          aria-label="Rental agreement text"
        />

        <div className="char-counter-row">
          <span className={`char-counter ${text.length > 15000 ? 'char-limit-exceeded' : ''}`}>
            {text.length.toLocaleString()} / {t.charLimit}
          </span>
        </div>

        <div className="action-bar">
          <div className="lang-toggle" role="group" aria-label="Language selector">
            <button
              type="button"
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button
              type="button"
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिन्दी
            </button>
          </div>

          <div className="action-buttons">
            <select
              className="sample-select"
              value={selectedSampleId}
              onChange={(e) => handleSelectSample(e.target.value)}
              disabled={loading}
              aria-label="Select sample agreement"
            >
              {SAMPLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'hi' ? s.nameHi : s.nameEn}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLoadSample}
              disabled={loading}
            >
              {t.loadSample}
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={loading || text.trim().length === 0}
            >
              {loading && <span className="spinner" aria-hidden="true" />}
              <span>{loading ? t.analyzing : t.analyze}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="error-banner fade-in" role="alert">
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {result ? (
        <main className="fade-in">
          {/* Summary Card */}
          <div className="results-header">
            <div className={`risk-badge ${getRiskClass(result.overall_risk)}`}>
              <span className="risk-dot" aria-hidden="true" />
              <span>{getRiskLabel(result.overall_risk)}</span>
            </div>
            {result.summary && (
              <p className="results-summary-text">{result.summary}</p>
            )}
          </div>

          {/* Dropped items note */}
          {result.droppedCount > 0 && (
            <div className="notice-dropped" role="status">
              <svg className="notice-icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 1a7 7 0 1 0 7 7A7.008 7.008 0 0 0 8 1zm0 12.5A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5zM7.25 4.5h1.5v1.5h-1.5zm0 3h1.5v4h-1.5z" />
              </svg>
              <span>{t.droppedNotice(result.droppedCount)}</span>
            </div>
          )}

          {/* Flag Cards */}
          {Array.isArray(result.flags) && result.flags.map((flag, idx) => (
            <article key={idx} className={`flag-card ${getBorderRiskClass(result.overall_risk)}`}>
              <h3 className="flag-category">{flag.category || 'Clause'}</h3>

              {flag.quote && (
                <div className="quote-block">
                  "{flag.quote}"
                </div>
              )}

              {flag.why_risky && (
                <>
                  <div className="flag-section-label">{t.whyRisky}</div>
                  <p className="flag-section-text">{flag.why_risky}</p>
                </>
              )}

              {flag.what_to_ask && (
                <>
                  <div className="flag-section-label">{t.whatToAsk}</div>
                  <p className="flag-section-text">{flag.what_to_ask}</p>
                </>
              )}
            </article>
          ))}

          {/* Missing items */}
          {Array.isArray(result.missing) && result.missing.length > 0 && (
            <section className="missing-card">
              <h2 className="missing-title">{t.missingTitle}</h2>
              <ul className="missing-list">
                {result.missing.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </main>
      ) : (
        !error && (
          <div className="empty-state">
            {t.emptyState}
          </div>
        )
      )}

      {/* Footer */}
      <footer className="footer">
        {t.disclaimer}
      </footer>
    </div>
  );
}
