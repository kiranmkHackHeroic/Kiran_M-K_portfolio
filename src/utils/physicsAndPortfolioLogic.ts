export interface SpringState {
  position: number;
  velocity: number;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

/**
 * Second-order custom spring physics engine step for fluid navigation,
 * pointer tracking, and 3D gimbal interpolation.
 */
export function stepSpringPhysics(
  state: SpringState,
  target: number,
  dt: number,
  config: SpringConfig = { stiffness: 140, damping: 18, mass: 1 }
): SpringState {
  const safeDt = Math.min(Math.max(dt, 0.001), 0.05);
  const mass = config.mass ?? 1;
  const displacement = state.position - target;
  const springForce = -config.stiffness * displacement;
  const dampingForce = -config.damping * state.velocity;
  const acceleration = (springForce + dampingForce) / mass;

  const nextVelocity = state.velocity + acceleration * safeDt;
  const nextPosition = state.position + nextVelocity * safeDt;

  // Snap to target when energy is negligible
  if (Math.abs(nextVelocity) < 0.0001 && Math.abs(target - nextPosition) < 0.0001) {
    return { position: target, velocity: 0 };
  }

  return {
    position: nextPosition,
    velocity: nextVelocity,
  };
}

/**
 * Frame-rate independent exponential damping helper.
 */
export function dampValue(current: number, target: number, lambda: number, dt: number): number {
  const safeDt = Math.min(Math.max(dt, 0), 0.1);
  return current + (target - current) * (1 - Math.exp(-lambda * safeDt));
}

/**
 * Computes subtle 3D perspective tilt angles (in degrees) from pointer coordinates
 * normalized to a bounding box.
 */
export function computeCardTilt(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxTiltDeg: number = 6
): { rotateX: number; rotateY: number; glareX: number; glareY: number } {
  if (rect.width <= 0 || rect.height <= 0) {
    return { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };
  }
  const relX = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  const relY = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);

  const rotateY = (relX - 0.5) * 2 * maxTiltDeg;
  const rotateX = (0.5 - relY) * 2 * maxTiltDeg;

  return {
    rotateX: Number(rotateX.toFixed(2)),
    rotateY: Number(rotateY.toFixed(2)),
    glareX: Math.round(relX * 100),
    glareY: Math.round(relY * 100),
  };
}

export interface FilterableProject {
  id: string;
  title: string;
  category: string;
  technologies: string[];
  featured?: boolean;
}

/**
 * Filters projects by category and optional search query.
 */
export function filterProjects<T extends FilterableProject>(
  projects: T[],
  activeCategory: string,
  searchQuery: string = ''
): T[] {
  const normalizedCat = activeCategory.trim().toLowerCase();
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesCategory =
      normalizedCat === 'all' ||
      normalizedCat === 'all work' ||
      project.category.toLowerCase() === normalizedCat;

    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const inTitle = project.title.toLowerCase().includes(normalizedQuery);
    const inTech = project.technologies.some((t) =>
      t.toLowerCase().includes(normalizedQuery)
    );
    return inTitle || inTech;
  });
}

export interface ConstellationNode {
  id: string;
  label: string;
  category: string;
  connections: string[];
}

/**
 * Resolves direct neighbor IDs for an active node in the technology constellation.
 */
export function getConnectedTechNodes(
  nodes: ConstellationNode[],
  activeNodeId: string
): string[] {
  const found = nodes.find((n) => n.id === activeNodeId);
  if (!found) return [];

  const direct = new Set<string>(found.connections);
  for (const node of nodes) {
    if (node.connections.includes(activeNodeId)) {
      direct.add(node.id);
    }
  }
  return Array.from(direct);
}

export type ArchitectureFlowScenario =
  | 'read-cached'
  | 'write-transaction'
  | 'async-pipeline';

export interface ArchitectureTraceResult {
  scenario: ArchitectureFlowScenario;
  orderedNodeIds: string[];
  activeEdgeIds: string[];
  summary: string;
}

/**
 * Resolves the exact sequence of architecture nodes and connection edges
 * traversed by a full-stack request scenario.
 */
