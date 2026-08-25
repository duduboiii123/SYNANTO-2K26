import React from 'react';
import { useGameStore } from '../state/store';
import { AnimatePresence, motion } from 'framer-motion';

import CrewSelect from '../components/crew/CrewSelect';
import BuildStage from '../components/garage/BuildStage';
import CarComplete from '../components/garage/CarComplete';
import RaceAnimation from '../components/race/RaceAnimation';
import RevealScreen from '../components/race/RevealScreen';
import FinalPoster from '../components/race/FinalPoster';

export default function Play() {
  const gameState = useGameStore(state => state.gameState);

  const renderCurrentScreen = () => {
    if (gameState === 'CREW_SELECT') {
      return <CrewSelect />;
    }
    
    if (gameState.startsWith('BUILD_')) {
      return <BuildStage />;
    }
    
    if (gameState === 'CAR_COMPLETE') {
      return <CarComplete />;
    }
    
    if (gameState === 'START_PRESSED' || gameState === 'RACING') {
      return <RaceAnimation />;
    }
    
    if (gameState === 'REVEAL') {
      return <RevealScreen />;
    }
    
    if (gameState === 'FINAL_POSTER') {
      return <FinalPoster />;
    }

    return <CrewSelect />;
  };

  // Group build states under 'BUILD' key so BuildStage does NOT unmount or flash black between stages 1..5!
  const getScreenKey = () => {
    if (gameState.startsWith('BUILD_')) return 'BUILD_STAGE_PERSISTENT';
    if (gameState === 'START_PRESSED' || gameState === 'RACING') return 'RACE_STAGE_PERSISTENT';
    return gameState;
  };

  return (
    <div className={`flex-1 relative flex flex-col bg-garage-dark text-cream ${
      gameState.startsWith('BUILD_') ? 'h-[calc(100dvh-54px)] sm:h-[calc(100vh-70px)] overflow-hidden' : 'min-h-[calc(100dvh-54px)] overflow-y-auto'
    }`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={getScreenKey()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 flex flex-col"
        >
          {renderCurrentScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
