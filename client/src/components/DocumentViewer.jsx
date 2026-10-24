import React, { useMemo, useRef, useEffect } from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';

export default function DocumentViewer({ flags = [] }) {
  const { text, activeHighlightQuote, setActiveHighlightQuote, language, status } = useAnalysisContext();
  const activeQuoteRef = useRef(null);

  const isScanning = status === 'loading';

  // Scroll active quote into view when user selects a flag
  useEffect(() => {
    if (activeHighlightQuote && activeQuoteRef.current) {
      activeQuoteRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeHighlightQuote]);

  // Parse text into regular segments and highlighted segments matching verified quotes
  const segments = useMemo(() => {
    if (!text) return [];
    if (!flags || flags.length === 0) {
      return [{ type: 'text', content: text }];
    }

    function escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Collect valid quotes and locate offsets in text
    const matches = [];
    flags.forEach((flag, flagIdx) => {
      if (!flag?.quote || typeof flag.quote !== 'string') return;
      const quote = flag.quote.trim();
      if (!quote) return;

      // 1. Try exact matches first
      let foundExact = false;
      let startIdx = 0;
      while ((startIdx = text.indexOf(quote, startIdx)) !== -1) {
        foundExact = true;
        matches.push({
          start: startIdx,
          end: startIdx + quote.length,
          quote: flag.quote,
          flagIdx,
          category: flag.category,
        });
        startIdx += quote.length;
      }

      // 2. If exact match fails, try flexible whitespace & case-insensitive regex
      if (!foundExact) {
        try {
          const escaped = escapeRegex(quote).replace(/\s+/g, '\\s+');
          const regex = new RegExp(escaped, 'gi');
          let m;
          while ((m = regex.exec(text)) !== null) {
            matches.push({
              start: m.index,
              end: m.index + m[0].length,
              quote: flag.quote,
              flagIdx,
              category: flag.category,
            });
            if (regex.lastIndex <= m.index) regex.lastIndex = m.index + 1;
          }
        } catch {
          // ignore invalid pattern
        }
      }
    });

    if (matches.length === 0) {
      return [{ type: 'text', content: text }];
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Merge overlapping or sequential matches cleanly
    const merged = [];
    for (const match of matches) {
      if (merged.length === 0) {
        merged.push(match);
      } else {
        const last = merged[merged.length - 1];
        if (match.start < last.end) {
          // overlap, keep the earlier or extend
          if (match.end > last.end) {
            last.end = match.end;
          }
        } else {
          merged.push(match);
        }
      }
    }

    // Build segment array
    const result = [];
    let currentPos = 0;

    merged.forEach((m, idx) => {
      if (m.start > currentPos) {
        result.push({
          type: 'text',
          content: text.slice(currentPos, m.start),
          id: `txt-${idx}`,
        });
      }
      result.push({
        type: 'highlight',
        content: text.slice(m.start, m.end),
        quote: m.quote,
        flagIdx: m.flagIdx,
        category: m.category,
        id: `hl-${idx}`,
      });
      currentPos = m.end;
    });

    if (currentPos < text.length) {
      result.push({
        type: 'text',
        content: text.slice(currentPos),
        id: 'txt-end',
      });
    }

    return result;
  }, [text, flags]);

  const wordCount = useMemo(() => {
    return text ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  return (
    <div className={`doc-viewer-card ${isScanning ? 'is-scanning' : ''}`}>
      <div className="doc-viewer-header">
        <div className="doc-title-row">
          <span className="doc-icon" aria-hidden="true">📄</span>
          <h3 className="doc-heading">
            {language === 'hi' ? 'मूल समझौता पाठ' : 'Original Agreement'}
          </h3>
          {isScanning && (
            <span className="doc-scanning-badge">
              <span className="doc-scanning-pulse" />
              <span>{language === 'hi' ? 'दस्तावेज़ स्कैन हो रहा है...' : 'Scanning Clauses...'}</span>
            </span>
          )}
        </div>
        <div className="doc-meta-stats">
          <span>{wordCount} {language === 'hi' ? 'शब्द' : 'words'}</span>
          <span className="meta-dot">•</span>
          <span>{text.length.toLocaleString()} {language === 'hi' ? 'अक्षर' : 'chars'}</span>
        </div>
      </div>

      <div className="doc-body-scroll">
        {!text ? (
          <div className="doc-empty-state">
            <p>{language === 'hi' ? 'कोई पाठ लोड नहीं हुआ। ऊपर दिए गए मेनू से एक समझौता चुनें।' : 'No agreement loaded. Choose a sample from the top bar to inspect.'}</p>
          </div>
        ) : (
          <pre className="doc-text-content">
            {segments.map((seg) => {
              if (seg.type === 'text') {
                return <span key={seg.id}>{seg.content}</span>;
              }

              const isActive = activeHighlightQuote === seg.quote;

              return (
                <mark
                  key={seg.id}
                  ref={isActive ? activeQuoteRef : null}
                  className={`clause-highlight ${isActive ? 'clause-highlight-active' : ''}`}
                  onClick={() => setActiveHighlightQuote(seg.quote)}
                  title={`Flagged: ${seg.category || 'Risky clause'}`}
                >
                  {seg.content}
                </mark>
              );
            })}
          </pre>
        )}
      </div>
    </div>
  );
}
