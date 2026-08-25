import { create } from 'zustand';
import { ORIGINAL_CREWS } from '../data/crews';
import { generateSessionStages } from '../utils/randomization';
import { sanitizeCallSign } from '../utils/moderation';

const GAME_STATES = [
  'CREW_SELECT',
  'BUILD_1',
  'BUILD_2',
  'BUILD_3',
  'BUILD_4',
  'BUILD_5',
  'CAR_COMPLETE',
  'START_PRESSED',
  'RACING',
  'REVEAL',
  'FINAL_POSTER'
];

export const useGameStore = create((set, get) => ({
  gameState: 'CREW_SELECT',
  
  playerName: '',
  selectedCrew: ORIGINAL_CREWS[0],
  userId: null,
  attemptId: null,
  
  crews: ORIGINAL_CREWS,
  generatedStages: generateSessionStages(),
  currentBuildStage: 0,
  bonusClicksHit: 0,
  totalComponentsInstalled: 0,
  buildStartTime: null,
  buildTotalTimeMs: 0,
  score: null,
  
  revealData: null,
  isMuted: false,

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setGameState: (state) => set({ gameState: state }),
  
  advanceState: () => {
    const current = get().gameState;
    const idx = GAME_STATES.indexOf(current);
    if (idx >= 0 && idx < GAME_STATES.length - 1) {
      const nextState = GAME_STATES[idx + 1];
      let updates = { gameState: nextState };
      
      if (nextState.startsWith('BUILD_')) {
        updates.currentBuildStage = parseInt(nextState.split('_')[1], 10);
        if (!get().buildStartTime) {
          updates.buildStartTime = Date.now();
        }
      }
      
      set(updates);
    }
  },

  setPlayerName: (rawName) => set({ playerName: sanitizeCallSign(rawName) }),
  selectCrew: (crew) => set({ selectedCrew: crew }),
  setSelectedCrew: (crew) => set({ selectedCrew: crew }),
  setUserId: (id) => set({ userId: id }),
  setAttemptId: (id) => set({ attemptId: id }),
  setBuildStartTime: (time) => set({ buildStartTime: time }),
  setCrews: (crews) => set({ crews }),
  incrementBonusClicks: () => set((state) => ({ bonusClicksHit: state.bonusClicksHit + 1 })),
  incrementComponentInstalled: () => set((state) => ({ 
    totalComponentsInstalled: state.totalComponentsInstalled + 1,
    bonusClicksHit: state.bonusClicksHit + 1 
  })),
  setBuildTotalTimeMs: (timeMs) => set({ buildTotalTimeMs: timeMs }),
  setScore: (score) => set({ score }),
  setRevealData: (data) => set({ revealData: data }),
  
  resetGame: () => set({
    gameState: 'CREW_SELECT',
    playerName: '',
    selectedCrew: ORIGINAL_CREWS[0],
    generatedStages: generateSessionStages(),
    userId: null,
    attemptId: null,
    currentBuildStage: 0,
    bonusClicksHit: 0,
    totalComponentsInstalled: 0,
    buildStartTime: null,
    buildTotalTimeMs: 0,
    score: null,
    revealData: null
  })
}));
