import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useJournalStore from '../hooks/useJournalStore';
import { useAI } from '../hooks/useAI';
import { GUIDED_PROMPTS } from '../data/vincent-context';

function getRandomPrompt() {
  const categories = ['stoic', 'identity', 'choices', 'exercises'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const prompts = GUIDED_PROMPTS[category];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  return { ...prompt, category };
}

const MAXIM_WEAVE_CHANCE = 0.3; // ~30% of prompts get an older maxim woven in

function maybeAddMaxim(promptObj, pastMaxims) {
  if (!promptObj || pastMaxims.length === 0 || Math.random() > MAXIM_WEAVE_CHANCE) return promptObj;
  const maxim = pastMaxims[Math.floor(Math.random() * pastMaxims.length)];
  return {
    ...promptObj,
    maximSuffix: `You once told yourself: "${maxim}". Does that still feel true?`,
  };
}

export default function GuidedMode() {
  const { addGuidedResponse, updateSessionContent, setScreen, getPastMaxims } = useJournalStore();
  const { reflect, generatePrompt, loading } = useAI();
  const pastMaxims = getPastMaxims();
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [aiReflection, setAiReflection] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [responses, setResponses] = useState([]);
  const [useAIPrompt, setUseAIPrompt] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Randomly decide: use preset prompt or AI-generated
    const useAI = Math.random() > 0.5;
    setUseAIPrompt(useAI);

    if (useAI) {
      loadAIPrompt();
    } else {
      setCurrentPrompt(maybeAddMaxim(getRandomPrompt(), pastMaxims));
    }
  }, []);

  const loadAIPrompt = async () => {
    try {
      const prompt = await generatePrompt();
      setCurrentPrompt(maybeAddMaxim({ type: 'prompt', text: prompt, category: 'ai-generated' }, pastMaxims));
    } catch {
      setCurrentPrompt(maybeAddMaxim(getRandomPrompt(), pastMaxims));
    }
  };

  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) return;

    const basePrompt = currentPrompt?.text || currentPrompt?.question;
    const fullPrompt = currentPrompt?.maximSuffix
      ? `${basePrompt}\n\n${currentPrompt.maximSuffix}`
      : basePrompt;
    const response = {
      prompt: fullPrompt,
      response: userResponse,
      timestamp: new Date().toISOString(),
    };

    addGuidedResponse(response);
    setResponses((prev) => [...prev, response]);

    // Update session content with all responses
    const allContent = [...responses, response]
      .map((r) => `Q: ${r.prompt}\nA: ${r.response}`)
      .join('\n\n');
    updateSessionContent(allContent);

    // Get AI reflection
    try {
      const reflection = await reflect(
        `I was asked: "${response.prompt}"\n\nMy response: ${response.response}`,
        []
      );
      setAiReflection(reflection);
    } catch {
      setAiReflection('');
    }

    // Show follow-up if available
    if (currentPrompt?.followUp) {
      setShowFollowUp(true);
    }
  };

  const handleNext = () => {
    setUserResponse('');
    setAiReflection('');
    setShowFollowUp(false);
    const useAI = Math.random() > 0.4;
    if (useAI) {
      loadAIPrompt();
    } else {
      setCurrentPrompt(maybeAddMaxim(getRandomPrompt(), pastMaxims));
    }
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleChoiceSelect = (choice) => {
    setUserResponse(choice);
    const fullPrompt = currentPrompt.maximSuffix
      ? `${currentPrompt.question}\n\n${currentPrompt.maximSuffix}`
      : currentPrompt.question;
    const response = {
      prompt: fullPrompt,
      response: choice,
      timestamp: new Date().toISOString(),
    };
    addGuidedResponse(response);
    setResponses((prev) => [...prev, response]);

    if (currentPrompt.followUp) {
      setShowFollowUp(true);
      setCurrentPrompt({
        type: 'prompt',
        text: currentPrompt.followUp,
        category: currentPrompt.category,
      });
      setUserResponse('');
    }
  };

  const renderPromptContent = () => {
    if (!currentPrompt) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-breathe font-body text-lg text-grove-400/40">
            Preparing your reflection...
          </div>
        </motion.div>
      );
    }

    if (currentPrompt.type === 'choice') {
      return (
        <motion.div
          key="choice"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-display text-2xl md:text-3xl font-light text-grove-200/80 mb-10 leading-relaxed">
            {currentPrompt.question}
          </p>
          {currentPrompt.maximSuffix && (
            <p className="font-body text-base text-grove-500/60 italic mb-10 leading-relaxed">
              {currentPrompt.maximSuffix}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            {currentPrompt.options.map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleChoiceSelect(option)}
                className="px-6 py-3 rounded-full border border-grove-400/20 bg-grove-900/30
                           hover:border-grove-400/40 hover:bg-grove-900/50
                           transition-all duration-300 cursor-pointer"
              >
                <span className="font-ui text-sm text-grove-300/70">{option}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      );
    }

    if (currentPrompt.type === 'exercise') {
      return (
        <motion.div
          key="exercise"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg mx-auto"
        >
          <span className="font-ui text-[10px] tracking-[0.3em] uppercase text-earth-400/60 block mb-4">
            Exercise — {currentPrompt.title}
          </span>
          <p className="font-display text-xl md:text-2xl font-light text-grove-200/80 leading-relaxed">
            {currentPrompt.instruction}
          </p>
          {currentPrompt.maximSuffix && (
            <p className="font-body text-base text-grove-500/60 italic mt-6 leading-relaxed">
              {currentPrompt.maximSuffix}
            </p>
          )}
        </motion.div>
      );
    }

    // Default: prompt type
    return (
      <motion.div
        key="prompt"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg mx-auto"
      >
        <span className="font-ui text-[10px] tracking-[0.3em] uppercase text-grove-500/40 block mb-4">
          {currentPrompt.category === 'ai-generated'
            ? 'Tailored for you'
            : currentPrompt.category}
        </span>
        <p className="font-display text-2xl md:text-3xl font-light text-grove-200/80 leading-relaxed">
          {currentPrompt.text}
        </p>
        {currentPrompt.maximSuffix && (
          <p className="font-body text-base text-grove-500/60 italic mt-6 leading-relaxed">
            {currentPrompt.maximSuffix}
          </p>
        )}
      </motion.div>
    );
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
          className="font-ui text-xs tracking-widest uppercase text-grove-500/40 
                     hover:text-grove-400/60 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        {responses.length > 0 && (
          <button
            onClick={() => setScreen('synthesis')}
            className="font-ui text-xs tracking-widest uppercase text-grove-400/60 
                       hover:text-grove-300 transition-colors cursor-pointer"
          >
            Finish →
          </button>
        )}
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Prompt display */}
          <div className="w-full max-w-2xl mb-10">{renderPromptContent()}</div>
        </AnimatePresence>

        {/* Response area (for non-choice prompts) */}
        {currentPrompt && currentPrompt.type !== 'choice' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-xl"
          >
            <textarea
              ref={textareaRef}
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Your thoughts..."
              className="journal-textarea min-h-[120px] max-h-[200px] text-center"
              rows={4}
            />

            <div className="flex justify-center gap-4 mt-6">
              {userResponse.trim() && !aiReflection && (
                <button
                  onClick={handleSubmitResponse}
                  disabled={loading}
                  className="px-8 py-3 rounded-full border border-grove-400/20 bg-grove-900/30
                             hover:border-grove-400/40 hover:bg-grove-900/50
                             transition-all duration-300 cursor-pointer disabled:opacity-30"
                >
                  <span className="font-ui text-xs tracking-[0.15em] uppercase text-grove-300/70">
                    {loading ? 'Thinking...' : 'Reflect'}
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* AI Reflection */}
        <AnimatePresence>
          {aiReflection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl mt-8 pt-6 border-t border-grove-400/10 text-center"
            >
              <p className="font-body text-base text-grove-300/70 leading-relaxed mb-6">
                {aiReflection}
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full border border-grove-400/20 bg-grove-900/30
                           hover:border-grove-400/40 transition-all duration-300 cursor-pointer"
              >
                <span className="font-ui text-xs tracking-[0.15em] uppercase text-grove-300/70">
                  Next reflection
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      {responses.length > 0 && (
        <div className="flex justify-center gap-2 pb-8">
          {responses.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-grove-400/30"
            />
          ))}
          <div className="w-1.5 h-1.5 rounded-full bg-grove-400/60 animate-breathe" />
        </div>
      )}
    </div>
  );
}
