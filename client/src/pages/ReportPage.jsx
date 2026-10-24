import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAnalysisContext } from '../context/AnalysisContext';
import { SAMPLES } from '../samples';
import DocumentViewer from '../components/DocumentViewer';
import FlagCard from '../components/FlagCard';

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
      {/* Live Engine Header Card */}
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

        {/* Animated Scanner Progress Bar */}
        <div className="loading-progress-track">
          <div className="loading-progress-bar" />
        </div>
      </div>

      {/* Live Verification Pipeline */}
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

      {/* Trust & Cancel Bar */}
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
    setText,
    language,
    status,
    result,
    error,
    elapsedSeconds,
    selectedSampleId,
    loadAndAnalyzeSample,
    analyze,
    cancel,
  } = useAnalysisContext();

  const navigate = useNavigate();
  const [copiedAll, setCopiedAll] = useState(false);

  // If text is completely empty on load, initialize with the default sample
  React.useEffect(() => {
    if (!text && SAMPLES.length > 0) {
      loadAndAnalyzeSample(SAMPLES[0].id);
    }
  }, [text, loadAndAnalyzeSample]);

  const handleCopyAllNegotiations = () => {
    if (!result?.flags || result.flags.length === 0) return;

    let emailDraft = `Dear Owner,\n\nRegarding the Leave and Licence agreement, I would like to request clarification and adjustments on the following clauses:\n\n`;

    result.flags.forEach((f, idx) => {
      emailDraft += `${idx + 1}. [${f.category || 'Clause'}]\n`;
      emailDraft += `Current text: "${f.quote}"\n`;
      emailDraft += `Requested adjustment: ${f.what_to_ask}\n\n`;
    });

    if (result.missing && result.missing.length > 0) {
      emailDraft += `Additionally, please clarify the following missing points:\n`;
      result.missing.forEach((m) => {
        emailDraft += `- ${m}\n`;
      });
      emailDraft += `\n`;
    }

    emailDraft += `Thank you for your understanding.\nBest regards,\nTenant`;

    navigator.clipboard.writeText(emailDraft);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const getRiskLabel = (level) => {
    const norm = (level || '').toLowerCase();
    if (norm === 'high') return language === 'hi' ? 'उच्च जोखिम' : 'High Risk';
    if (norm === 'medium') return language === 'hi' ? 'मध्यम जोखिम' : 'Medium Risk';
    return language === 'hi' ? 'कम जोखिम' : 'Low Risk';
  };

  const getRiskBadgeClass = (level) => {
    const norm = (level || '').toLowerCase();
    if (norm === 'high') return 'risk-high';
    if (norm === 'medium') return 'risk-medium';
    return 'risk-low';
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

            {/* In-Studio Agreement Switcher */}
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
                <div className={`risk-badge ${getRiskBadgeClass(result.overall_risk)}`}>
                  <span className="risk-dot" aria-hidden="true" />
                  <span>{getRiskLabel(result.overall_risk)}</span>
                </div>

                <button
                  type="button"
                  className={`btn btn-secondary btn-sm ${copiedAll ? 'copied-btn' : ''}`}
                  onClick={handleCopyAllNegotiations}
                >
                  {copiedAll ? '✓ Copied Email Draft' : '📋 Copy All Counter-Offers'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="studio-content-container">
        {/* Split Screen Layout: Left Document always visible, Right shows Loading or Results */}
        <div className="studio-split-grid">
          {/* Left Column: Interactive Document Viewer */}
          <div className="studio-left-pane">
            <DocumentViewer flags={result?.flags || []} />
          </div>

          {/* Right Column: Loading Engine or Results Audit */}
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

            {/* 4. IDLE STATE (If arrived with text but analysis not started) */}
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
                {/* Verdict Summary Card */}
                <div className="studio-verdict-card">
                  <div className="verdict-header">
                    <span className="verdict-label">
                      {language === 'hi' ? 'ऑडिट सारांश' : 'Audit Summary'}
                    </span>
                    <span className="flags-count-tag">
                      {result.flags?.length || 0} {language === 'hi' ? 'शर्तें चिह्नित' : 'Clauses Flagged'}
                    </span>
                  </div>
                  {result.summary && (
                    <p className="verdict-summary-text">{result.summary}</p>
                  )}
                </div>

                {/* Dropped items note */}
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

                {/* Flag Cards */}
                <div className="flags-feed">
                  {Array.isArray(result.flags) &&
                    result.flags.map((flag, idx) => (
                      <FlagCard
                        key={idx}
                        flag={flag}
                        riskLevel={result.overall_risk}
                      />
                    ))}
                </div>

                {/* Missing from agreement */}
                {Array.isArray(result.missing) && result.missing.length > 0 && (
                  <section className="missing-card">
                    <h3 className="missing-title">
                      ⚠️ {language === 'hi' ? 'आपके समझौते में गैर-मौजूद महत्वपूर्ण शर्तें' : 'Missing from your agreement'}
                    </h3>
                    <ul className="missing-list">
                      {result.missing.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
