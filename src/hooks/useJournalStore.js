import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useJournalStore = create(
  persist(
    (set, get) => ({
      // Entries
      entries: [],
      
      // Current session
      currentSession: null,
      sessionMode: null, // 'write' | 'speak' | 'guided'
      
      // App state
      screen: 'welcome', // 'welcome' | 'mode-select' | 'session' | 'synthesis' | 'history'
      
      // Stats
      totalEntries: 0,
      currentStreak: 0,
      longestStreak: 0,

      // Actions
      setScreen: (screen) => set({ screen }),
      
      startSession: (mode) => set({
        currentSession: {
          id: Date.now().toString(),
          mode,
          startedAt: new Date().toISOString(),
          content: '',
          guidedResponses: [],
          aiMessages: [],
          mood: null,
          synthesis: null,
        },
        sessionMode: mode,
        screen: 'session',
      }),

      updateSessionContent: (content) => set((state) => ({
        currentSession: state.currentSession
          ? { ...state.currentSession, content }
          : null,
      })),

      addGuidedResponse: (response) => set((state) => ({
        currentSession: state.currentSession
          ? {
              ...state.currentSession,
              guidedResponses: [...state.currentSession.guidedResponses, response],
            }
          : null,
      })),

      addAIMessage: (message) => set((state) => ({
        currentSession: state.currentSession
          ? {
              ...state.currentSession,
              aiMessages: [...state.currentSession.aiMessages, message],
            }
          : null,
      })),

      setSynthesis: (synthesis) => set((state) => ({
        currentSession: state.currentSession
          ? { ...state.currentSession, synthesis }
          : null,
      })),

      completeSession: () => {
        const state = get();
        if (!state.currentSession) return;

        const entry = {
          ...state.currentSession,
          completedAt: new Date().toISOString(),
        };

        const entries = [entry, ...state.entries];
        const streak = calculateStreak(entries);

        set({
          entries,
          currentSession: null,
          sessionMode: null,
          screen: 'welcome',
          totalEntries: entries.length,
          currentStreak: streak.current,
          longestStreak: Math.max(streak.current, state.longestStreak),
        });
      },

      discardSession: () => set({
        currentSession: null,
        sessionMode: null,
        screen: 'welcome',
      }),

      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((e) => e.id !== id),
        totalEntries: state.entries.length - 1,
      })),

      getLastEntryDate: () => {
        const entries = get().entries;
        if (entries.length === 0) return null;
        return new Date(entries[0].completedAt || entries[0].startedAt);
      },

      getDaysSinceLastEntry: () => {
        const lastDate = get().getLastEntryDate();
        if (!lastDate) return null;
        const now = new Date();
        const diff = now - lastDate;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
      },

      // Get recent entries for AI context
      getRecentEntries: (count = 5) => {
        return get().entries.slice(0, count);
      },

      // Most recent session synthesis (for welcome screen)
      getMostRecentSynthesis: () => {
        const entries = get().entries;
        if (entries.length === 0) return null;
        const last = entries[0];
        return last.synthesis?.trim() || null;
      },

      // Past maxims (syntheses) from older entries — for weaving into guided prompts (excludes most recent)
      getPastMaxims: () => {
        return get().entries
          .slice(1)
          .map((e) => e.synthesis?.trim())
          .filter(Boolean);
      },

      // Export all entries as JSON
      exportEntries: () => {
        const entries = get().entries;
        const blob = new Blob([JSON.stringify(entries, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grove-journal-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    }),
    {
      name: 'grove-journal-storage',
      version: 1,
    }
  )
);

// Helper: calculate current streak
function calculateStreak(entries) {
  if (entries.length === 0) return { current: 0 };

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastEntry = new Date(entries[0].completedAt || entries[0].startedAt);
  lastEntry.setHours(0, 0, 0, 0);

  const diffFromToday = Math.floor((today - lastEntry) / (1000 * 60 * 60 * 24));
  if (diffFromToday > 1) return { current: 0 };

  for (let i = 1; i < entries.length; i++) {
    const current = new Date(entries[i - 1].completedAt || entries[i - 1].startedAt);
    const prev = new Date(entries[i].completedAt || entries[i].startedAt);
    current.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);

    const diff = Math.floor((current - prev) / (1000 * 60 * 60 * 24));
    if (diff <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return { current: streak };
}

export default useJournalStore;
