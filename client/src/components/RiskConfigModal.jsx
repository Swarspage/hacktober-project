import React, { useState } from 'react';
import { DEFAULT_PRESETS, calculateRiskMetrics } from '../services/riskEngine';

export default function RiskConfigModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  currentResult,
  language = 'en',
}) {
  const [activePreset, setActivePreset] = useState(config?.id || 'balanced');
  const [tempConfig, setTempConfig] = useState({ ...(config || DEFAULT_PRESETS.balanced) });

  if (!isOpen) return null;

  const handleSelectPreset = (presetKey) => {
    setActivePreset(presetKey);
    if (presetKey !== 'custom' && DEFAULT_PRESETS[presetKey]) {
      setTempConfig({
        ...DEFAULT_PRESETS[presetKey],
      });
    }
  };

  const handleSeverityChange = (severity, value) => {
    setActivePreset('custom');
    setTempConfig((prev) => ({
      ...prev,
      id: 'custom',
      severityWeights: {
        ...prev.severityWeights,
        [severity]: Number(value),
      },
    }));
  };

  const handleMultiplierChange = (category, value) => {
    setActivePreset('custom');
    setTempConfig((prev) => ({
      ...prev,
      id: 'custom',
      categoryMultipliers: {
        ...prev.categoryMultipliers,
        [category]: Number(value),
      },
    }));
  };

  const handleThresholdChange = (key, value) => {
    setActivePreset('custom');
    setTempConfig((prev) => ({
      ...prev,
      id: 'custom',
      thresholds: {
        ...prev.thresholds,
        [key]: Number(value),
      },
    }));
  };

  const handleReset = () => {
    setActivePreset('balanced');
    setTempConfig({ ...DEFAULT_PRESETS.balanced });
  };

  const handleSave = () => {
    onSaveConfig(tempConfig);
    onClose();
  };

  const previewMetrics = currentResult ? calculateRiskMetrics(currentResult, tempConfig) : null;

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="risk-config-modal scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="config-modal-header">
          <div className="config-header-title-row">
            <span className="config-gear-icon">⚙️</span>
            <div>
              <h2 className="config-modal-title">
                {language === 'hi' ? 'जोखिम स्कोर गणना इंजन कॉन्फ़िगरेशन' : 'Configure Dynamic Risk Scoring Engine'}
              </h2>
              <p className="config-modal-subtitle">
                {language === 'hi'
                  ? 'अपनी प्राथमिकताओं के अनुसार क्लॉज़ के वजन, श्रेणी गुणक और जोखिम सीमाओं को कस्टमाइज़ करें।'
                  : 'Customize severity penalties, category sensitivity multipliers, and risk classification thresholds.'}
              </p>
            </div>
          </div>
          <button type="button" className="config-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {previewMetrics && (
          <div className="config-preview-banner">
            <span className="preview-label">
              ⚡ {language === 'hi' ? 'वर्तमान समझौते पर लाइव पूर्वावलोकन:' : 'Live Recalculated Score for Current Lease:'}
            </span>
            <div className="preview-score-pill">
              <span className="preview-score-num">{previewMetrics.currentScore} / 100</span>
              <span className={`preview-level-badge risk-${previewMetrics.riskLevel}`}>
                {previewMetrics.riskLevel.toUpperCase()} (Grade {previewMetrics.grade})
              </span>
            </div>
          </div>
        )}

        <div className="config-modal-body">
          <div className="config-section">
            <label className="config-section-label">
              {language === 'hi' ? '१. किरायेदार जोखिम प्रोफ़ाइल चुनें (प्रीसेट)' : '1. Choose Risk Sensitivity Profile (Presets)'}
            </label>
            <div className="presets-cards-grid">
              {Object.keys(DEFAULT_PRESETS).map((pKey) => {
                const preset = DEFAULT_PRESETS[pKey];
                const isSelected = activePreset === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    className={`preset-card-btn ${isSelected ? 'preset-card-active' : ''}`}
                    onClick={() => handleSelectPreset(pKey)}
                  >
                    <div className="preset-card-header">
                      <span className="preset-radio-indicator" />
                      <span className="preset-card-title">
                        {language === 'hi' ? preset.nameHi : preset.nameEn}
                      </span>
                    </div>
                    <p className="preset-card-desc">
                      {language === 'hi' ? preset.descriptionHi : preset.descriptionEn}
                    </p>
                  </button>
                );
              })}

              <button
                type="button"
                className={`preset-card-btn ${activePreset === 'custom' ? 'preset-card-active' : ''}`}
                onClick={() => setActivePreset('custom')}
              >
                <div className="preset-card-header">
                  <span className="preset-radio-indicator" />
                  <span className="preset-card-title">
                    🎛️ {language === 'hi' ? 'कस्टम (अपनी पसंद अनुसार)' : 'Custom Tuning'}
                  </span>
                </div>
                <p className="preset-card-desc">
                  {language === 'hi'
                    ? 'नीचे दिए गए स्लाइडर्स से अपने खुद के विशिष्ट नियम और वजन तय करें।'
                    : 'Fine-tune exact mathematical point weights and multipliers using the sliders below.'}
                </p>
              </button>
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <label className="config-section-label">
                {language === 'hi' ? '२. क्लॉज़ गंभीरता अंक (Severity Base Weights)' : '2. Clause Severity Penalty Points'}
              </label>
              <span className="config-section-tip">
                {language === 'hi' ? 'प्रत्येक प्रकार के क्लॉज़ के लिए काटे जाने वाले मूल अंक' : 'Base points deducted per flagged clause'}
              </span>
            </div>

            <div className="sliders-dual-grid">
              <div className="slider-item">
                <div className="slider-label-row">
                  <span className="slider-tag critical-tag">🔴 Critical Clause</span>
                  <span className="slider-val-num">{tempConfig.severityWeights?.critical} pts</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  step="1"
                  value={tempConfig.severityWeights?.critical || 28}
                  onChange={(e) => handleSeverityChange('critical', e.target.value)}
                  className="config-slider-range"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span className="slider-tag high-tag">🟠 High Risk Clause</span>
                  <span className="slider-val-num">{tempConfig.severityWeights?.high} pts</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  step="1"
                  value={tempConfig.severityWeights?.high || 18}
                  onChange={(e) => handleSeverityChange('high', e.target.value)}
                  className="config-slider-range"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span className="slider-tag medium-tag">🟡 Medium Risk Clause</span>
                  <span className="slider-val-num">{tempConfig.severityWeights?.medium} pts</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={tempConfig.severityWeights?.medium || 9}
                  onChange={(e) => handleSeverityChange('medium', e.target.value)}
                  className="config-slider-range"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span className="slider-tag low-tag">🟢 Low Risk / Caution</span>
                  <span className="slider-val-num">{tempConfig.severityWeights?.low} pts</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={tempConfig.severityWeights?.low || 4}
                  onChange={(e) => handleSeverityChange('low', e.target.value)}
                  className="config-slider-range"
                />
              </div>
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <label className="config-section-label">
                {language === 'hi' ? '३. श्रेणी संवेदनशीलता गुणक (Category Multipliers)' : '3. Category Sensitivity Multipliers'}
              </label>
              <span className="config-section-tip">
                {language === 'hi' ? 'विशिष्ट श्रेणियों को अधिक या कम प्राथमिकता दें' : 'Scale risks higher or lower depending on your priorities'}
              </span>
            </div>

            <div className="sliders-dual-grid">
              <div className="slider-item">
                <div className="slider-label-row">
                  <span>💰 Financial & Deposit</span>
                  <span className="slider-val-num">{(tempConfig.categoryMultipliers?.financial || 1.25).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={tempConfig.categoryMultipliers?.financial || 1.25}
                  onChange={(e) => handleMultiplierChange('financial', e.target.value)}
                  className="config-slider-range"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>🔒 Lock-in & Exit Penalties</span>
                  <span className="slider-val-num">{(tempConfig.categoryMultipliers?.lockin || 1.30).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={tempConfig.categoryMultipliers?.lockin || 1.30}
                  onChange={(e) => handleMultiplierChange('lockin', e.target.value)}
                  className="config-slider-range"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>🛠️ Structural Repairs</span>
                  <span className="slider-val-num">{(tempConfig.categoryMultipliers?.repairs || 1.15).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={tempConfig.categoryMultipliers?.repairs || 1.15}
                  onChange={(e) => handleMultiplierChange('repairs', e.target.value)}
                  className="config-slider-range"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>👁️ Privacy & Landlord Entry</span>
                  <span className="slider-val-num">{(tempConfig.categoryMultipliers?.privacy || 1.10).toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={tempConfig.categoryMultipliers?.privacy || 1.10}
                  onChange={(e) => handleMultiplierChange('privacy', e.target.value)}
                  className="config-slider-range"
                />
              </div>
            </div>
          </div>

          <div className="config-section">
            <div className="config-section-header">
              <label className="config-section-label">
                {language === 'hi' ? '४. वर्गीकरण सीमाएं (Risk Thresholds)' : '4. Risk Level Thresholds'}
              </label>
              <span className="config-section-tip">
                {language === 'hi' ? 'स्कोर किस स्तर पर उच्च या मध्यम माना जाएगा' : 'Score boundaries separating Low, Moderate, and High Risk'}
              </span>
            </div>

            <div className="sliders-dual-grid">
              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Low Risk Cutoff (0 to X)</span>
                  <span className="slider-val-num">{tempConfig.thresholds?.low || 28} pts</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="1"
                  value={tempConfig.thresholds?.low || 28}
                  onChange={(e) => handleThresholdChange('low', e.target.value)}
                  className="config-slider-range"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>Moderate Risk Cutoff (X to Y)</span>
                  <span className="slider-val-num">{tempConfig.thresholds?.medium || 58} pts</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="75"
                  step="1"
                  value={tempConfig.thresholds?.medium || 58}
                  onChange={(e) => handleThresholdChange('medium', e.target.value)}
                  className="config-slider-range"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="config-modal-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
            🔄 {language === 'hi' ? 'डिफ़ॉल्ट पर रीसेट करें' : 'Reset to Defaults'}
          </button>
          <div className="modal-footer-right">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              ✓ {language === 'hi' ? 'लागू करें व सहेजें' : 'Save & Apply Model'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
