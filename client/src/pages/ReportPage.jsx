import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAnalysisContext } from '../context/AnalysisContext';
import { SAMPLES } from '../samples';
import DocumentViewer from '../components/DocumentViewer';
import NegotiationCard from '../components/NegotiationCard';
import RiskScoreGauge from '../components/RiskScoreGauge';
import RiskConfigModal from '../components/RiskConfigModal';
import NegotiationExportModal from '../components/NegotiationExportModal';
import MissingClausesSection from '../components/MissingClausesSection';
import { classifyCategory } from '../services/riskEngine';

const AUDIT_PIPELINE = [
  {
    id: 'structure',
    titleEn: 'Maharashtra Lease & Parties Structure',
    titleHi: 'महाराष्ट्र लीज एवं पक्षकारों की संरचना',
    descEn: 'Validating Licensor & Licensee covenants, premises address, and term dates.',
    descHi: 'लाइसेंसर और लाइसेंसी शर्तों, परिसर के पते और अवधि की जांच।',
    doneSec: 3,
  },
  {
    id: 'lockin',
    titleEn: 'Lock-in Period & Early Exit Penalties',
    titleHi: 'लॉक-इन अवधि और समय पूर्व समाप्ति जुर्माना',
    descEn: 'Inspecting mandatory lock-in duration, exit penalties, and rent forfeiture traps.',
    descHi: 'अनिवार्य लॉक-इन अवधि, समय पूर्व निकास शुल्क और किराया जब्ती की जांच।',
    doneSec: 6,
  },
  {
    id: 'deposit',
    titleEn: 'Security Deposit Refund Deadlines',
    titleHi: 'सुरक्षा जमा राशि वापसी की समय सीमा',
    descEn: 'Evaluating refund timeline versus arbitrary "owner satisfaction" conditions.',
    descHi: 'रिफंड की समय सीमा और "मालिक की संतुष्टि" जैसी गैर-परक्राम्य शर्तों की जांच।',
    doneSec: 9,
  },
  {
    id: 'entry',
    titleEn: 'Landlord Entry & Privacy Constraints',
    titleHi: 'मालिक के प्रवेश अधिकार और गोपनीयता सीमाएं',
    descEn: 'Auditing 24h prior written notice requirement vs unrestricted anytime entry.',
    descHi: '24 घंटे पूर्व लिखित सूचना की आवश्यकता बनाम बिना सूचना प्रवेश की जांच।',
    doneSec: 12,
  },
  {
    id: 'escalation',
    titleEn: 'Rent Escalation & Maintenance Split',
    titleHi: 'किराया वृद्धि और मरम्मत जिम्मेदारियां',
    descEn: 'Analyzing annual escalation rates and shifting of major/structural repairs.',
    descHi: 'वार्षिक किराया वृद्धि दर और संरचनात्मक मरम्मत के खर्चों का विभाजन।',
    doneSec: 15,
  },
  {
    id: 'verification',
    titleEn: 'Verbatim Quote Verification & Hallucination Filter',
    titleHi: 'सटीक उद्धरण मिलान और सत्यापन',
    descEn: 'Strictly anchoring extracted clauses to source text; dropping unverified claims.',
    descHi: 'सटीक उद्धरणों का मूल पाठ से मिलान; असत्यापित दावों को स्वचालित रूप से हटाना।',
    doneSec: 999,
  },
];

function getStatusHeadline(seconds, lang) {
  if (lang === 'hi') {
    if (seconds < 3) return 'दस्तावेज़ की संरचना और लीज विवरण पढ़ा जा रहा है...';
    if (seconds < 7) return 'लॉक-इन अवधि, नोटिस और किराये के जुर्माने का विश्लेषण जारी है...';
    if (seconds < 11) return 'जमा राशि वापसी की समय सीमा और कटौती शर्तों की जांच हो रही है...';
    if (seconds < 15) return 'मालिक के प्रवेश अधिकार और मरम्मत शर्तों का कानूनी परीक्षण जारी है...';
    return 'सटीक उद्धरणों का मूल दस्तावेज़ से मिलान और सत्यापन पूरा किया जा रहा है...';
  }
  if (seconds < 3) return 'Ingesting Maharashtra lease structure & party covenants...';
  if (seconds < 7) return 'Auditing lock-in duration, notice periods, and exit penalties...';
  if (seconds < 11) return 'Evaluating security deposit refund timeline & deduction clauses...';
  if (seconds < 15) return 'Checking landlord entry rights, privacy limits, and repairs...';
  return 'Cross-verifying exact quotes against source text with Gemini engine...';
}

