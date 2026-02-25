import { AnimatePresence, motion } from 'framer-motion';
import NatureBackground from './components/NatureBackground';
import WelcomeScreen from './components/WelcomeScreen';
import ModeSelector from './components/ModeSelector';
import WriteMode from './components/WriteMode';
import TalkMode from './components/TalkMode';
import GuidedMode from './components/GuidedMode';
import Synthesis from './components/Synthesis';
import PastEntries from './components/PastEntries';
import useJournalStore from './hooks/useJournalStore';

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

export default function App() {
  const { screen, sessionMode } = useJournalStore();

  const isSessionActive = screen === 'session';
  const bgIntensity =
    screen === 'welcome' ? 'full' : isSessionActive ? 'subtle' : 'full';

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen key="welcome" />;
      case 'mode-select':
        return <ModeSelector key="mode-select" />;
      case 'session':
        switch (sessionMode) {
          case 'write':
            return <WriteMode key="write" />;
          case 'talk':
            return <TalkMode key="talk" />;
          case 'guided':
            return <GuidedMode key="guided" />;
          default:
            return <WelcomeScreen key="welcome-fallback" />;
        }
      case 'synthesis':
        return <Synthesis key="synthesis" />;
      case 'history':
        return <PastEntries key="history" />;
      default:
        return <WelcomeScreen key="welcome-default" />;
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <NatureBackground intensity={bgIntensity} />
      <AnimatePresence mode="wait">
        <motion.div key={screen + sessionMode} {...pageTransition} className="h-full">
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
