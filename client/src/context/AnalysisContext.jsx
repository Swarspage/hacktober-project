import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLES } from '../samples';
import { useAnalyze } from '../useAnalyze';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLES[0]?.id || '');
  const [activeHighlightQuote, setActiveHighlightQuote] = useState(null);

  const analyzeState = useAnalyze();

  // Keep <html lang> synchronized
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const loadSample = (sampleId = selectedSampleId) => {
    setSelectedSampleId(sampleId);
    const chosen = SAMPLES.find((s) => s.id === sampleId) || SAMPLES[0];
    if (chosen) {
      setText(chosen.content);
    }
    return chosen?.content || '';
  };

  const value = {
    text,
    setText,
    language,
    setLanguage,
    selectedSampleId,
    setSelectedSampleId,
    loadSample,
    loadAndAnalyzeSample: (sampleId) => {
      setSelectedSampleId(sampleId);
      const chosen = SAMPLES.find((s) => s.id === sampleId) || SAMPLES[0];
      if (chosen) {
        setText(chosen.content);
        analyzeState.analyze(chosen.content, language);
      }
    },
    activeHighlightQuote,
    setActiveHighlightQuote,
    ...analyzeState,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysisContext must be used within an AnalysisProvider');
  }
  return context;
}
