import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useJournalStore from '../hooks/useJournalStore';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useAI } from '../hooks/useAI';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const CONVERSATION_MAX_TOKENS = 180; // Keep Claude to 2-3 sentences
const TTS_VOICE_KEY = 'grove-tts-voice';
const TTS_VOICES = [
  { id: 'shimmer', label: 'Shimmer' },
  { id: 'nova', label: 'Nova' },
  { id: 'coral', label: 'Coral' },
  { id: 'sage', label: 'Sage' },
];

function formatSessionContent(messages) {
  return messages
    .map((m) => (m.role === 'user' ? `User: ${m.content}` : `Claude: ${m.content}`))
    .join('\n\n');
}

export default function TalkMode() {
  const { updateSessionContent, addAIMessage, setScreen } = useJournalStore();
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();
  const { reflect, loading: aiLoading } = useAI();
  const { speak, isPlaying, stop: stopTTS } = useTextToSpeech();

  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false); // sending to AI or playing TTS
  const [ttsVoice, setTtsVoice] = useState(() => {
    if (typeof localStorage === 'undefined') return 'shimmer';
    return localStorage.getItem(TTS_VOICE_KEY) || 'shimmer';
  });

  const handleVoiceChange = useCallback((e) => {
    const voice = e.target.value;
    setTtsVoice(voice);
    localStorage.setItem(TTS_VOICE_KEY, voice);
  }, []);

  const canUseMic = !aiLoading && !isPlaying && !isProcessing;
  const displayTranscript = transcript + (interimTranscript ? ` ${interimTranscript}` : '').trim();

  // Persist conversation to session for synthesis
  useEffect(() => {
    if (messages.length > 0) {
      updateSessionContent(formatSessionContent(messages));
    }
  }, [messages, updateSessionContent]);

  const handleSendTurn = useCallback(async () => {
    const userText = (transcript + (interimTranscript ? ` ${interimTranscript}` : '')).trim();
    stopListening();
    if (!userText) return;

    const userMessage = { role: 'user', content: userText };
    const conversationHistory = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, userMessage]);
    resetTranscript();
    setIsProcessing(true);

    try {
      const response = await reflect(userText, conversationHistory, {
        maxTokens: CONVERSATION_MAX_TOKENS,
      });
      const assistantMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      addAIMessage({ role: 'assistant', content: response });
      await speak(response, { voice: ttsVoice });
    } catch {
      setMessages((prev) => prev.slice(0, -1)); // remove user message on error so they can retry
      // Optionally show a subtle error state
    } finally {
      setIsProcessing(false);
    }
  }, [
    transcript,
    interimTranscript,
    messages,
    resetTranscript,
    stopListening,
    reflect,
    addAIMessage,
    speak,
    ttsVoice,
  ]);

  const handleMicPress = useCallback(() => {
    if (isListening) {
      handleSendTurn();
    } else {
      startListening();
    }
  }, [isListening, startListening, handleSendTurn]);

  const handleFinish = useCallback(() => {
    stopListening();
    stopTTS();
    setScreen('synthesis');
  }, [stopListening, stopTTS, setScreen]);

  if (!isSupported) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6">
        <p className="font-body text-lg text-grove-200/70 text-center max-w-md">
          Voice isn't supported in this browser. Try Chrome or Edge, or use Write or Guided mode.
        </p>
        <button
          onClick={() => setScreen('mode-select')}
          className="mt-8 font-ui text-xs tracking-widest uppercase text-water-400/65 hover:text-water-300 transition-colors cursor-pointer"
        >
          ← Choose another mode
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col h-screen">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between px-6 md:px-12 py-6 shrink-0 flex-wrap gap-3"
      >
        <button
          onClick={() => { stopListening(); stopTTS(); setScreen('mode-select'); }}
          className="font-ui text-xs tracking-widest uppercase text-water-500/50 hover:text-water-400/70 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="font-ui text-[10px] tracking-wider uppercase text-water-500/50">
              Voice
            </span>
            <select
              value={ttsVoice}
              onChange={handleVoiceChange}
              className="font-ui text-xs bg-grove-900/40 border border-water-400/20 rounded-lg px-3 py-1.5 
                         text-water-200/90 focus:outline-none focus:border-water-400/40 cursor-pointer"
            >
              {TTS_VOICES.map((v) => (
                <option key={v.id} value={v.id} className="bg-grove-900 text-grove-100">
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          {messages.length > 0 && (
            <button
              onClick={handleFinish}
              className="font-ui text-xs tracking-widest uppercase text-water-400/65 hover:text-water-300 transition-colors cursor-pointer"
            >
              Finish →
            </button>
          )}
        </div>
      </motion.div>

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 max-w-2xl mx-auto w-full py-4">
        {messages.length === 0 && !displayTranscript && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-body text-lg text-water-500/45 italic text-center mt-20"
          >
            Tap the mic and say what's on your mind. I'll listen and respond.
          </motion.p>
        )}

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={msg.role === 'user' ? 'text-right' : 'text-left'}
              >
                {msg.role === 'user' ? (
                  <p className="font-body text-base text-grove-200/85 leading-relaxed inline-block max-w-[85%]">
                    {msg.content}
                  </p>
                ) : (
                  <p className="font-body text-base text-water-200/90 leading-relaxed inline-block max-w-[90%] border-l-2 border-water-400/30 pl-4">
                    {msg.content}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Live transcript while speaking */}
          {displayTranscript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-right"
            >
              <p className="font-body text-base text-grove-200/70 leading-relaxed inline-block max-w-[85%]">
                {transcript}
                {interimTranscript && (
                  <span className="text-water-400/50 italic"> {interimTranscript}</span>
                )}
              </p>
            </motion.div>
          )}

          {/* AI is typing / speaking indicator */}
          {(aiLoading || isPlaying) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-left flex items-center gap-2"
            >
              <span className="font-ui text-[10px] tracking-wider uppercase text-water-500/50">
                {aiLoading ? 'Thinking...' : 'Speaking...'}
              </span>
              <div className="flex gap-1 items-end h-4">
                {[0, 1, 2, 3, 4].map((j) => (
                  <motion.span
                    key={j}
                    className="w-1 rounded-full bg-water-400/60 min-h-[4px]"
                    animate={{
                      height: ['6px', '16px', '6px'],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: j * 0.12,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mic + Finish area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-3 pb-10 pt-4 shrink-0"
      >
        <button
          onClick={handleMicPress}
          disabled={!canUseMic}
          className="relative cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full bg-water-400/25 pulse-ring" />
              <span
                className="absolute inset-0 rounded-full bg-water-400/12 pulse-ring"
                style={{ animationDelay: '0.5s' }}
              />
            </>
          )}
          <div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
              ${isListening
                ? 'bg-water-400/35 border-2 border-water-400/55'
                : 'bg-grove-900/40 border border-water-400/25 hover:border-water-400/45'
              }`}
          >
            {isListening ? (
              <div className="w-5 h-5 rounded-sm bg-water-300/85" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-water-400/70">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            )}
          </div>
        </button>
        <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-water-500/40">
          {isListening ? 'Tap to send' : 'Tap to speak'}
        </span>
      </motion.div>
    </div>
  );
}
