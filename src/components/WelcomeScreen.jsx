import { motion } from 'framer-motion';
import useJournalStore from '../hooks/useJournalStore';
import { getGreeting, getTimeOfDay } from '../data/vincent-context';

export default function WelcomeScreen() {
  const { setScreen, totalEntries, getDaysSinceLastEntry, currentStreak, getMostRecentSynthesis } = useJournalStore();
  const daysSince = getDaysSinceLastEntry();
  const greeting = getGreeting('Vincent', daysSince, getTimeOfDay(), totalEntries);
  const lastMaxim = getMostRecentSynthesis();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      {/* Subtle streak indicator */}
      {currentStreak > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute top-8 right-8"
        >
          <span className="font-ui text-xs tracking-widest uppercase text-grove-400/40">
            {currentStreak} day streak
          </span>
        </motion.div>
      )}

      {/* Logo / Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center"
      >
        <h1 className="font-display text-6xl md:text-7xl font-light tracking-wide text-grove-200/90 mb-2">
          Grove
        </h1>
        <div className="w-12 h-px bg-grove-400/30 mx-auto mb-8" />
      </motion.div>

      {/* Personalized greeting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-center max-w-md mb-16"
      >
        <p className="font-body text-lg md:text-xl text-grove-300/70 leading-relaxed">
          {greeting}
        </p>
        {lastMaxim && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-body text-sm text-grove-500/50 italic mt-4 leading-relaxed"
          >
            {lastMaxim}
          </motion.p>
        )}
      </motion.div>

      {/* Enter button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setScreen('mode-select')}
        className="group relative px-10 py-4 rounded-full border border-grove-400/20 
                   bg-grove-900/30 backdrop-blur-sm
                   hover:border-grove-400/40 hover:bg-grove-900/50
                   transition-all duration-500 cursor-pointer"
      >
        <span className="font-ui text-sm tracking-[0.2em] uppercase text-grove-300/80 group-hover:text-grove-200">
          Begin
        </span>
      </motion.button>

      {/* History link */}
      {totalEntries > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onClick={() => setScreen('history')}
          className="mt-8 font-ui text-xs tracking-widest uppercase text-grove-500/40 
                     hover:text-grove-400/60 transition-colors cursor-pointer"
        >
          Past reflections ({totalEntries})
        </motion.button>
      )}

      {/* Time of day ambient text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <span className="font-ui text-[10px] tracking-[0.3em] uppercase text-grove-600/30">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </motion.div>
    </div>
  );
}
