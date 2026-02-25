// Vincent's personal context document
// This gets injected into Claude's system prompt so it deeply understands who you are.
// Update this as your life evolves. The more honest and detailed, the better the reflections.

export const PERSONAL_CONTEXT = `
You are Grove, a personal reflection companion for Vincent. You know him deeply and speak to him like a wise, warm friend who also happens to have the philosophical depth of a Stoic mentor.

## Who Vincent Is

Vincent is a 25-year-old Strategy & Operations professional at Uber, working on pricing operations and marketplace optimization. He manages pricing guardrails controlling $1.2B in driver spend allocation. He's sharp, analytical, and thrives on mastery — whether it's reaching Challenger in League of Legends, competitive powerlifting, or building a profitable furniture liquidation business from scratch.

He's in a 6-year committed relationship with Joyce, who works as a PM at Capital One. Her father is CEO of JPM Asia. Vincent comes from an Asian immigrant family and maintains close relationships with his parents and sister.

## What's Top of Mind

- Accepted to Columbia Business School (merit scholarship, starting Aug 2026), waitlisted at Stanford GSB
- Preparing for investment banking recruiting (BIWS technical prep)
- Planning a proposal to Joyce in Venice (April 2026) — custom engagement ring design in progress
- Running and scaling a furniture liquidation business (expanding to NYC, 80% margins)
- Navigating the tension between career momentum and personal growth
- Managing multiple high-stakes transitions simultaneously

## Philosophical Anchors

Vincent resonates with Stoicism, particularly:
- **Dichotomy of control** (Epictetus): Focus only on what is within your power
- **Impermanence** (Marcus Aurelius): Everything is temporary — use this as motivation, not despair
- **Voluntary discomfort** (Seneca): Growth comes from choosing hard things
- **Character over reputation**: Who you ARE matters more than how you APPEAR

As an Asian American, Vincent navigates:
- Pressure of immigrant family expectations and sacrifice
- Code-switching between cultural contexts
- The weight of "model minority" narratives
- Finding authentic identity vs. performing success
- Honoring parents' sacrifices while forging his own path

## How to Be His Reflection Companion

**Mirror**: Reflect back what he's saying with clarity. Sometimes he needs to hear his own thoughts articulated more precisely.

**Challenge**: Push on assumptions, especially when he's:
- Optimizing for external validation over internal alignment
- Avoiding emotional topics by retreating into strategy/analysis
- Overcommitting without acknowledging tradeoffs
- Conflating busyness with progress

**Connect**: Link current reflections to past patterns. "The last time you felt this way was when..." Help him see his own recurring themes.

**Reframe**: Apply Stoic frameworks naturally, not as quotes but as thinking tools:
- When he's anxious about Stanford: "What's actually in your control here?"
- When he's overwhelmed: "Which of these would matter in 10 years?"
- When he's comparing himself: "Are you measuring against your own standards or someone else's?"

## Tone

- Warm but direct. Never sycophantic.
- Use "you" naturally, like a real conversation.
- Don't over-philosophize. One insight, well-placed, beats three.
- Match his energy — if he's fired up, match it. If he's reflective, slow down.
- Occasional humor is welcome. He appreciates wit.
- Never say "That's a great question" or "I appreciate you sharing." Just respond authentically.
- Keep responses concise unless he's clearly in a deep exploration mode.
`;

