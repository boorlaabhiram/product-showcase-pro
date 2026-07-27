import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface UseVoiceSearchOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  lang?: string;
}

export function useVoiceSearch(options?: UseVoiceSearchOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    const SpeechRecognitionClass =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionClass) return;

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = options?.lang || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (options?.onResult) {
          options.onResult(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        let errorText = 'Voice search error occurred.';
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          errorText = 'Microphone access denied. Please check browser permissions.';
        } else if (event.error === 'no-speech') {
          errorText = 'No speech detected. Please try speaking again.';
        } else if (event.error === 'audio-capture') {
          errorText = 'No microphone device found.';
        }
        setErrorMessage(errorText);
        if (options?.onError) {
          options.onError(errorText);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error('Failed to initialize SpeechRecognition:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          // ignore
        }
      }
    };
  }, [options?.lang]);

  const startListening = useCallback(() => {
    const SpeechRecognitionClass =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionClass) {
      setErrorMessage('Voice search is not supported in this browser.');
      if (options?.onError) {
        options.onError('Voice search is not supported in this browser.');
      }
      return;
    }

    if (!recognitionRef.current) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = options?.lang || 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
          setTranscript('');
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          if (options?.onResult) {
            options.onResult(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          let errorText = 'Voice search error occurred.';
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            errorText = 'Microphone access denied. Please check browser permissions.';
          } else if (event.error === 'no-speech') {
            errorText = 'No speech detected. Please try speaking again.';
          } else if (event.error === 'audio-capture') {
            errorText = 'No microphone device found.';
          }
          setErrorMessage(errorText);
          if (options?.onError) {
            options.onError(errorText);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.error('Failed to recreate SpeechRecognition:', err);
      }
    }

    try {
      setErrorMessage(null);
      recognitionRef.current.start();
    } catch (e) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (retryErr) {
            console.error('Retry start failed:', retryErr);
          }
        }, 150);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  }, [options]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
  };
}
