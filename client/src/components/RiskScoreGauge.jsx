import React from 'react';

export default function RiskScoreGauge({
  metrics,
  language = 'en',
  onOpenConfig,
  showCategoryBreakdown = true,
}) {
  const {
    baseScore = 0,
    currentScore = 0,
    projectedScore = 0,
    pointsReduced = 0,
    percentReduced = 0,
    riskLevel = 'low',
    grade = 'A',
    categoryBreakdown = [],
  } = metrics || {};

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return '#B91C1C';
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#D97706';
      case 'low':
      default:
        return '#059669';
    }
  };

  const getLevelLabel = (level) => {
    if (language === 'hi') {
      switch (level) {
        case 'critical':
          return 'गंभीर / खतरनाक जोखिम';
        case 'high':
          return 'उच्च जोखिम';
        case 'medium':
          return 'मध्यम जोखिम';
        case 'low':
        default:
          return 'सुरक्षित / कम जोखिम';
      }
    }
    switch (level) {
      case 'critical':
        return 'Critical Danger';
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Moderate Risk';
      case 'low':
      default:
        return 'Low Risk / Tenant-Favorable';
    }
  };

  const activeColor = getLevelColor(riskLevel);

  const radius = 62;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, currentScore))) / 100;

  return (
    <div className="risk-score-dashboard-card fade-in">
      <div className="risk-dashboard-header">
        <div className="risk-title-group">
          <span className="risk-engine-badge">
            <span className="engine-pulse-dot" style={{ backgroundColor: activeColor }} />
            {language === 'hi' ? 'डायनेमिक जोखिम स्कोर इंजन' : 'DYNAMIC RISK INDEX'}
          </span>
          <h3 className="risk-main-title">
            {language === 'hi' ? 'कानूनी अनुबंध जोखिम विश्लेषण' : 'Contract Risk & Negotiation Index'}
          </h3>
        </div>

        <button
          type="button"
          className="btn-configure-risk"
          onClick={onOpenConfig}
          title={language === 'hi' ? 'जोखिम मॉडल को कॉन्फ़िगर करें' : 'Configure Risk Scoring Model'}
        >
          ⚙️ <span>{language === 'hi' ? 'स्कोर मॉडल कॉन्फ़िगर करें' : 'Configure Model'}</span>
        </button>
      </div>

      <div className="risk-dashboard-grid">
        {/* Left: Dynamic Meter & Grade */}
        <div className="gauge-metric-container">
          <div className="gauge-visual-wrap">
            <svg className="risk-meter-svg" viewBox="0 0 160 160">
              <circle
                className="risk-meter-track"
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#E2E8F0"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={0}
                transform="rotate(150 80 80)"
                strokeLinecap="round"
              />
              <circle
                className="risk-meter-fill"
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={activeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(150 80 80)"
                strokeLinecap="round"
              />
            </svg>

            <div className="gauge-center-content">
              <span className="gauge-score-value" style={{ color: activeColor }}>
                {currentScore}
              </span>
              <span className="gauge-score-max">/ 100</span>
              <span className="gauge-grade-badge" style={{ backgroundColor: `${activeColor}15`, color: activeColor }}>
                {language === 'hi' ? `ग्रेड ${grade}` : `Grade ${grade}`}
              </span>
            </div>
          </div>

          <div className="gauge-status-block">
            <div className="gauge-verdict-title" style={{ color: activeColor }}>
              {getLevelLabel(riskLevel)}
            </div>
            <p className="gauge-verdict-desc">
              {language === 'hi'
                ? currentScore > 60
                  ? 'इस समझौते में ऐसे कई क्लॉज़ हैं जो किरायेदार के खिलाफ एकतरफा हैं। बातचीत अत्यंत आवश्यक है।'
                  : currentScore > 30
                  ? 'समझौते में कुछ मध्यम जोखिम हैं। सुरक्षा जमा और नोटिस पर स्पष्टीकरण मांगें।'
                  : 'यह समझौता काफी हद तक संतुलित और किरायेदार-हितैषी प्रतीत होता है।'
                : currentScore > 60
                ? 'Contains predatory or heavily one-sided clauses. Substantial counter-negotiation is recommended.'
                : currentScore > 30
                ? 'Standard tenancy document with a few moderate concerns. Request clarification on refund and repairs.'
                : 'Balanced, market-standard terms with adequate tenant protections.'}
            </p>
          </div>
        </div>

        {/* Right: Negotiation Projection & Category Exposure */}
        <div className="risk-exposure-container">
          <div className="negotiation-leverage-banner">
            <div className="leverage-top">
              <span className="leverage-tag">
                🎯 {language === 'hi' ? 'बातचीत का अनुमानित प्रभाव' : 'Projected Post-Negotiation Score'}
              </span>
              {pointsReduced > 0 && (
                <span className="leverage-reduction-pill">
                  📉 {pointsReduced} {language === 'hi' ? 'अंक घटाए गए' : 'pts reduced'} ({percentReduced}%)
                </span>
              )}
            </div>

            <div className="leverage-projection-row">
              <div className="projection-stat-box">
                <span className="proj-label">{language === 'hi' ? 'मूल जोखिम' : 'Original Risk'}</span>
                <span className="proj-val text-muted">{baseScore}</span>
              </div>
              <span className="proj-arrow">➔</span>
              <div className="projection-stat-box">
                <span className="proj-label">{language === 'hi' ? 'सक्रिय जोखिम' : 'Current Active'}</span>
                <span className="proj-val" style={{ color: activeColor }}>{currentScore}</span>
              </div>
              <span className="proj-arrow">➔</span>
              <div className="projection-stat-box highlight-box">
                <span className="proj-label">{language === 'hi' ? 'प्रस्ताव के बाद' : 'Target Target'}</span>
                <span className="proj-val text-success">{projectedScore}</span>
              </div>
            </div>

            <p className="leverage-hint">
              💡 {language === 'hi'
                ? 'जैसे ही आप नीचे दिए गए सुझावों के अनुसार मकान मालिक से बात करके शर्तों को ठीक करते हैं, आपका जोखिम स्कोर अपने आप कम हो जाता है।'
                : 'As you check off or adjust clauses in the negotiation panel below, your dynamic contract risk drops in real-time.'}
            </p>
          </div>

          {showCategoryBreakdown && categoryBreakdown.length > 0 && (
            <div className="category-bars-grid">
              <div className="category-bars-header">
                <span className="cat-header-title">
                  {language === 'hi' ? 'श्रेणीवार जोखिम विभाजन' : 'Category Risk Exposure'}
                </span>
                <span className="cat-header-sub">
                  {language === 'hi' ? '6 प्रमुख कानूनी आयाम' : '6 Core Legal Dimensions'}
                </span>
              </div>

              <div className="category-bars-list">
                {categoryBreakdown.map((cat) => {
                  const barColor =
                    cat.score > 65 ? '#DC2626' : cat.score > 35 ? '#D97706' : '#059669';
                  return (
                    <div key={cat.id} className="category-bar-row">
                      <div className="cat-label-row">
                        <span className="cat-name">
                          <span className="cat-icon">{cat.icon}</span>
                          <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
                        </span>
                        <div className="cat-stat-group">
                          {cat.flagCount > 0 && (
                            <span className="cat-flag-badge">
                              {cat.flagCount} {language === 'hi' ? 'शर्तें' : 'clauses'}
                            </span>
                          )}
                          <span className="cat-score-num" style={{ color: barColor }}>
                            {cat.score}%
                          </span>
                        </div>
                      </div>
                      <div className="cat-bar-track">
                        <div
                          className="cat-bar-fill"
                          style={{
                            width: `${Math.max(4, Math.min(100, cat.score))}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