export function resolveArchitectureTracePath(
  scenario: ArchitectureFlowScenario
): ArchitectureTraceResult {
  switch (scenario) {
    case 'read-cached':
      return {
        scenario,
        orderedNodeIds: ['client', 'auth', 'api-layer', 'business-logic', 'cache', 'monitoring'],
        activeEdgeIds: [
          'client->api-layer',
          'api-layer->auth',
          'api-layer->business-logic',
          'business-logic->cache',
          'api-layer->monitoring',
        ],
        summary:
          'Edge JWT verification followed by sub-millisecond Redis cluster read-through before touching primary storage.',
      };
    case 'write-transaction':
      return {
        scenario,
        orderedNodeIds: [
          'client',
          'auth',
          'api-layer',
          'business-logic',
          'database',
          'cache',
          'monitoring',
        ],
        activeEdgeIds: [
          'client->api-layer',
          'api-layer->auth',
          'api-layer->business-logic',
          'business-logic->database',
          'business-logic->cache',
          'api-layer->monitoring',
        ],
        summary:
          'Serializable ACID write to primary database with synchronous cache invalidation and structured trace emission.',
      };
    case 'async-pipeline':
      return {
        scenario,
        orderedNodeIds: [
          'client',
          'api-layer',
          'business-logic',
          'background-jobs',
          'database',
          'monitoring',
        ],
        activeEdgeIds: [
          'client->api-layer',
          'api-layer->business-logic',
          'business-logic->background-jobs',
          'background-jobs->database',
          'api-layer->monitoring',
        ],
        summary:
          'Non-blocking API acknowledgment that dispatches compute-intensive workloads to idempotent background workers.',
      };
  }
}

export interface JumpSectionItem {
  id: string;
  numberKey: string;
  title: string;
  subtitle: string;
}

export const PORTFOLIO_JUMP_SECTIONS: JumpSectionItem[] = [
  {
    id: 'hero',
    numberKey: '1',
    title: 'Hero & 3D Spiral Galaxy',
    subtitle: 'Interactive 3D logarithmic spiral galaxy & accretion core',
  },
  {
    id: 'about',
    id_alias: 'about',
    numberKey: '2',
    title: 'About Me',
    subtitle: 'Editorial profile, education & engineering philosophy',
  } as JumpSectionItem,
  {
    id: 'work',
    numberKey: '3',
    title: 'Selected Work',
    subtitle: 'Interactive 3D project cards & system case studies',
  },
  {
    id: 'stack',
    numberKey: '4',
    title: 'Tech Stack & Constellation',
    subtitle: '7 structured domains & interactive node graph',
  },
  {
    id: 'architecture',
    numberKey: '5',
    title: 'Engineering Architecture',
    subtitle: 'Live full-stack request flow & subsystem inspector',
  },
  {
    id: 'contact',
    numberKey: '6',
    title: 'Contact & Resume',
    subtitle: 'Direct email, social links & downloadable CV',
  },
];

export type JumpKeyOutcome =
  | { type: 'move'; nextIndex: number }
  | { type: 'select'; selectedSection: JumpSectionItem; index: number }
  | { type: 'close' }
  | { type: 'noop' };

/**
 * Resolves keyboard navigation inside the 'Jump to Section' modal for
 * ArrowUp, ArrowDown, Home, End, Enter, Escape, and 1..N number keys.
 */
export function resolveJumpKeyCommand(
  key: string,
  currentIndex: number,
  sections: JumpSectionItem[] = PORTFOLIO_JUMP_SECTIONS
): JumpKeyOutcome {
  const total = sections.length;
  if (total === 0) return { type: 'noop' };

  const normalizedIndex = ((currentIndex % total) + total) % total;

  if (key === 'ArrowDown' || key === 'j' || key === 'J') {
    return { type: 'move', nextIndex: (normalizedIndex + 1) % total };
  }
  if (key === 'ArrowUp' || key === 'k' || key === 'K') {
    return { type: 'move', nextIndex: (normalizedIndex - 1 + total) % total };
  }
  if (key === 'Home') {
    return { type: 'move', nextIndex: 0 };
  }
  if (key === 'End') {
    return { type: 'move', nextIndex: total - 1 };
  }
  if (key === 'Escape') {
    return { type: 'close' };
  }
  if (key === 'Enter') {
    return {
      type: 'select',
      selectedSection: sections[normalizedIndex],
      index: normalizedIndex,
    };
  }

  // Check 1-based number shortcut (e.g., '1'..'6')
  const matchedIdx = sections.findIndex((s) => s.numberKey === key);
  if (matchedIdx !== -1) {
    return {
      type: 'select',
      selectedSection: sections[matchedIdx],
      index: matchedIdx,
    };
  }

  return { type: 'noop' };
}

