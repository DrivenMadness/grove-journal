import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useJournalStore from '../hooks/useJournalStore';
import { useAI } from '../hooks/useAI';

export default function WriteMode() {
  const { currentSession, updateSessionContent, addAIMessage, setScreen } = useJournalStore();
  const { reflect, loading } = useAI();
  const [content, setContent] = useState(currentSession?.content || '');
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const textareaRef = useRef(null);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    updateSessionContent(content);
  }, [content, updateSessionContent]);

  const handleReflect = async () => {
    if (!content.trim() || loading) return;
    setShowAI(true);

    try {
      const response = await reflect(content, conversationHistory);
      setAiResponse(response);
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', content },
        { role: 'assistant', content: response },
      ]);
      addAIMessage({ role: 'assistant', content: response });
    } catch (err) {
      setAiResponse('Something went wrong. Keep writing — your thoughts are what matter.');
    }
  };

  const handleFinish = () => {
    setScreen('synthesis');
  };

  return (
    <div className="relative z-10 flex flex-col h-screen">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between px-6 md:px-12 py-6"
      >
        <button
          onClick={() => setScreen('mode-select')}
          className="font-ui text-xs tracking-widest uppercase text-water-500/50 
                     hover:text-water-400/70 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex items-center gap-6">
          <span className="font-ui text-xs text-water-500/40">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          {content.trim().length > 20 && (
            <button
              onClick={handleFinish}
              className="font-ui text-xs tracking-widest uppercase text-water-400/65 
                         hover:text-water-300 transition-colors cursor-pointer"
            >
              Finish →
            </button>
          )}
        </div>
      </motion.div>

      {/* Writing area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`flex-1 px-6 md:px-16 lg:px-24 py-4 overflow-y-auto ${
            showAI ? 'md:w-3/5' : 'w-full'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start wherever you are..."
            className="journal-textarea min-h-[60vh]"
          />
        </motion.div>

        {/* AI reflection panel */}
        <AnimatePresence>
          {showAI && aiResponse && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              className="md:w-2/5 px-6 md:px-8 py-4 border-l border-water-400/15 overflow-y-auto"
            >
              <div className="mb-4">
                <span className="font-ui text-[10px] tracking-[0.3em] uppercase text-water-500/50">
                  Reflection
                </span>
              </div>
              <p className="font-body text-base text-grove-200/75 leading-relaxed">
                {aiResponse}
              </p>
              <button
                onClick={() => setShowAI(false)}
                className="mt-6 font-ui text-xs text-water-500/40 hover:text-water-400/60 
                           transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-4 px-6 py-6"
      >
        {content.trim().length > 50 && !showAI && (
          <button
            onClick={handleReflect}
            disabled={loading}
            className="px-6 py-2.5 rounded-full border border-water-400/25 
                       bg-grove-900/30 backdrop-blur-sm
                       hover:border-water-400/45 hover:bg-grove-900/50
                       transition-all duration-300 cursor-pointer
                       disabled:opacity-30"
          >
            <span className="font-ui text-xs tracking-[0.15em] uppercase text-water-300/75">
              {loading ? 'Reflecting...' : 'Get reflection'}
            </span>
          </button>
        )}
      </motion.div>
    </div>
  );
}
