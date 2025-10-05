'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Uni-GPT, a professional voice assistant for UniQube bathroom and kitchen pods. You provide concise, helpful responses for:

- Calendar management (checking schedule, creating events)
- Email summaries (important/urgent messages)
- Weather information (Dubai/UAE focused)
- News briefings (90-second summaries)
- Kitchen recipes and cooking timers
- Grocery list management
- Smart home controls (lights, exhaust fans)

Keep responses brief and natural for voice interaction. Be friendly, professional, and contextually aware. When users ask about their schedule, weather, or specific information, provide clear, actionable responses.`;

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Click to start');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [autoListen, setAutoListen] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speechRateRef = useRef<number>(1.0);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setStatusText('Listening...');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleUserInput(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setStatusText('Error: ' + event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (!isSpeaking && !autoListen) {
            setStatusText('Click to start');
          }
        };

        recognitionRef.current = recognition;
      }

      // Initialize speech synthesis
      synthesisRef.current = window.speechSynthesis;

      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const defaultVoice = voices.find(v => v.name.includes('Google') && v.lang === 'en-US') || voices[0];
        selectedVoiceRef.current = defaultVoice;
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [autoListen, isSpeaking]);

  const handleUserInput = async (text: string) => {
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setStatusText('Thinking...');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.slice(-10),
            userMessage,
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.message };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(prev => [...prev, userMessage, assistantMessage]);

      speak(data.message);
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      const errorMsg = 'Sorry, I encountered an error: ' + error.message;
      const errorMessage: Message = { role: 'assistant', content: errorMsg };
      setMessages(prev => [...prev, errorMessage]);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = useCallback((text: string) => {
    if (!synthesisRef.current) return;

    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }
    utterance.rate = speechRateRef.current;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatusText('Speaking...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (autoListen) {
        setTimeout(() => startListening(), 500);
      } else {
        setStatusText('Click to start');
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setStatusText('Click to start');
    };

    synthesisRef.current.speak(utterance);
  }, [autoListen]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      if (isSpeaking && synthesisRef.current) {
        synthesisRef.current.cancel();
        setIsSpeaking(false);
      }
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationHistory([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent mb-3">
            Uni-GPT
          </h1>
          <p className="text-gray-400 text-lg">Voice Assistant for UniQube</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 rounded-3xl p-10 shadow-2xl border border-slate-700">
          {/* Voice Orb */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-52 h-52 mb-6">
              <div
                className={`absolute w-40 h-40 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/50 ${
                  isListening ? 'animate-pulse-orb' : isSpeaking ? 'animate-speaking' : isProcessing ? 'animate-processing' : ''
                }`}
              />
              {isListening && (
                <>
                  <div className="absolute w-40 h-40 rounded-full border-2 border-purple-500 animate-pulse-ring" />
                  <div className="absolute w-40 h-40 rounded-full border-2 border-purple-500 animate-pulse-ring" style={{ animationDelay: '0.75s' }} />
                </>
              )}
            </div>
            <p className="text-xl text-gray-300 font-medium">{statusText}</p>
          </div>

          {/* Voice Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/50 scale-110'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-purple-500/30 hover:scale-110'
              }`}
            >
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
          </div>

          {/* Conversation Display */}
          <div className="bg-slate-900/50 rounded-xl p-6 max-h-96 overflow-y-auto border border-slate-700">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 italic py-8">
                Welcome! I'm your Uni-GPT assistant. Click the microphone and speak to get started.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 rounded-xl animate-fade-in ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white ml-12'
                      : 'bg-slate-800 border border-slate-700 mr-12'
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 flex gap-4 items-center justify-between">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoListen}
                onChange={(e) => setAutoListen(e.target.checked)}
                className="w-5 h-5 accent-purple-500"
              />
              <span>Continuous Conversation Mode</span>
            </label>
            <button
              onClick={clearConversation}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Clear Conversation
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Powered by OpenAI GPT-4o-mini • Built for UniQube</p>
          <p className="mt-1">Use Chrome or Edge for best experience</p>
        </div>
      </div>
    </main>
  );
}
