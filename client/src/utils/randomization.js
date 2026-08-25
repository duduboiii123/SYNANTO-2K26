/**
 * SYNANTO 2K26 - Session Randomization Engine
 * Generates dynamic, data-driven task sequences, livery variations, and sprint stats per playthrough.
 */

const ACTIONS = [
  'Torque', 'Calibrate', 'Align', 'Fasten', 
  'Rivet', 'Balance', 'Tune', 'Seal'
];

const PARTS = [
  { name: 'Rear Diffuser', pos: { top: '56%', left: '68%' }, icon: '⚡' },
  { name: 'Turbo Manifold', pos: { top: '38%', left: '55%' }, icon: '🔥' },
  { name: 'Front Splitter', pos: { top: '52%', left: '30%' }, icon: '💎' },
  { name: 'Suspension Coil', pos: { top: '60%', left: '32%' }, icon: '🛞' },
  { name: 'Intake Housing', pos: { top: '34%', left: '44%' }, icon: '✨' },
  { name: 'Brake Caliper', pos: { top: '60%', left: '68%' }, icon: '🏁' },
  { name: 'Spoiler Mount', pos: { top: '28%', left: '68%' }, icon: '🚀' },
  { name: 'Exhaust Baffle', pos: { top: '44%', left: '62%' }, icon: '🧪' }
];

const TOOLS = [
  { name: 'Pneumatic Riveter', type: 'HOLD', icon: '🔧', material: 'Oiled Black Steel' },
  { name: 'Laser Wrench', type: 'TAP', icon: '💡', material: 'Anodized Cyan Aluminum' },
  { name: 'Carbon Clamp', type: 'HOLD', icon: '🛡️', material: 'Carbon Fiber & Titanium' },
  { name: 'Torque Driver', type: 'TAP', icon: '⚙️', material: 'Cast Iron & Brushed Steel' },
  { name: 'Induction Sealer', type: 'HOLD', icon: '⚡', material: 'Copper Thermal Nozzle' },
  { name: 'Precision Gauge', type: 'TAP', icon: '🌟', material: 'Optical Dial Glass' }
];

/**
 * Generate 5 dynamic build stages with randomized unique tasks
 */
export function generateSessionStages() {
  const shuffledParts = [...PARTS].sort(() => 0.5 - Math.random());
  const stages = [];

  for (let stageNum = 1; stageNum <= 5; stageNum++) {
    const taskCount = stageNum === 1 ? 2 : stageNum === 5 ? 4 : 3;
    const stageTasks = [];

    for (let t = 0; t < taskCount; t++) {
      const part = shuffledParts[(stageNum * 2 + t) % shuffledParts.length];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const tool = TOOLS[Math.floor(Math.random() * TOOLS.length)];
      const points = 80 + Math.floor(Math.random() * 70); // 80 to 150 pts
      const targetSec = 8 + Math.floor(Math.random() * 7); // 8 to 15s

      stageTasks.push({
        id: t,
        label: `${action} ${part.name}`,
        detail: `Use ${tool.name} to ${action.toLowerCase()} the ${part.name.toLowerCase()} within target tolerance.`,
        actionType: tool.type, // 'HOLD' or 'TAP'
        toolName: tool.name,
        toolMaterial: tool.material,
        toolIcon: tool.icon,
        icon: part.icon,
        points,
        targetSec,
        pos: part.pos
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