export type ThemeMode = 'midnight' | 'day';

export interface ThemePaletteSpec {
  mode: ThemeMode;
  label: 'Midnight' | 'Day';
  toggleActionLabel: string;
  fogHex: number;
  hemiSkyHex: number;
  hemiGroundHex: number;
  hemiIntensity: number;
  cyanRimHex: number;
  violetRimHex: number;
  glassColorHex: number;
  glassAttenuationHex: number;
  particleHex: number;
  particleOpacity: number;
}

/**
 * Pure toggle helper switching between default 'midnight' and 'day' glassmorphism modes.
 */
export function toggleThemeMode(current: ThemeMode): ThemeMode {
  return current === 'midnight' ? 'day' : 'midnight';
}

/**
 * Resolves 3D WebGL lighting, refraction, and UI label tokens for the active theme mode.
 */
export function resolveThemePalette(mode: ThemeMode): ThemePaletteSpec {
  if (mode === 'day') {
    return {
      mode: 'day',
      label: 'Day',
      toggleActionLabel: 'Switch to Midnight theme (T)',
      fogHex: 0xf3f7fc,
      hemiSkyHex: 0xffffff,
      hemiGroundHex: 0xcbd5e1,
      hemiIntensity: 1.35,
      cyanRimHex: 0x0284c7,
      violetRimHex: 0x6d28d9,
      glassColorHex: 0xf0f9ff,
      glassAttenuationHex: 0x0284c7,
      particleHex: 0x0284c7,
      particleOpacity: 0.42,
    };
  }

  return {
    mode: 'midnight',
    label: 'Midnight',
    toggleActionLabel: 'Switch to Day theme (T)',
    fogHex: 0x05070e,
    hemiSkyHex: 0x93c5fd,
    hemiGroundHex: 0x090d16,
    hemiIntensity: 0.85,
    cyanRimHex: 0x38bdf8,
    violetRimHex: 0xa78bfa,
    glassColorHex: 0xe0f2fe,
    glassAttenuationHex: 0x38bdf8,
    particleHex: 0x7dd3fc,
    particleOpacity: 0.55,
  };
}

/**
 * Checks if a valid 'repositoryUrl' property exists on a project object
 * and returns its normalized URL string, or null if absent/empty.
 */
