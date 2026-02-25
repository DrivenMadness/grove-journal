import { motion } from 'framer-motion';
import useJournalStore from '../hooks/useJournalStore';

const modes = [
  {
    id: 'write',
    label: 'Write',
    description: 'Free-form reflection',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
  },
  {
    id: 'speak',
    label: 'Speak',
    description: 'Voice your thoughts',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
  },
  {
    id: 'guided',
    label: 'Guided',
    description: 'Prompted exploration',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
];

export default function ModeSelector() {
  const { startSession, setScreen } = useJournalStore();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setScreen('welcome')}
        className="absolute top-8 left-8 font-ui text-xs tracking-widest uppercase text-grove-500/40 
                   hover:text-grove-400/60 transition-colors cursor-pointer"
      >
        ← Back
      </motion.button>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display text-2xl md:text-3xl font-light text-grove-200/80 mb-12"
      >
        How do you want to reflect?
      </motion.p>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {modes.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => startSession(mode.id)}
            className="group relative flex flex-col items-center gap-4 
                       w-48 md:w-52 py-10 px-6
                       rounded-2xl border border-grove-400/15 
                       bg-grove-900/20 backdrop-blur-sm
                       hover:border-grove-400/30 hover:bg-grove-900/40
                       transition-all duration-500 cursor-pointer"
          >
            <div className="text-grove-400/60 group-hover:text-grove-300/80 transition-colors">
              {mode.icon}
            </div>
            <div className="text-center">
              <p className="font-ui text-sm tracking-[0.15em] uppercase text-grove-200/80 group-hover:text-grove-100 mb-1">
                {mode.label}
              </p>
              <p className="font-body text-xs text-grove-400/40 group-hover:text-grove-400/60">
                {mode.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
