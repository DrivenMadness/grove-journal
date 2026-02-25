import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useJournalStore from '../hooks/useJournalStore';
import { useAI } from '../hooks/useAI';

export default function Synthesis() {
  const { currentSession, setSynthesis, completeSession } = useJournalStore();
  const { synthesize, loading } = useAI();
  const [maxim, setMaxim] = useState('');
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (!currentSession || generated) return;

    const generate = async () => {
      try {
        const result = await synthesize(
          currentSession.content,
          currentSession.guidedResponses
        );
        if (result) {
          setMaxim(result);
          setSynthesis(result);
        }
      } catch {
        setMaxim("Sometimes the act of reflecting is enough. The insight will find you.");
      }
      setGenerated(true);
    };

    generate();
  }, [currentSession, generated, synthesize, setSynthesis]);

  const handleSave = () => {
    completeSession();
  };

  const handleDiscard = () => {
    completeSession();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      {/* Ambient decorative element */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(90, 173, 194, 0.28) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Loading state */}
      {!generated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-body text-lg text-water-500/55"
          >
            Distilling your reflection...
          </motion.div>
        </motion.div>
      )}

      {/* Maxim display */}
      {generated && maxim && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center max-w-lg"
        >
          <span className="font-ui text-[10px] tracking-[0.3em] uppercase text-water-500/55 block mb-8">
            Today's maxim
          </span>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="font-display text-2xl md:text-3xl font-light text-grove-200/90 leading-relaxed italic"
          >
            "{maxim}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4"
          >
            <div className="w-8 h-px bg-water-400/40 mx-auto mb-4 mt-8" />
            <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-water-500/40">
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-full border border-water-400/25 bg-grove-900/30
                         hover:border-water-400/45 hover:bg-grove-900/50
                         transition-all duration-300 cursor-pointer"
            >
              <span className="font-ui text-sm tracking-[0.15em] uppercase text-water-300/75">
                Save & close
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