function StudioLoadingState({ elapsedSeconds, language, onCancel }) {
  const currentMessage = getStatusHeadline(elapsedSeconds, language);

  return (
    <div className="studio-loading-engine fade-in" aria-live="polite" aria-busy="true">
      <div className="loading-engine-card">
        <div className="loading-card-top">
          <div className="engine-status-badge">
            <span className="engine-pulse-dot" />
            <span>{language === 'hi' ? 'AI क्लॉज़ इंस्पेक्टर सक्रिय' : 'AI CLAUSE INSPECTOR ACTIVE'}</span>
          </div>
          <span className="engine-timer">
            ⏱ {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:{String(elapsedSeconds % 60).padStart(2, '0')}s
          </span>
        </div>

        <h3 className="loading-engine-headline">{currentMessage}</h3>

        <div className="loading-progress-track">
          <div className="loading-progress-bar" />
        </div>
      </div>

      <div className="pipeline-card">
        <div className="pipeline-header">
          <span className="pipeline-title">
            ⚡ {language === 'hi' ? 'लाइव सत्यापन पाइपलाइन' : 'Live Verification Pipeline'}
          </span>
          <span className="pipeline-subtitle">
            {language === 'hi' ? '6 प्रमुख बिंदु परीक्षण' : '6 Legal Checkpoints'}
          </span>
        </div>

        <div className="pipeline-steps-list">
          {AUDIT_PIPELINE.map((stage, idx) => {
            const isDone = elapsedSeconds >= stage.doneSec;
            const isActive = !isDone && (idx === 0 || elapsedSeconds >= AUDIT_PIPELINE[idx - 1].doneSec);

            return (
              <div
                key={stage.id}
                className={`pipeline-step-item ${isDone ? 'step-completed' : ''} ${isActive ? 'step-active' : ''}`}
              >
                <div className="step-icon-wrap">
                  {isDone ? (
                    <span className="step-check" aria-hidden="true">✓</span>
                  ) : isActive ? (
                    <span className="step-spinner" aria-hidden="true" />
                  ) : (
                    <span className="step-bullet" aria-hidden="true" />
                  )}
                </div>

                <div className="step-body">
                  <div className="step-title-row">
                    <span className="step-name">
                      {language === 'hi' ? stage.titleHi : stage.titleEn}
                    </span>
                    <span className="step-state-tag">
                      {isDone
                        ? (language === 'hi' ? 'पूर्ण' : 'Passed')
                        : isActive
                        ? (language === 'hi' ? 'विश्लेषण...' : 'Auditing...')
                        : (language === 'hi' ? 'कतार में' : 'Queued')}
                    </span>
                  </div>
                  <p className="step-desc">
                    {language === 'hi' ? stage.descHi : stage.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="loading-footer-row">
        <span className="loading-trust-tag">
          🔒 {language === 'hi' ? 'गूगल जेमिनी इंजन • शून्य दस्तावेज़ भंडारण' : 'Google Gemini Minimal-Thinking Engine • Zero Storage'}
        </span>

        {elapsedSeconds >= 10 && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
            {language === 'hi' ? 'रद्द करें' : 'Cancel Audit'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReportPage() {
  const {
    text,
    language,
    status,
    result,
    error,
    elapsedSeconds,
    selectedSampleId,
    loadAndAnalyzeSample,
    analyze,
    cancel,
    // Risk Engine
    riskConfig,
    setRiskConfig,
    riskMetrics,
    isConfigModalOpen,
    setIsConfigModalOpen,
    // Negotiation States
    negotiationStates,
    updateNegotiationState,
    customClauses,
    updateCustomClause,
    isExportModalOpen,
    setIsExportModalOpen,
  } = useAnalysisContext();

  const navigate = useNavigate();
  const [clauseFilter, setClauseFilter] = useState('all');

  React.useEffect(() => {
    if (!text && SAMPLES.length > 0) {
      loadAndAnalyzeSample(SAMPLES[0].id);
    }
  }, [text, loadAndAnalyzeSample]);

  const flags = useMemo(() => (Array.isArray(result?.flags) ? result.flags : []), [result]);

  const filteredFlags = useMemo(() => {
    return flags.filter((flag, idx) => {
      const state = negotiationStates[idx] || 'pending';
      if (clauseFilter === 'all') return true;
      if (clauseFilter === 'dealbreaker') return state === 'dealbreaker';
      if (clauseFilter === 'pending') return state === 'pending' || state === 'dealbreaker';
      if (clauseFilter === 'negotiated') return state === 'negotiated' || state === 'waived';
      if (clauseFilter === 'financial') {
        const cat = classifyCategory(flag.category, flag.quote, flag.why_risky);
        return cat === 'financial';
      }
      if (clauseFilter === 'lockin') {
        const cat = classifyCategory(flag.category, flag.quote, flag.why_risky);
        return cat === 'lockin';
      }
      return true;
    });
  }, [flags, clauseFilter, negotiationStates]);

  const negotiatedCount = useMemo(() => {
    return Object.values(negotiationStates).filter(
      (s) => s === 'negotiated' || s === 'waived'
    ).length;
  }, [negotiationStates]);

  const dealbreakerCount = useMemo(() => {
    return Object.values(negotiationStates).filter((s) => s === 'dealbreaker').length;
  }, [negotiationStates]);

  const getRiskBadgeClass = (level) => {
    switch (level) {
      case 'critical':
      case 'high':
        return 'risk-high';
      case 'medium':
        return 'risk-medium';
      case 'low':
      default:
        return 'risk-low';
    }
  };

  return (
    <div className="studio-page-wrap">
      {/* Studio Top Control Bar */}
      <div className="studio-topbar">
        <div className="studio-topbar-inner">
          <div className="studio-topbar-left">
            <Link to="/" className="back-link-btn" title="Back to Homepage">
              ← {language === 'hi' ? 'होम' : 'Home'}
            </Link>

            <div className="agreement-switcher-wrap">
              <label htmlFor="studio-agreement-select" className="switcher-label">
                {language === 'hi' ? 'सक्रिय समझौता:' : 'Active Agreement:'}
              </label>
              <select
                id="studio-agreement-select"
                className="studio-agreement-select"
                value={selectedSampleId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom_paste') {
                    navigate('/');
                  } else {
                    loadAndAnalyzeSample(val);
                  }
                }}
                disabled={status === 'loading'}
              >
                {SAMPLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {language === 'hi' ? s.nameHi : s.nameEn}
                  </option>
                ))}
                <option value="custom_paste">
                  ✏️ {language === 'hi' ? 'नया समझौता पेस्ट करें (होम)...' : 'Paste / Edit Custom Text (Home)...'}
                </option>
              </select>
            </div>

            {status !== 'loading' && (
              <button
                type="button"
                className="btn btn-secondary btn-sm re-analyze-btn"
                onClick={() => analyze(text, language)}
                title="Re-run AI Analysis"
              >
                🔄 {language === 'hi' ? 'पुनः जांचें' : 'Re-Audit'}
              </button>
            )}
          </div>

          <div className="studio-topbar-actions">
            {status === 'success' && result && (
              <>
                <div
                  className={`risk-badge ${getRiskBadgeClass(riskMetrics.riskLevel)} cursor-pointer`}
                  onClick={() => setIsConfigModalOpen(true)}
                  title="Click to view & configure risk calculation model"
                >
                  <span className="risk-dot" aria-hidden="true" />
                  <span>
                    {language === 'hi' ? 'जोखिम सूचकांक:' : 'Risk Index:'}{' '}
                    <strong>{riskMetrics.currentScore}/100</strong> ({riskMetrics.grade})
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsConfigModalOpen(true)}
                  title="Configure severity points, category multipliers, and risk thresholds"
                >
                  ⚙️ {language === 'hi' ? 'मॉडल सेटिंग्स' : 'Configure Model'}
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm export-hub-btn"
                  onClick={() => setIsExportModalOpen(true)}
                >
                  📜 {language === 'hi' ? 'बातचीत पैकेट तैयार करें' : 'Negotiation Packet'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="studio-content-container">
        <div className="studio-split-grid">
          <div className="studio-left-pane">
            <DocumentViewer flags={result?.flags || []} />
          </div>

          <div className="studio-right-pane">
            {/* 1. LOADING STATE */}
            {status === 'loading' && (
              <StudioLoadingState
                elapsedSeconds={elapsedSeconds}
                language={language}
                onCancel={cancel}
              />
            )}

            {/* 2. ERROR STATE */}
            {status === 'error' && error && (
              <div className="error-box fade-in" role="alert">
                <div className="error-message">{error.message}</div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => analyze(text, language)}
                  style={{ marginTop: '12px' }}
                >
                  {language === 'hi' ? 'पुनः प्रयास करें' : 'Try again'}
                </button>
              </div>
            )}

            {/* 3. CANCELLED STATE */}
            {status === 'cancelled' && (
              <div className="cancelled-box fade-in" role="status">
                <p>{language === 'hi' ? 'विश्लेषण रद्द कर दिया गया।' : 'Analysis cancelled.'}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => analyze(text, language)}
                  style={{ marginTop: '12px' }}
                >
                  {language === 'hi' ? 'फिर से शुरू करें' : 'Restart Analysis'}
                </button>
              </div>
            )}

            {/* 4. IDLE STATE */}
            {status === 'idle' && (
              <div className="studio-idle-card fade-in">
                <h3 className="idle-card-title">
                  {language === 'hi' ? 'निरीक्षण के लिए तैयार' : 'Ready to Inspect'}
                </h3>
                <p className="idle-card-text">
                  {language === 'hi'
                    ? 'बाईं ओर लोड किए गए समझौते का विश्लेषण करने के लिए बटन पर क्लिक करें।'
                    : 'Click below to run a deep clause audit on the document loaded on the left.'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary run-audit-btn"
                  onClick={() => analyze(text, language)}
                >
                  ⚡ {language === 'hi' ? 'निरीक्षण शुरू करें' : 'Start AI Inspection'}
                </button>
              </div>
            )}

            {/* 5. SUCCESS STATE */}
            {status === 'success' && result && (
              <div className="studio-success-feed fade-in">
                <RiskScoreGauge
                  metrics={riskMetrics}
                  language={language}
                  onOpenConfig={() => setIsConfigModalOpen(true)}
                  showCategoryBreakdown={true}
                />

                <div className="studio-verdict-card">
                  <div className="verdict-header">
                    <span className="verdict-label">
                      {language === 'hi' ? 'कानूनी ऑडिट निष्कर्ष' : 'Legal Audit Verdict'}
                    </span>
                    <span className="flags-count-tag">
                      {flags.length} {language === 'hi' ? 'शर्तें चिह्नित' : 'Clauses Flagged'}
                    </span>
                  </div>
                  {result.summary && (
                    <p className="verdict-summary-text">{result.summary}</p>
                  )}
                </div>

                {result.droppedCount > 0 && (
                  <div className="notice-dropped" role="status">
                    <span className="notice-icon" aria-hidden="true">ℹ️</span>
                    <span>
                      {result.droppedCount}{' '}
                      {language === 'hi'
                        ? 'असत्यापित शर्तें हटाई गईं क्योंकि वे मूल पाठ से मेल नहीं खाती थीं।'
                        : 'unverified items removed because they were not found in the original document.'}
                    </span>
                  </div>
                )}

                <div className="negotiation-toolbar-card">
                  <div className="neg-toolbar-top">
                    <div className="neg-toolbar-title-group">
                      <span className="neg-toolbar-icon">⚖️</span>
                      <div>
                        <h4 className="neg-toolbar-title">
                          {language === 'hi' ? 'इंटरैक्टिव अनुबंध बातचीत व क्लॉज़ संशोधन' : 'Interactive Negotiation & Redlining Workspace'}
                        </h4>
                        <p className="neg-toolbar-desc">
                          {language === 'hi'
                            ? 'शर्तों की स्थिति बदलें या कानूनी संशोधन संपादित करें। आपका जोखिम स्कोर तुरंत घटेगा।'
                            : 'Mark clauses as agreed or customize counter-offers to dynamically lower your risk score.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm generate-packet-btn"
                      onClick={() => setIsExportModalOpen(true)}
                    >
                      📜 {language === 'hi' ? 'पैकेट बनाएं (ईमेल/व्हाट्सएप/Addendum)' : 'Export Counter-Proposals'}
                    </button>
                  </div>

                  <div className="neg-filter-tabs">
                    <button
                      type="button"
                      className={`neg-tab-btn ${clauseFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setClauseFilter('all')}
                    >
                      {language === 'hi' ? 'सभी शर्तें' : 'All Clauses'} ({flags.length})
                    </button>
                    <button
                      type="button"
                      className={`neg-tab-btn ${clauseFilter === 'pending' ? 'active' : ''}`}
                      onClick={() => setClauseFilter('pending')}
                    >
                      🔴 {language === 'hi' ? 'बातचीत हेतु' : 'To Negotiate'} ({flags.length - negotiatedCount})
                    </button>
                    {dealbreakerCount > 0 && (
                      <button
                        type="button"
                        className={`neg-tab-btn dealbreaker-tab ${clauseFilter === 'dealbreaker' ? 'active' : ''}`}
                        onClick={() => setClauseFilter('dealbreaker')}
                      >
                        ⚠️ {language === 'hi' ? 'अनिवार्य शर्तें' : 'Dealbreakers'} ({dealbreakerCount})
                      </button>
                    )}
                    <button
                      type="button"
                      className={`neg-tab-btn ${clauseFilter === 'negotiated' ? 'active' : ''}`}
                      onClick={() => setClauseFilter('negotiated')}
                    >
                      ✓ {language === 'hi' ? 'सुलझाई गई' : 'Resolved'} ({negotiatedCount})
                    </button>
                    <button
                      type="button"
                      className={`neg-tab-btn ${clauseFilter === 'financial' ? 'active' : ''}`}
                      onClick={() => setClauseFilter('financial')}
                    >
                      💰 {language === 'hi' ? 'वित्तीय' : 'Financial'}
                    </button>
                    <button
                      type="button"
                      className={`neg-tab-btn ${clauseFilter === 'lockin' ? 'active' : ''}`}
                      onClick={() => setClauseFilter('lockin')}
                    >
                      🔒 {language === 'hi' ? 'लॉक-इन' : 'Lock-in'}
                    </button>
                  </div>
                </div>

                <div className="flags-feed">
                  {filteredFlags.length === 0 ? (
                    <div className="empty-filter-state">
                      <p>
                        {language === 'hi'
                          ? 'इस फ़िल्टर में कोई क्लॉज़ नहीं है।'
                          : 'No clauses match the selected negotiation filter.'}
                      </p>
                    </div>
                  ) : (
                    filteredFlags.map((flag) => {
                      const originalIdx = flags.indexOf(flag);
                      return (
                        <NegotiationCard
                          key={originalIdx}
                          index={originalIdx}
                          flag={flag}
                          negotiationState={negotiationStates[originalIdx] || 'pending'}
                          onUpdateState={updateNegotiationState}
                          customClause={customClauses[originalIdx]}
                          onUpdateCustomClause={updateCustomClause}
                          language={language}
                        />
                      );
                    })
                  )}
                </div>

                {Array.isArray(result.missing) && result.missing.length > 0 && (
                  <MissingClausesSection
                    missing={result.missing}
                    language={language}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <RiskConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={riskConfig}
        onSaveConfig={setRiskConfig}
        currentResult={result}
        language={language}
      />

      <NegotiationExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        result={result}
        metrics={riskMetrics}
        negotiationStates={negotiationStates}
        customClauses={customClauses}
        language={language}
      />
    </div>
  );
}
