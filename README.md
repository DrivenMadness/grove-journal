# Grove — A Personal Reflection Journal

A deeply personal journaling app designed for Vincent. Built around Stoic philosophy, self-exploration, and friction-free reflection.

## Philosophy
- **Friction-free entry**: Open → greeted by nature → start reflecting in seconds
- **Three modes**: Write, Speak, or Guided (AI-prompted)
- **AI-powered**: Claude knows your context, mirrors patterns, challenges assumptions, reframes through Stoic philosophy
- **Pattern recognition**: Surfaces past entries, detects emotional patterns, connects themes over time
- **Synthesis**: Every session ends with a single takeaway — your growing collection of personal maxims

## Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS
- **AI**: Claude API (Anthropic) — conversational, context-aware
- **Voice**: Web Speech API (browser-native) for speech-to-text
- **Storage**: localStorage for entries + personal context (single-user app)
- **Deployment**: Vercel or any static host

## Architecture

```
src/
├── components/
│   ├── WelcomeScreen.jsx      # Wooded landscape greeting
│   ├── ModeSelector.jsx        # Write / Speak / Guided
│   ├── WriteMode.jsx           # Minimal distraction-free editor
│   ├── SpeakMode.jsx           # Voice transcription interface
│   ├── GuidedMode.jsx          # AI-prompted reflection (prompts, choices, exercises)
│   ├── Synthesis.jsx           # End-of-session insight + maxim
│   ├── PastEntries.jsx         # Timeline of past reflections
│   ├── InsightsDashboard.jsx   # Pattern recognition, emotional map
│   └── NatureBackground.jsx    # Animated nature scene (CSS/SVG)
├── hooks/
│   ├── useSpeechToText.js      # Web Speech API hook
│   ├── useJournalStore.js      # Entry CRUD + localStorage persistence
│   └── useAI.js                # Claude API integration
├── utils/
│   ├── prompts.js              # System prompts, guided mode templates
│   └── patterns.js             # Entry analysis, theme extraction
├── contexts/
│   └── JournalContext.jsx      # Global state provider
├── data/
│   └── vincent-context.js      # Personal context document for Claude
├── App.jsx
├── main.jsx
└── index.css                   # Tailwind + custom nature theme
```

## Setup

```bash
npm install
```

Create a `.env` file:
```
VITE_ANTHROPIC_API_KEY=your-claude-api-key
```

```bash
npm run dev
```

## Key Design Decisions

1. **Single-user, no auth** — This is Vincent's personal tool. No login, no accounts.
2. **Local-first storage** — Entries stay on device. Export to JSON for backup.
3. **AI context bootstrapping** — Rather than learning from scratch, Claude gets a rich personal context document upfront. Entries refine understanding over time.
4. **Session-based flow** — Open → Reflect → Synthesize → Close. Not a feed, not infinite scroll.
5. **Nature UI** — Deep greens, earth tones, flowing water animations. The aesthetic IS the experience.

## Guided Mode Rotation

The app rotates through these reflection formats:
- **Open Prompts**: "What's one thing you're avoiding thinking about?"
- **Forced Choices**: "Which matters more right now: career momentum or relationship depth?"
- **Stoic Exercises**: Dichotomy of control, negative visualization, memento mori
- **Identity Reflections**: Asian American experience, family sacrifice, cultural navigation
- **Pattern Callbacks**: "3 months ago you wrote about X. How do you feel about it now?"

## Future Enhancements
- [ ] Whisper API for better voice transcription
- [ ] Entry embeddings for semantic search across journal
- [ ] Weekly/monthly synthesis emails
- [ ] Mobile PWA with offline support
- [ ] Export to markdown/PDF
