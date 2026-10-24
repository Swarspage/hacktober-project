import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SAMPLES } from '../samples';
import { useAnalyze } from '../useAnalyze';
import {
  calculateRiskMetrics,
  loadUserRiskConfig,
  saveUserRiskConfig,
} from '../services/riskEngine';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLES[0]?.id || '');
  const [activeHighlightQuote, setActiveHighlightQuote] = useState(null);

  // Bring Your Own API Key (BYOK) State
  const [apiKey, setApiKeyState] = useState(() => {
    try {
      return localStorage.getItem('gemini_api_key') || '';
    } catch {
      return '';
    }
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Dynamic Risk Engine Configuration
  const [riskConfig, setRiskConfigState] = useState(() => loadUserRiskConfig());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Negotiation Management States
  const [negotiationStates, setNegotiationStates] = useState({});
  const [customClauses, setCustomClauses] = useState({});

  const analyzeState = useAnalyze();

  // Keep <html lang> synchronized
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Persist API key changes
  const setApiKey = useCallback((newKey) => {
    setApiKeyState(newKey);
    try {
      if (newKey) {
        localStorage.setItem('gemini_api_key', newKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    } catch (err) {
      console.error('Failed to save API key to local storage:', err);
    }
  }, []);

  // Persist risk config changes
  const updateRiskConfig = useCallback((newConfig) => {
    setRiskConfigState(newConfig);
    saveUserRiskConfig(newConfig);
  }, []);

  // Reset negotiation state on new analysis/sample
  const resetNegotiations = useCallback(() => {
    setNegotiationStates({});
    setCustomClauses({});
    setActiveHighlightQuote(null);
  }, []);

  const loadSample = useCallback((sampleId = selectedSampleId) => {
    setSelectedSampleId(sampleId);
    resetNegotiations();
    const chosen = SAMPLES.find((s) => s.id === sampleId) || SAMPLES[0];
    if (chosen) {
      setText(chosen.content);
    }
    return chosen?.content || '';
  }, [selectedSampleId, resetNegotiations]);

  const loadAndAnalyzeSample = useCallback((sampleId) => {
    setSelectedSampleId(sampleId);
    resetNegotiations();
    const chosen = SAMPLES.find((s) => s.id === sampleId) || SAMPLES[0];
    if (chosen) {
      setText(chosen.content);
      analyzeState.analyze(chosen.content, language, apiKey);
    }
  }, [language, apiKey, resetNegotiations, analyzeState]);

  const runAnalysis = useCallback((agreementText = text) => {
    return analyzeState.analyze(agreementText, language, apiKey);
  }, [text, language, apiKey, analyzeState]);

  const updateNegotiationState = useCallback((clauseIdx, status) => {
    setNegotiationStates((prev) => ({
      ...prev,
      [clauseIdx]: status,
    }));
  }, []);

  const updateCustomClause = useCallback((clauseIdx, customText) => {
    setCustomClauses((prev) => ({
      ...prev,
      [clauseIdx]: customText,
    }));
  }, []);

  // Real-time Dynamic Risk Metric Calculation
  const riskMetrics = useMemo(() => {
    return calculateRiskMetrics(analyzeState.result, riskConfig, negotiationStates);
  }, [analyzeState.result, riskConfig, negotiationStates]);

  const value = {
    text,
    setText,
    language,
    setLanguage,
    selectedSampleId,
    setSelectedSampleId,
    loadSample,
    loadAndAnalyzeSample,
    runAnalysis,
    activeHighlightQuote,
    setActiveHighlightQuote,
    // API Key (BYOK)
    apiKey,
    setApiKey,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    // Risk Engine
    riskConfig,
    setRiskConfig: updateRiskConfig,
    riskMetrics,
    isConfigModalOpen,
    setIsConfigModalOpen,
    // Negotiation & Redlines
    negotiationStates,
    updateNegotiationState,
    customClauses,
    updateCustomClause,
    resetNegotiations,
    isExportModalOpen,
    setIsExportModalOpen,
    // Core analysis hook state
    ...analyzeState,
    analyze: runAnalysis,
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
