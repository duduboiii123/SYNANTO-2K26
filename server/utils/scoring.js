export function computeScore({ stagesCompleted = 5, bonusClicksHit = 0, totalTimeMs = 15000 }) {
  const componentPoints = (bonusClicksHit || 0) * 100;
  const stageBonus = (stagesCompleted || 0) * 100;
  
  const timeSeconds = Math.max(1, Math.round((totalTimeMs || 15000) / 1000));
  
  let speedBonus = 100;
  if (timeSeconds <= 15) {
    speedBonus = 650;
  } else if (timeSeconds <= 20) {
    speedBonus = 500;
  } else if (timeSeconds <= 30) {
    speedBonus = 350;
  } else if (timeSeconds <= 45) {
    speedBonus = 200;
  }

  return componentPoints + stageBonus + speedBonus;
}