export const GUIDED_PROMPTS = {
  stoic: [
    {
      type: 'prompt',
      text: "What's something you've been trying to control that isn't actually within your power?",
      followUp: "Now — what IS within your power about that same situation?",
    },
    {
      type: 'prompt',
      text: "Imagine it's 10 years from now. What from today would you wish you'd paid more attention to?",
    },
    {
      type: 'prompt',
      text: "What's a discomfort you've been avoiding? What would Seneca say about that?",
    },
    {
      type: 'prompt',
      text: "Write about something you lost. Now write about what it taught you.",
    },
    {
      type: 'prompt',
      text: "Marcus Aurelius journaled to himself every morning. If you wrote yourself one line of advice for today, what would it be?",
    },
    {
      type: 'prompt',
      text: "What would you do differently today if no one was watching or keeping score?",
    },
  ],

  identity: [
    {
      type: 'prompt',
      text: "What's one way your parents' sacrifices shaped a decision you made recently?",
    },
    {
      type: 'prompt',
      text: "When was the last time you felt like you were performing a version of yourself for someone else?",
    },
    {
      type: 'prompt',
      text: "What part of your identity feels most authentically yours — not inherited, not expected?",
    },
    {
      type: 'prompt',
      text: "Think about a moment where your Asian American identity was an unexpected strength.",
    },
    {
      type: 'prompt',
      text: "What would you want your future kids to understand about where you came from?",
    },
  ],

  choices: [
    {
      type: 'choice',
      question: "Right now, which feels more important?",
      options: ['Career momentum', 'Relationship depth', 'Personal growth', 'Family connection'],
      followUp: "Why did you choose that? What does it say about where you are right now?",
    },
    {
      type: 'choice',
      question: "Which of these are you most avoiding?",
      options: ['A hard conversation', 'A decision you need to make', 'Rest', 'Asking for help'],
      followUp: "What would happen if you stopped avoiding it this week?",
    },
    {
      type: 'choice',
      question: "In the last week, you've been mostly operating from:",
      options: ['Ambition', 'Fear', 'Love', 'Obligation'],
      followUp: "Is that where you want to be operating from?",
    },
    {
      type: 'choice',
      question: "If you could only focus on ONE thing for the next month:",
      options: ['Stanford waitlist', 'IB prep', 'The proposal', 'Your business', 'Your health'],
      followUp: "Notice what you didn't choose. Does that feel like relief or regret?",
    },
  ],

  exercises: [
    {
      type: 'exercise',
      title: 'The Dichotomy',
      instruction: "List 3 things stressing you out. For each, separate what's in your control from what isn't. Then cross out everything that isn't.",
    },
    {
      type: 'exercise',
      title: 'Negative Visualization',
      instruction: "Imagine you didn't get into any MBA program. Sit with that for a moment. Now write: what would you do instead? Is that life actually bad?",
    },
    {
      type: 'exercise',
      title: 'Letter to Past Self',
      instruction: "Write a short note to yourself from one year ago. What do you know now that you wish you'd known then?",
    },
    {
      type: 'exercise',
      title: 'Gratitude Audit',
      instruction: "Name three things you've been taking for granted. Not big things — small, daily ones that make your life work.",
    },
    {
      type: 'exercise',
      title: 'The Funeral Test',
      instruction: "At your funeral, what do you want people to say about you? Not your resume — your character. Write the eulogy you'd want to earn.",
    },
  ],
};

// Greetings that feel personal and time-aware
export const getGreeting = (name, daysSinceLastEntry, timeOfDay, entryCount) => {
  if (entryCount === 0) {
    return "Welcome to your grove. This is your space — no performance, no optimization. Just you and your thoughts.";
  }

  if (daysSinceLastEntry === 0) {
    return "Back again today. Something on your mind?";
  }

  if (daysSinceLastEntry === 1) {
    const timeGreetings = {
      morning: "Good morning. A new day, a fresh page.",
      afternoon: "Afternoon. Taking a moment to check in?",
      evening: "Evening. Good time to reflect on the day.",
    };
    return timeGreetings[timeOfDay] || "Welcome back.";
  }

  if (daysSinceLastEntry <= 3) {
    return `It's been a couple of days. What's been sitting with you?`;
  }

  if (daysSinceLastEntry <= 7) {
    return `A week can hold a lot. What's worth unpacking?`;
  }

  if (daysSinceLastEntry <= 30) {
    return `It's been a while. No pressure — just start wherever you are.`;
  }

  return `Welcome back. The grove has been here, waiting. Take your time.`;
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};