export function resolveProjectRepositoryUrl(
  project: { repositoryUrl?: string | null } | null | undefined
): string | null {
  if (!project || typeof project.repositoryUrl !== 'string') {
    return null;
  }
  const trimmed = project.repositoryUrl.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export interface SpiralGalaxyConfig {
  starCount: number;
  arms: number;
  galaxyRadius: number;
  spinFactor: number;
  randomness: number;
  randomnessPower: number;
  coreRgb: [number, number, number];
  midRgb: [number, number, number];
  outerRgb: [number, number, number];
  seed?: number;
}

export interface SpiralGalaxyBuffers {
  starCount: number;
  arms: number;
  basePositions: Float32Array;
  colors: Float32Array;
  normalizedRadii: Float32Array;
}

/**
 * Generates deterministic 3D logarithmic spiral galaxy star positions and spectral colors
 * (core warm-cyan -> mid electric-sky -> outer violet-magenta) for WebGL BufferGeometry.
 */
export function generateSpiralGalaxyBuffers(
  config: Partial<SpiralGalaxyConfig> = {}
): SpiralGalaxyBuffers {
  const starCount = Math.max(16, config.starCount ?? 4200);
  const arms = Math.max(2, config.arms ?? 4);
  const galaxyRadius = Math.max(0.5, config.galaxyRadius ?? 3.55);
  const spinFactor = config.spinFactor ?? 2.35;
  const randomness = config.randomness ?? 0.21;
  const randomnessPower = config.randomnessPower ?? 3.1;
  const coreRgb = config.coreRgb ?? [1.0, 0.97, 0.88];
  const midRgb = config.midRgb ?? [0.22, 0.78, 0.99];
  const outerRgb = config.outerRgb ?? [0.72, 0.38, 0.98];
  let seed = (config.seed ?? 18032026) >>> 0;

  const nextRand = (): number => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const basePositions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const normalizedRadii = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    // Bias star density toward the luminous galactic core while extending spiral arms outward
    const u = Math.pow(nextRand(), 1.45);
    const radius = u * galaxyRadius;
    normalizedRadii[i] = u;

    const branchAngle = ((i % arms) / arms) * Math.PI * 2;
    const spinAngle = radius * spinFactor;

    const signX = nextRand() < 0.5 ? 1 : -1;
    const signY = nextRand() < 0.5 ? 1 : -1;
    const signZ = nextRand() < 0.5 ? 1 : -1;

    const spreadScale = randomness * (0.18 + 0.82 * radius);
    const randomX = Math.pow(nextRand(), randomnessPower) * signX * spreadScale;
    const randomZ = Math.pow(nextRand(), randomnessPower) * signZ * spreadScale;
    // Galactic bulge is thicker near the center and flattens along the outer spiral disk
    const bulgeThickness = Math.exp(-u * 3.0) * 0.42 + 0.06;
    const randomY =
      Math.pow(nextRand(), randomnessPower) * signY * randomness * bulgeThickness;

    const angle = branchAngle + spinAngle;
    basePositions[i3] = Math.cos(angle) * radius + randomX;
    basePositions[i3 + 1] = randomY;
    basePositions[i3 + 2] = Math.sin(angle) * radius + randomZ;

    // 3-stop spectral gradient: Warm White/Gold Core -> Electric Cyan Mid Arm -> Violet/Magenta Outer Arm
    let r: number;
    let g: number;
    let b: number;
    if (u < 0.32) {
      const t = u / 0.32;
      r = coreRgb[0] + (midRgb[0] - coreRgb[0]) * t;
      g = coreRgb[1] + (midRgb[1] - coreRgb[1]) * t;
      b = coreRgb[2] + (midRgb[2] - coreRgb[2]) * t;
    } else {
      const t = (u - 0.32) / 0.68;
      r = midRgb[0] + (outerRgb[0] - midRgb[0]) * t;
      g = midRgb[1] + (outerRgb[1] - midRgb[1]) * t;
      b = midRgb[2] + (outerRgb[2] - midRgb[2]) * t;
    }

    colors[i3] = Math.min(1, Math.max(0, r));
    colors[i3 + 1] = Math.min(1, Math.max(0, g));
    colors[i3 + 2] = Math.min(1, Math.max(0, b));
  }

  return {
    starCount,
    arms,
    basePositions,
    colors,
    normalizedRadii,
  };
}

export interface ConstellationTooltipPlacement {
  vertical: 'above' | 'below';
  horizontal: 'left' | 'center' | 'right';
}

/**
 * Computes non-clipping tooltip anchor alignment for a node positioned at
 * percentage coordinates (xPercent, yPercent) inside the constellation map.
 */
export function resolveConstellationTooltipPlacement(
  xPercent: number,
  yPercent: number
): ConstellationTooltipPlacement {
  const vertical: 'above' | 'below' = yPercent < 36 ? 'below' : 'above';
  const horizontal: 'left' | 'center' | 'right' =
    xPercent < 25 ? 'left' : xPercent > 75 ? 'right' : 'center';

  return { vertical, horizontal };
}

export interface TechTooltipMetricsInput {
  name: string;
  yearsOfExperience?: string;
  proficiencyLevel?: string;
  proficiencyScore?: number;
}

export interface FormattedTechTooltipMetrics {
  yearsLabel: string;
  proficiencyLabel: string;
  clampedScore: number;
  summaryLine: string;
}

/**
 * Formats a technology node's 'years of experience' and 'proficiency level'
 * for interactive constellation tooltips and ARIA descriptions.
 */
export function formatTechTooltipMetrics(
  node: TechTooltipMetricsInput
): FormattedTechTooltipMetrics {
  const yearsLabel =
    node.yearsOfExperience && node.yearsOfExperience.trim().length > 0
      ? node.yearsOfExperience.trim()
      : '1+ Year';
  const proficiencyLabel =
    node.proficiencyLevel && node.proficiencyLevel.trim().length > 0
      ? node.proficiencyLevel.trim()
      : 'Proficient';
  const rawScore =
    typeof node.proficiencyScore === 'number' && Number.isFinite(node.proficiencyScore)
      ? node.proficiencyScore
      : 85;
  const clampedScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  return {
    yearsLabel,
    proficiencyLabel,
    clampedScore,
    summaryLine: `${yearsLabel} Experience · ${proficiencyLabel} (${clampedScore}%)`,
  };
}
