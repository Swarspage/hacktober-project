import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook managing the complete request lifecycle for agreement analysis:
 * status: 'idle' | 'loading' | 'success' | 'error' | 'cancelled'
 */
export function useAnalyze() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const abortControllerRef = useRef(null);
  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastParamsRef = useRef(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('unmount');
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('cancelled');
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus('cancelled');
  }, []);

  const analyze = useCallback(async (text, language = 'en', apiKey = '') => {
    const trimmed = (text || '').trim();
    if (!trimmed) {
      return;
    }

    // Over-length check (> 15,000 characters)
    if (text.length > 15000) {
      setStatus('error');
      setError({
        type: 'over-length',
        message: 'This agreement is too long. Paste up to 15,000 characters.',
      });
      return;
    }

    // Retain parameters for "Try again"
    lastParamsRef.current = { text, language, apiKey };

    // Abort any existing in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('superseded');
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('loading');
    setError(null);
    setResult(null);
    setElapsedSeconds(0);

    const startTime = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 250);

    // Hard timeout at 90s through the same AbortController
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      controller.abort('timeout');
    }, 90000);

    const apiBase = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
    const endpoint = `${apiBase}/analyze`;

    const headers = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, language, apiKey }),
        signal: controller.signal,
      });

      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 400 && text.length > 15000) {
          setStatus('error');
          setError({
            type: 'over-length',
            message: 'This agreement is too long. Paste up to 15,000 characters.',
          });
          return;
        }

        if (response.status === 401 || errData.code === 'MISSING_API_KEY' || errData.code === 'INVALID_API_KEY') {
          setStatus('error');
          setError({
            type: 'api-key',
            code: errData.code || 'MISSING_API_KEY',
            message: errData.error || 'Please provide your Google Gemini API key to run analysis.',
          });
          return;
        }

        setStatus('error');
        setError({
          type: 'server',
          message: errData.error || 'The analysis failed. Try again.',
        });
        return;
      }

      const data = await response.json();
      setResult(data);
      setStatus('success');
    } catch (err) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (controller.signal.aborted) {
        const reason = controller.signal.reason;
        if (reason === 'cancelled') {
          setStatus('cancelled');
          return;
        }
        if (reason === 'timeout' || err.name === 'TimeoutError') {
          setStatus('error');
          setError({
            type: 'timeout',
            message: 'The analysis timed out. Try pasting a shorter part of the agreement.',
          });
          return;
        }
        return;
      }

      // Network failure
      setStatus('error');
      setError({
        type: 'network',
        message: 'Could not reach the server. Check that it is running and try again.',
      });
    }
  }, []);

  return {
    status,
    result,
    error,
    elapsedSeconds,
    analyze,
    cancel,
  };
}
