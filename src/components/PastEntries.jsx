import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useJournalStore from '../hooks/useJournalStore';

export default function PastEntries() {
  const { entries, setScreen, deleteEntry, exportEntries } = useJournalStore();
  const [expandedId, setExpandedId] = useState(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getPreview = (entry) => {
    if (entry.content) {
      return entry.content.slice(0, 120) + (entry.content.length > 120 ? '...' : '');
    }
    if (entry.guidedResponses?.length > 0) {
      return entry.guidedResponses[0].response?.slice(0, 120) + '...';
    }
    return 'Guided reflection';
  };

  const getModeLabel = (mode) => {
    const labels = { write: 'Written', speak: 'Spoken', guided: 'Guided' };
    return labels[mode] || mode;
  };

  return (
    <div className="relative z-10 flex flex-col h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between px-6 md:px-12 py-6"
      >
        <button
          onClick={() => setScreen('welcome')}
          className="font-ui text-xs tracking-widest uppercase text-water-500/50 
                     hover:text-water-400/70 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <span className="font-ui text-xs text-water-500/40">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
          {entries.length > 0 && (
            <button
              onClick={exportEntries}
              className="font-ui text-xs tracking-widest uppercase text-water-500/50 
                         hover:text-water-400/70 transition-colors cursor-pointer"
            >
              Export
            </button>
          )}
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-24 pb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-light text-grove-200/85 mb-8"
        >
          Past Reflections
        </motion.h2>

        {entries.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-body text-lg text-water-500/50 italic"
          >
            No entries yet. Your reflections will appear here.
          </motion.p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-water-400/15 rounded-xl overflow-hidden
                           bg-grove-900/20 backdrop-blur-sm hover:border-water-400/25
                           transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                  className="w-full text-left px-6 py-4 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Synthesis / maxim */}
                      {entry.synthesis && (
                        <p className="font-display text-base text-grove-200/75 italic mb-2 truncate">
                          "{entry.synthesis}"
                        </p>
                      )}
                      {/* Preview */}
                      <p className="font-body text-sm text-water-500/55 line-clamp-2">
                        {getPreview(entry)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="font-ui text-xs text-water-400/55">
                        {formatDate(entry.startedAt)}
                      </span>
                      <span className="font-ui text-[10px] text-water-500/40">
                        {formatTime(entry.startedAt)}
                      </span>
                      <span className="font-ui text-[10px] tracking-wider uppercase text-water-500/35">
                        {getModeLabel(entry.mode)}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedId === entry.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 border-t border-water-400/10">
                        {entry.content && (
                          <p className="font-body text-sm text-grove-200/65 leading-relaxed mt-4 whitespace-pre-wrap">
                            {entry.content}
                          </p>
                        )}

                        {entry.guidedResponses?.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {entry.guidedResponses.map((gr, i) => (
                              <div key={i}>
                                <p className="font-ui text-xs text-water-500/50 mb-1">
                                  {gr.prompt}
                                </p>
                                <p className="font-body text-sm text-grove-200/65">
                                  {gr.response}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {entry.aiMessages?.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-water-400/10">
                            <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-water-500/45 block mb-2">
                              AI Reflections
                            </span>
                            {entry.aiMessages.map((msg, i) => (
                              <p
                                key={i}
                                className="font-body text-xs text-water-500/50 italic mb-2"
                              >
                                {msg.content}
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  'Delete this entry? This cannot be undone.'
                                )
                              ) {
                                deleteEntry(entry.id);
                              }
                            }}
                            className="font-ui text-[10px] tracking-widest uppercase text-red-400/30 
                                       hover:text-red-400/60 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
