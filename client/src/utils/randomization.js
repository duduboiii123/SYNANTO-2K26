/**
 * SYNANTO 2K26 - Session Randomization Engine
 * Generates dynamic, data-driven task sequences, diverse randomized tap coordinates, and sprint stats per playthrough.
 */

const ACTIONS = [
  'Torque', 'Calibrate', 'Align', 'Fasten', 
  'Rivet', 'Balance', 'Tune', 'Seal', 'Lock', 'Mount'
];

const PARTS = [
  { name: 'Rear Diffuser', icon: '⚡' },
  { name: 'Turbo Manifold', icon: '🔥' },
  { name: 'Front Splitter', icon: '💎' },
  { name: 'Suspension Coil', icon: '🛞' },
  { name: 'Intake Housing', icon: '✨' },
  { name: 'Brake Caliper', icon: '🏁' },
  { name: 'Spoiler Mount', icon: '🚀' },
  { name: 'Exhaust Baffle', icon: '🧪' },
  { name: 'Aero Canard', icon: '🌟' },
  { name: 'Intercooler Pipe', icon: '❄️' },
  { name: 'Wheel Hub Lug', icon: '🔧' },
  { name: 'Oil Catch Tank', icon: '🛢️' }
];

const TOOLS = [
  { name: 'Pneumatic Impact Gun', type: 'HOLD', icon: '🔧', material: 'Cast Iron & Brushed Steel' },
  { name: 'Laser Calibration Wrench', type: 'TAP', icon: '💡', material: 'Anodized Cyan Aluminum' },
  { name: 'Carbon Fiber Clamp', type: 'HOLD', icon: '🛡️', material: 'Carbon Fiber & Titanium' },
  { name: 'Precision Digital Torque Driver', type: 'TAP', icon: '⚙️', material: 'High-Tensile Chrome Vanadium' },
  { name: 'Induction Thermal Sealer', type: 'HOLD', icon: '⚡', material: 'Copper Thermal Nozzle' },
  { name: 'Optical Telemetry Gauge', type: 'TAP', icon: '🌟', material: 'Sapphire Crystal Dial' }
];

/**
 * Generate randomized position across the interactive vehicle viewport
 */
export function getRandomTapPosition() {
  // Safe bounds: left: 18% - 82%, top: 22% - 72%
  const left = 18 + Math.floor(Math.random() * 64);
  const top = 22 + Math.floor(Math.random() * 50);
  return { top: `${top}%`, left: `${left}%` };
}

/**
 * Generate 5 dynamic build stages with randomized unique tasks and dynamic tap areas
 */
export function generateSessionStages(difficulty = 'MEDIUM') {
  const shuffledParts = [...PARTS].sort(() => 0.5 - Math.random());
  const stages = [];
  const isHard = difficulty === 'HARD';

  for (let stageNum = 1; stageNum <= 5; stageNum++) {
    const taskCount = stageNum === 1 ? 2 : stageNum === 5 ? 4 : 3;
    const stageTasks = [];

    for (let t = 0; t < taskCount; t++) {
      const part = shuffledParts[(stageNum * 2 + t) % shuffledParts.length];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const tool = TOOLS[Math.floor(Math.random() * TOOLS.length)];
      
      // In HARD mode, include both HOLD tasks and TAP tasks!
      // In EASY / MEDIUM mode, keep it tap-based.
      const actionType = isHard ? (t % 2 === 1 ? 'HOLD' : 'TAP') : 'TAP';
      
      const basePoints = difficulty === 'EASY' ? 150 : difficulty === 'HARD' ? 120 : 130;

      stageTasks.push({
        id: t,
        label: `${action} ${part.name}`,
        detail: `Use ${tool.name} to ${action.toLowerCase()} the ${part.name.toLowerCase()} at target coordinates.`,
        actionType,
        toolName: tool.name,
        toolMaterial: tool.material,
        toolIcon: tool.icon,
        icon: part.icon,
        points: basePoints,
        basePoints,
        pos: getRandomTapPosition()
      });
    }

    stages.push({
      stageNumber: stageNum,
      title: `STAGE ${stageNum}: ${stageTasks[0].toolName.toUpperCase()}`,
      subtitle: `Assemble & calibrate high-rev motorsport componentry`,
      toolName: stageTasks[0].toolName,
      toolMaterial: stageTasks[0].toolMaterial,
      toolIcon: stageTasks[0].toolIcon,
      tasks: stageTasks
    });
  }

  return stages;
}
