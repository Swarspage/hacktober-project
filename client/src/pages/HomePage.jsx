import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisContext } from '../context/AnalysisContext';
import { SAMPLES } from '../samples';

const CONTENT = {
  en: {
    heroH1: "Know what you're signing before you sign it.",
    heroSubtext: "Paste your rental agreement. We flag the clauses that could cost you money, quote them exactly, and tell you what to ask the owner.",
    chipPrompt: "Or quick test with verified samples:",
    inputLabel: "Rental agreement text",
    placeholder: "Paste your rental agreement here (up to 15,000 characters)...",
    btnInspect: "Run Inspection Studio ➔",
    btnSample: "Test Sample Agreement",
    charLimit: "15,000",
    errorEmpty: "Please paste your agreement text first.",
    errorTooLong: "Agreement text exceeds 15,000 characters.",
    checksH2: "What it checks",
    checks: [
      { title: 'Lock-in period and penalty', desc: 'Early exit fees, mandatory duration, and deposit forfeiture clauses.' },
      { title: 'Deposit refund terms', desc: 'Refund timeline, inspection conditions, and non-negotiable deductions.' },
      { title: 'Notice period', desc: 'Mutual termination rights and uneven notice requirements.' },
      { title: 'Rent escalation', desc: 'Annual percentage hikes and unexpected mid-term fee increases.' },
      { title: 'Maintenance and repairs', desc: 'Who pays for structural issues, seepages, and day-to-day fixes.' },
      { title: 'Owner entry rights', desc: 'Notice requirements, inspection hours, and tenant privacy limits.' },
      { title: 'Subletting', desc: 'Restrictions on housemates, guests, and temporary visitors.' },
      { title: 'Registration and stamp duty', desc: 'Division of legal costs and formal registration under Maharashtra law.' },
      { title: 'Police verification', desc: 'Tenant verification responsibility and local station compliance.' },
    ],
    howItWorksH2: "How it works",
    steps: [
      { num: '1', title: 'Paste your agreement', desc: 'Drop any residential Leave & Licence agreement into the studio.' },
      { num: '2', title: 'Interactive clause audit', desc: 'Review verified clauses side-by-side with exact verbatim quotes highlighted.' },
      { num: '3', title: 'Copy landlord counter-offers', desc: 'Copy professional, legally sound counter-proposals ready to send to your owner.' }
    ],
    privacyH2: "How we handle your document",
    privacyPoints: [
      "We don't store your agreement.",
      "Every flagged clause is verified against your text. If the exact words are not found, the flag is automatically dropped.",
      "Your text is sent securely to Google's API for real-time model analysis."
    ],
    footerLegal: "Not legal advice. For a binding opinion, talk to a lawyer.",
    footerEvent: "Built at Hacktoberfest Hack Day Mumbai."
  },
  hi: {
    heroH1: "हस्ताक्षर करने से पहले जानें कि आप क्या साइन कर रहे हैं।",
    heroSubtext: "अपना किराया समझौता पेस्ट करें। हम उन शर्तों को चिह्नित करते हैं जिनसे आपका नुकसान हो सकता है, उन्हें सटीक रूप से उद्धृत करते हैं, और बताते हैं कि मकान मालिक से क्या मांगना है।",
    chipPrompt: "या सत्यापित नमूनों के साथ तुरंत परीक्षण करें:",
    inputLabel: "किराया समझौता पाठ",
    placeholder: "अपना किराया समझौता यहाँ पेस्ट करें (15,000 अक्षरों तक)...",
    btnInspect: "निरीक्षण स्टूडियो शुरू करें ➔",
    btnSample: "नमूना समझौता आज़माएँ",
    charLimit: "15,000",
    errorEmpty: "कृपया पहले अपना किराया समझौता पेस्ट करें।",
    errorTooLong: "समझौता पाठ 15,000 अक्षरों की सीमा से अधिक है।",
    checksH2: "यह किन शर्तों की जांच करता है",
    checks: [
      { title: 'लॉक-इन अवधि और जुर्माना', desc: 'समय पूर्व समाप्ति शुल्क, अनिवार्य अवधि, और सुरक्षा जमा जब्ती की शर्तें।' },
      { title: 'जमा राशि वापसी की शर्तें', desc: 'रिफंड की समय सीमा, निरीक्षण की शर्तें, और गैर-परक्राम्य कटौती।' },
      { title: 'नोटिस अवधि', desc: 'पारस्परिक समाप्ति अधिकार और असमान नोटिस आवश्यकताएं।' },
      { title: 'किराया वृद्धि', desc: 'वार्षिक प्रतिशत वृद्धि और अप्रत्याशित मध्य-अवधि शुल्क बढ़ोतरी।' },
      { title: 'रखरखाव और मरम्मत', desc: 'संरचनात्मक समस्याओं, सीपेज और दैनिक मरम्मत का खर्च कौन उठाएगा।' },
      { title: 'मालिक के प्रवेश अधिकार', desc: 'नोटिस आवश्यकताएं, निरीक्षण के घंटे, और किरायेदार की गोपनीयता सीमाएं।' },
      { title: 'सबलेटिंग (उप-किरायेदारी)', desc: 'फ्लैटमेट्स, मेहमानों और अस्थायी आगंतुकों पर प्रतिबंध।' },
      { title: 'पंजीकरण और स्टाम्प शुल्क', desc: 'कानूनी खर्चों का विभाजन और महाराष्ट्र कानून के तहत औपचारिक पंजीकरण।' },
      { title: 'पुलिस सत्यापन', desc: 'किरायेदार सत्यापन की जिम्मेदारी और स्थानीय थाने का अनुपालन।' },
    ],
    howItWorksH2: "यह कैसे काम करता है",
    steps: [
      { num: '1', title: 'समझौता पेस्ट करें', desc: 'स्टूडियो में कोई भी आवासीय लीव एंड लाइसेंस समझौता पेस्ट करें।' },
      { num: '2', title: 'सटीक क्लॉज़ ऑडिट', desc: 'दस्तावेज़ में सीधे हाइलाइट किए गए सटीक उद्धरणों के साथ शर्तों की समीक्षा करें।' },
      { num: '3', title: 'मकान मालिक के लिए प्रस्ताव कॉपी करें', desc: 'मालिक को भेजने के लिए सीधे तैयार कानूनी सुझाव कॉपी करें।' }
    ],
    privacyH2: "हम आपके दस्तावेज़ को कैसे संभालते हैं",
    privacyPoints: [
      "हम आपके समझौते को संग्रहीत नहीं करते हैं।",
      "प्रत्येक चिह्नित शर्त का आपके मूल पाठ से मिलान किया जाता है। यदि सटीक शब्द नहीं मिलते हैं, तो फ्लैग स्वतः हटा दिया जाता है।",
      "विश्लेषण के लिए आपका पाठ गूगल के सुरक्षित एपीआई को भेजा जाता है।"
    ],
    footerLegal: "यह कानूनी सलाह नहीं है। बाध्यकारी राय के लिए किसी वकील से परामर्श लें।",
    footerEvent: "हैकटोबरफेस्ट हैक डे मुंबई में निर्मित।"
  }
};

