import React, { useState } from 'react';

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  language = 'en',
}) {
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = tempKey.trim();
    onSaveApiKey(trimmed);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    onSaveApiKey('');
    setTempKey('');
    onClose();
  };

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="api-key-modal scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="api-modal-header">
          <div className="api-header-title-group">
            <span className="api-icon">🔑</span>
            <div>
              <h2 className="api-modal-title">
                {language === 'hi'
                  ? 'अपनी Google Gemini API कुंजी जोड़ें'
                  : 'Bring Your Own API Key (BYOK)'}
              </h2>
              <p className="api-modal-subtitle">
                {language === 'hi'
                  ? 'अनुबंध विश्लेषण के लिए अपनी स्वयं की नि:शुल्क जेमिनी कुंजी का उपयोग करें।'
                  : 'Power real-time contract audits securely using your personal Google Gemini API key.'}
              </p>
            </div>
          </div>
          <button type="button" className="config-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="api-modal-body">
          {/* Privacy & Free Key Notice */}
          <div className="api-notice-box">
            <div className="api-notice-row">
              <span className="notice-icon">🔒</span>
              <div className="notice-text">
                <strong>{language === 'hi' ? 'शून्य डेटा भंडारण:' : 'Client-Side Only & 100% Free:'}</strong>{' '}
                {language === 'hi'
                  ? 'आपकी एपीआई कुंजी केवल आपके ब्राउज़र के लोकल स्टोरेज में सुरक्षित रहती है। इसे किसी बाहरी सर्वर पर कभी संग्रहीत नहीं किया जाता।'
                  : 'Your API key is saved strictly in your browser local storage. It is never logged or stored on any server.'}
              </div>
            </div>

            <div className="api-get-link-row">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-get-gemini-key"
              >
                ⚡ {language === 'hi' ? 'Google AI Studio से मुफ्त कुंजी प्राप्त करें ↗' : 'Get a Free Gemini Key at Google AI Studio ↗'}
              </a>
            </div>
          </div>

          {/* Key Input Field */}
          <div className="api-input-group">
            <label htmlFor="gemini-key-input" className="api-input-label">
              {language === 'hi' ? 'Google Gemini API कुंजी' : 'Google Gemini API Key'}
            </label>
            <div className="api-input-wrapper">
              <input
                id="gemini-key-input"
                type={showKey ? 'text' : 'password'}
                className="api-key-input"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                className="btn-toggle-key-visibility"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <span className="api-input-hint">
              {language === 'hi'
                ? 'यह कुंजी सीधे जेमिनी मॉडल से विश्लेषण कराने हेतु उपयोग की जाएगी।'
                : 'Supports Google Gemini & Gemma models via Google AI Studio.'}
            </span>
          </div>

          {apiKey && (
            <div className="api-status-active">
              <span className="active-dot" />
              <span>
                {language === 'hi'
                  ? 'सक्रिय कुंजी कॉन्फ़िगर की गई है (...' + apiKey.slice(-6) + ')'
                  : 'Active API key configured (...' + apiKey.slice(-6) + ')'}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="api-modal-footer">
          {apiKey ? (
            <button type="button" className="btn btn-secondary btn-sm btn-clear-key" onClick={handleClear}>
              🗑️ {language === 'hi' ? 'कुंजी हटाएं' : 'Remove Key'}
            </button>
          ) : (
            <span />
          )}

          <div className="modal-footer-right">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="button"
              className={`btn btn-primary ${savedSuccess ? 'copy-success-btn' : ''}`}
              onClick={handleSave}
              disabled={!tempKey.trim()}
            >
              {savedSuccess
                ? language === 'hi'
                  ? '✓ सहेजा गया!'
                  : '✓ Saved!'
                : language === 'hi'
                ? 'सहेजें व लागू करें'
                : 'Save & Use Key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
