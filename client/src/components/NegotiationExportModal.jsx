import React, { useState } from 'react';

export default function NegotiationExportModal({
  isOpen,
  onClose,
  result,
  metrics,
  negotiationStates = {},
  customClauses = {},
  language = 'en',
}) {
  const [activeTab, setActiveTab] = useState('addendum');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const flags = Array.isArray(result?.flags) ? result.flags : [];
  const missing = Array.isArray(result?.missing) ? result.missing : [];

  const itemsToNegotiate = flags.filter((_, idx) => {
    const st = negotiationStates[idx];
    return st !== 'negotiated' && st !== 'waived';
  });

  const generateAddendumText = () => {
    let doc = `AMENDMENT AND SUPPLEMENTARY ADDENDUM TO LEAVE AND LICENCE AGREEMENT\n\n`;
    doc += `This Addendum is made and entered into between the LICENSOR and the LICENSEE as a binding supplement to the Leave and Licence Agreement executed between the parties.\n\n`;
    doc += `WHEREAS the parties have mutually reviewed the terms of the licence and agreed to the following modifications and additions to ensure balanced compliance and mutual equity:\n\n`;
    doc += `NOW IT IS HEREBY MUTUALLY AGREED BY AND BETWEEN THE PARTIES AS FOLLOWS:\n\n`;

    flags.forEach((f, idx) => {
      const revised = customClauses[idx] || f.revised_clause || f.what_to_ask;
      doc += `1.${idx + 1}. MODIFICATION OF CLAUSE [${(f.category || 'TERMS').toUpperCase()}]:\n`;
      doc += `The original provision stating:\n"${f.quote}"\n`;
      doc += `SHALL BE DELETED IN ITS ENTIRETY AND REPLACED WITH THE FOLLOWING:\n`;
      doc += `"${revised}"\n\n`;
    });

    if (missing.length > 0) {
      doc += `2. INCORPORATION OF ESSENTIAL MISSING SAFEGUARDS:\n`;
      missing.forEach((m, idx) => {
        const itemTitle = typeof m === 'object' ? m.item : m;
        const clause = typeof m === 'object' && m.suggested_clause ? m.suggested_clause : `Both parties agree to standard terms regarding ${itemTitle}.`;
        doc += `2.${idx + 1}. [${itemTitle}]: ${clause}\n`;
      });
      doc += `\n`;
    }

    doc += `3. SAVINGS CLAUSE:\n`;
    doc += `All other covenants, terms, and conditions of the principal Leave and Licence Agreement not specifically altered or modified by this Addendum shall remain in full force and effect.\n\n`;
    doc += `IN WITNESS WHEREOF, the Licensor and the Licensee have executed this Addendum.\n\n`;
    doc += `__________________________            __________________________\n`;
    doc += `LICENSOR                               LICENSEE\n`;
    doc += `Date: ____________________            Date: ____________________\n`;

    return doc;
  };

  const generateEmailText = () => {
    let email = `Subject: Leave and Licence Agreement - Proposed Adjustments & Clarifications\n\n`;
    email += `Dear Owner / Property Representative,\n\n`;
    email += `Thank you for sharing the draft Leave and Licence agreement. I am very keen on finalizing the tenancy. Upon reviewing the draft against standard residential tenancy practices in Maharashtra, I would like to request adjustments to a few specific terms to ensure a fair and balanced agreement for both of us:\n\n`;

    flags.forEach((f, idx) => {
      const state = negotiationStates[idx] || 'pending';
      const isDealbreaker = state === 'dealbreaker';
      const revised = customClauses[idx] || f.revised_clause || f.what_to_ask;

      email += `${idx + 1}. ${f.category || 'Clause'} ${isDealbreaker ? '[High Priority]' : ''}:\n`;
      email += `   - Current Draft: "${f.quote}"\n`;
      email += `   - Consideration: ${f.why_risky}\n`;
      email += `   - Proposed Counter-Term: ${revised}\n\n`;
    });

    if (missing.length > 0) {
      email += `Additionally, to prevent future misunderstandings, I suggest we add explicit clarifications for the following standard items:\n`;
      missing.forEach((m) => {
        const itemTitle = typeof m === 'object' ? m.item : m;
        email += `   • ${itemTitle}\n`;
      });
      email += `\n`;
    }

    email += `I appreciate your flexibility and cooperation in making these mutual adjustments. Please let me know once you have had a moment to review so we can proceed with execution and registration.\n\n`;
    email += `Warm regards,\n[Tenant Name]\n[Contact Information]`;

    return email;
  };

  const generateWhatsAppText = () => {
    let msg = `*Regarding Rental Agreement Draft - Proposed Counter-Terms*\n\n`;
    msg += `Hi! Reviewed the Leave & Licence draft. Overall looks good, but need a few quick adjustments to match standard Mumbai tenancy norms before signing:\n\n`;

    flags.forEach((f, idx) => {
      const revised = customClauses[idx] || f.revised_clause || f.what_to_ask;
      msg += `🔹 *${f.category || 'Point ' + (idx + 1)}*\n`;
      msg += `Original: _"${f.quote.slice(0, 80)}${f.quote.length > 80 ? '...' : ''}"_\n`;
      msg += `👉 *Adjustment requested:* ${revised}\n\n`;
    });

    if (missing.length > 0) {
      msg += `*Missing protections to insert:*\n`;
      missing.slice(0, 3).forEach((m) => {
        const itemTitle = typeof m === 'object' ? m.item : m;
        msg += `• ${itemTitle}\n`;
      });
      msg += `\n`;
    }

    msg += `Please confirm if the owner is okay with these changes so we can finalize registration. Thanks!`;
    return msg;
  };

  const generateCertificateText = () => {
    let cert = `CONTRACT RISK & COMPLIANCE AUDIT REPORT\n`;
    cert += `=================================================================\n`;
    cert += `Audit Status: COMPLETED\n`;
    cert += `Overall Contract Risk Score: ${metrics?.currentScore || 0}/100 (${(metrics?.riskLevel || 'low').toUpperCase()})\n`;
    cert += `Post-Negotiation Target Score: ${metrics?.projectedScore || 0}/100\n`;
    cert += `Risk Reduction Achieved: ${metrics?.pointsReduced || 0} points (${metrics?.percentReduced || 0}%)\n`;
    cert += `Total Identified Clauses: ${flags.length}\n`;
    cert += `Essential Missing Safeguards: ${missing.length}\n`;
    cert += `=================================================================\n\n`;
    cert += `EXECUTIVE SUMMARY:\n${result?.summary || 'N/A'}\n\n`;
    cert += `KEY DETECTED LIABILITIES:\n`;
    flags.forEach((f, idx) => {
      cert += `[${idx + 1}] Category: ${f.category} | Severity: ${(f.severity || 'medium').toUpperCase()}\n`;
      cert += `    Quote: "${f.quote}"\n`;
      cert += `    Risk Factor: ${f.why_risky}\n`;
      cert += `    Recommended Action: ${f.what_to_ask}\n\n`;
    });
    return cert;
  };

  const currentContent =
    activeTab === 'addendum'
      ? generateAddendumText()
      : activeTab === 'email'
      ? generateEmailText()
      : activeTab === 'whatsapp'
      ? generateWhatsAppText()
      : generateCertificateText();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename =
      activeTab === 'addendum'
        ? 'Lease_Addendum_Amendment.txt'
        : activeTab === 'email'
        ? 'Landlord_Negotiation_Email.txt'
        : activeTab === 'whatsapp'
        ? 'Broker_Negotiation_Message.txt'
        : 'Contract_Risk_Audit_Report.txt';

    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="negotiation-export-modal scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <div className="export-header-title-group">
            <span className="export-icon">📜</span>
            <div>
              <h2 className="export-modal-title">
                {language === 'hi' ? 'अनुबंध बातचीत और कानूनी संशोधन केंद्र' : 'Contract Negotiation & Redlining Hub'}
              </h2>
              <p className="export-modal-subtitle">
                {language === 'hi'
                  ? 'मकान मालिक या ब्रोकर को भेजने के लिए तैयार पेशेवर कानूनी दस्तावेज, ईमेल या संदेश तैयार करें।'
                  : 'Export tailored legal addendums, polite counter-offer emails, and broker WhatsApp summaries.'}
              </p>
            </div>
          </div>
          <button type="button" className="config-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="export-tabs-row">
          <button
            type="button"
            className={`export-tab-btn ${activeTab === 'addendum' ? 'export-tab-active' : ''}`}
            onClick={() => setActiveTab('addendum')}
          >
            📑 {language === 'hi' ? 'कानूनी संशोधन परिशिष्ट (Addendum)' : 'Formal Lease Addendum'}
          </button>
          <button
            type="button"
            className={`export-tab-btn ${activeTab === 'email' ? 'export-tab-active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            📧 {language === 'hi' ? 'मकान मालिक हेतु ईमेल' : 'Landlord Negotiation Email'}
          </button>
          <button
            type="button"
            className={`export-tab-btn ${activeTab === 'whatsapp' ? 'export-tab-active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            💬 {language === 'hi' ? 'ब्रोकर व्हाट्सएप संदेश' : 'Broker / WhatsApp Summary'}
          </button>
          <button
            type="button"
            className={`export-tab-btn ${activeTab === 'certificate' ? 'export-tab-active' : ''}`}
            onClick={() => setActiveTab('certificate')}
          >
            📊 {language === 'hi' ? 'ऑडिट रिपोर्ट सारांश' : 'Full Audit Summary'}
          </button>
        </div>

        <div className="export-modal-body">
          <div className="export-preview-header">
            <span className="export-preview-tag">
              {activeTab === 'addendum'
                ? 'Binding Legal Agreement Document'
                : activeTab === 'email'
                ? 'Ready-to-Send Professional Email'
                : activeTab === 'whatsapp'
                ? 'Optimized Mobile Messaging Draft'
                : 'Complete Risk & Compliance Audit Record'}
            </span>
            <span className="export-items-count">
              {itemsToNegotiate.length} {language === 'hi' ? 'शर्तें शामिल' : 'clauses addressed'}
            </span>
          </div>

          <pre className="export-text-viewer">
            {currentContent}
          </pre>
        </div>

        <div className="export-modal-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownload}>
            ⬇️ {language === 'hi' ? 'टेक्स्ट फ़ाइल डाउनलोड करें (.txt)' : 'Download Document (.txt)'}
          </button>

          <div className="modal-footer-right">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            <button
              type="button"
              className={`btn btn-primary ${copied ? 'copy-success-btn' : ''}`}
              onClick={handleCopy}
            >
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
