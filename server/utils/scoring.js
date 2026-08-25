/**
 * SYNANTO 2K26 - Competitive Time-Decay Scoring Engine
 * Computes scores based on components assembled, difficulty multipliers, and real-time pit speed decay.
 */

export function computeScore({ 
  stagesCompleted = 5, 
  bonusClicksHit = 0, 
  totalTimeMs = 15000,
  difficulty = 'MEDIUM'
}) {
  const timeSeconds = Math.max(1, Math.round((totalTimeMs || 15000) / 1000));
  
  // Difficulty Config
  let basePointsPerPart = 100;
  let decayRatePerSec = 15;
  let gracePeriodSec = 10;
  let maxTimeBonus = 600;

  if (difficulty === 'EASY') {
    basePointsPerPart = 150;
    decayRatePerSec = 5;
    gracePeriodSec = 20;
    maxTimeBonus = 400;
  } else if (difficulty === 'HARD') {
    basePointsPerPart = 80;
    decayRatePerSec = 30;
    gracePeriodSec = 5;
    maxTimeBonus = 900;
  }

  // 1. Component Assembly Points
  const componentPoints = (bonusClicksHit || 0) * basePointsPerPart;
  
  // 2. Stage Completion Multiplier
  const stageBonus = (stagesCompleted || 0) * 120;

  // 3. Competitive Time-Based Decaying Speed Bonus
  const decayTime = Math.max(0, timeSeconds - gracePeriodSec);
  const timeBonus = Math.max(50, maxTimeBonus - (decayTime * decayRatePerSec));

  const totalScore = componentPoints + stageBonus + timeBonus;
  return Math.round(totalScore);
}
