import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useJournalStore from '../hooks/useJournalStore';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useAI } from '../hooks/useAI';

export default function SpeakMode() {
  const { updateSessionContent, addAIMessage, setScreen } = useJournalStore();
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechToText();
  const { reflect, loading } = useAI();
  const [aiResponse, setAiResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  const fullText = transcript + (interimTranscript ? ` ${interimTranscript}` : '');
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    updateSessionContent(fullText);
  }, [fullText, updateSessionContent]);

  const handleReflect = async () => {
    if (!transcript.trim() || loading) return;
    stopListening();

    try {
      const response = await reflect(transcript, conversationHistory);
      setAiResponse(response);
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', content: transcript },
        { role: 'assistant', content: response },
      ]);
      addAIMessage({ role: 'assistant', content: response });
    } catch {
      setAiResponse('Something went wrong. Your words still matter.');
    }
  };

  if (!isSupported) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6">
        <p className="font-body text-lg text-grove-200/70 text-center max-w-md">
          Voice input isn't supported in this browser. Try Chrome or Edge, or switch to Write mode.
        </p>
        <button
          onClick={() => setScreen('mode-select')}
          className="mt-8 font-ui text-xs tracking-widest uppercase text-water-400/65 
                     hover:text-water-300 transition-colors cursor-pointer"
        >
          ← Choose another mode
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col items-center h-screen">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full flex items-center justify-between px-6 md:px-12 py-6"
      >
        <button
          onClick={() => {
            stopListening();
            setScreen('mode-select');
          }}
          className="font-ui text-xs tracking-widest uppercase text-water-500/50 
                     hover:text-water-400/70 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex items-center gap-6">
          <span className="font-ui text-xs text-water-500/40">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          {transcript.trim().length > 20 && (
            <button
              onClick={() => {
                stopListening();
                setScreen('synthesis');
              }}
              className="font-ui text-xs tracking-widest uppercase text-water-400/65 
                         hover:text-water-300 transition-colors cursor-pointer"
            >
              Finish →
            </button>
          )}
        </div>
      </motion.div>

      {/* Transcript area */}
      <div className="flex-1 w-full max-w-2xl px-6 md:px-12 py-8 overflow-y-auto">
        {fullText ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-body text-lg text-grove-200/80 leading-relaxed"
          >
            {transcript}
            {interimTranscript && (
              <span className="text-water-400/45 italic"> {interimTranscript}</span>
            )}
          </motion.p>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-body text-lg text-water-500/40 italic text-center mt-20"
          >
            {isListening ? 'Listening...' : 'Tap the circle to start speaking'}
          </motion.p>
        )}

        {/* AI Response */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 pt-8 border-t border-water-400/15"
            >
              <span className="font-ui text-[10px] tracking-[0.3em] uppercase text-water-500/50 block mb-3">
                Reflection
              </span>
              <p className="font-body text-base text-grove-200/75 leading-relaxed">
                {aiResponse}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recording controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-4 pb-12"
      >
        {/* Main record button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className="relative cursor-pointer"
        >
          {/* Pulse rings when recording */}
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
            className={`relative w-16 h-16 rounded-full flex items-center justify-center 
                        transition-all duration-300
                        ${
                          isListening
                            ? 'bg-water-400/35 border-2 border-water-400/55'
                            : 'bg-grove-900/40 border border-water-400/25 hover:border-water-400/45'
                        }`}
          >
            {isListening ? (
              <div className="w-5 h-5 rounded-sm bg-water-300/85" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-water-400/65" />
            )}
          </div>
        </button>

        <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-water-500/40">
          {isListening ? 'Tap to pause' : 'Tap to speak'}
        </span>

        {/* Reflect button */}
        {transcript.trim().length > 50 && !isListening && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleReflect}
            disabled={loading}
            className="mt-2 px-6 py-2.5 rounded-full border border-water-400/25 
                       bg-grove-900/30 hover:border-water-400/45
                       transition-all duration-300 cursor-pointer disabled:opacity-30"
          >
            <span className="font-ui text-xs tracking-[0.15em] uppercase text-water-300/75">
              {loading ? 'Reflecting...' : 'Get reflection'}
            </span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
