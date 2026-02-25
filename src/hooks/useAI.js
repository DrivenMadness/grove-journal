import { useState, useCallback } from 'react';
import { PERSONAL_CONTEXT } from '../data/vincent-context';
import useJournalStore from './useJournalStore';

const ANTHROPIC_API_URL = '/api/v1/messages';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getRecentEntries = useJournalStore((s) => s.getRecentEntries);

  const buildSystemPrompt = useCallback(() => {
    const recentEntries = getRecentEntries(5);
    const entrySummaries = recentEntries.map((entry) => {
      const date = new Date(entry.startedAt).toLocaleDateString();
      const preview = entry.content?.slice(0, 300) || 'Guided session';
      const synthesis = entry.synthesis || '';
      return `[${date}] ${preview}${synthesis ? ` → Synthesis: ${synthesis}` : ''}`;
    });

    return `${PERSONAL_CONTEXT}

## Recent Journal Entries (for context)
${entrySummaries.length > 0 ? entrySummaries.join('\n\n') : 'No previous entries yet. This is the beginning.'}

## Instructions for This Response
- Keep responses concise (2-4 sentences unless deeper exploration is warranted)
- Don't lecture. One good question beats three observations.
- If synthesizing a session, distill into ONE powerful sentence — a personal maxim.
- Never start with "That's a great..." or "I appreciate..." — just respond.
`;
  }, [getRecentEntries]);

  const sendMessage = useCallback(
    async (messages, { maxTokens = 1024 } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(ANTHROPIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: maxTokens,
            system: buildSystemPrompt(),
            messages,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.content?.[0]?.text || '';
        setLoading(false);
        return text;
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    [buildSystemPrompt]
  );

  // Generate a synthesis from session content
  const synthesize = useCallback(
    async (sessionContent, guidedResponses = []) => {
      const allContent = [
        sessionContent,
        ...guidedResponses.map((r) => `Q: ${r.prompt}\nA: ${r.response}`),
      ]
        .filter(Boolean)
        .join('\n\n');

      if (!allContent.trim()) return null;

      const messages = [
        {
          role: 'user',
          content: `Here's what I journaled today:\n\n${allContent}\n\nDistill this into a single sentence — my takeaway, my maxim for today. Make it personal, specific to what I wrote, and something I'd actually want to remember. Don't explain it, just give me the sentence.`,
        },
      ];

      return sendMessage(messages, { maxTokens: 150 });
    },
    [sendMessage]
  );

  // Get a conversational AI response during guided/write mode
  const reflect = useCallback(
    async (userMessage, conversationHistory = []) => {
      const messages = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      return sendMessage(messages, { maxTokens: 512 });
    },
    [sendMessage]
  );

  // Generate a guided prompt based on recent patterns
  const generatePrompt = useCallback(async () => {
    const messages = [
      {
        role: 'user',
        content:
          "Based on what you know about me and my recent entries, give me one thoughtful journaling prompt. Just the prompt, nothing else. Make it specific to what I'm going through, not generic.",
      },
    ];

    return sendMessage(messages, { maxTokens: 200 });
  }, [sendMessage]);

  return {
    sendMessage,
    synthesize,
    reflect,
    generatePrompt,
    loading,
    error,
  };
}