export default function HomePage() {
  const {
    text,
    setText,
    language,
    selectedSampleId,
    loadSample,
    analyze,
    status,
  } = useAnalysisContext();

  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const t = CONTENT[language] || CONTENT.en;

  const handleStartInspection = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      textareaRef.current?.focus();
      return;
    }
    if (text.length > 15000) {
      return;
    }

    // Start analysis and navigate immediately to Route 2
    analyze(text, language);
    navigate('/report');
  };

  const handleQuickSample = (sampleId) => {
    const sampleContent = loadSample(sampleId);
    analyze(sampleContent, language);
    navigate('/report');
  };

  const isOverLength = text.length > 15000;
  const isTextEmpty = !text || text.trim().length === 0;

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>⚡ {language === 'hi' ? 'मुंबई किरायेदारों के लिए AI ऑडिट' : 'AI Lease Audit for Mumbai Tenants'}</span>
        </div>
        <h1 className="hero-h1">{t.heroH1}</h1>
        <p className="hero-subtext">{t.heroSubtext}</p>

        {/* Clean Executive Input Card */}
        <div className="home-input-card">
          <div className="textarea-container">
            <textarea
              ref={textareaRef}
              className="home-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.inputLabel}
            />

            <div className="textarea-footer">
              <span className={`char-counter ${isOverLength ? 'char-limit-exceeded' : ''}`}>
                {text.length.toLocaleString()} / {t.charLimit}
              </span>

              <div className="home-actions-group">
                <button
                  type="button"
                  className="btn btn-secondary home-sample-btn"
                  onClick={() => handleQuickSample(selectedSampleId || SAMPLES[0].id)}
                  disabled={status === 'loading'}
                >
                  📄 {language === 'hi' ? 'नमूना समझौता लोड करें' : 'Load Sample Demo'}
                </button>

                <button
                  type="button"
                  className="btn btn-primary run-studio-btn"
                  onClick={handleStartInspection}
                  disabled={isTextEmpty || isOverLength || status === 'loading'}
                >
                  {t.btnInspect}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="home-studio-hint">
          <span>
            💡 {language === 'hi'
              ? 'त्वरित परीक्षण के लिए "नमूना समझौता लोड करें" पर क्लिक करें या स्टूडियो में 6 पूर्व-निर्मित समझौतों में से चुनें।'
              : 'Testing for a demo? Click "Load Sample Demo" or explore all 6 sample agreements directly inside the Inspection Studio.'}
          </span>
        </div>
      </section>

      {/* What It Checks Section */}
      <section className="page-section">
        <h2 className="section-title">{t.checksH2}</h2>
        <div className="checks-grid">
          {t.checks.map((item, idx) => (
            <div key={idx} className="check-card">
              <h3 className="check-card-title">{item.title}</h3>
              <p className="check-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="page-section">
        <h2 className="section-title">{t.howItWorksH2}</h2>
        <div className="steps-list">
          {t.steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-number" aria-hidden="true">{step.num}</div>
              <div>
                <h3 className="step-card-title">{step.title}</h3>
                <p className="step-text">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How We Handle Your Document */}
      <section className="page-section">
        <h2 className="section-title">{t.privacyH2}</h2>
        <div className="handle-doc-list">
          {t.privacyPoints.map((point, idx) => (
            <div key={idx} className="handle-doc-item">
              <span className="privacy-check" aria-hidden="true">✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="page-footer">
        <p className="footer-line">{t.footerLegal}</p>
        <p className="footer-line">{t.footerEvent}</p>
      </footer>
    </div>
  );
}
