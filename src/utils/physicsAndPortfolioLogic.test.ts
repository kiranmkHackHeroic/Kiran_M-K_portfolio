import test from 'node:test';
import assert from 'node:assert/strict';
import {
  stepSpringPhysics,
  dampValue,
  computeCardTilt,
  filterProjects,
  getConnectedTechNodes,
  resolveArchitectureTracePath,
  resolveJumpKeyCommand,
  PORTFOLIO_JUMP_SECTIONS,
  toggleThemeMode,
  resolveThemePalette,
  resolveProjectRepositoryUrl,
  generateSpiralGalaxyBuffers,
  resolveConstellationTooltipPlacement,
  formatTechTooltipMetrics,
} from './physicsAndPortfolioLogic.ts';

test('stepSpringPhysics moves position smoothly toward target and settles', () => {
  let state = { position: 0, velocity: 0 };
  for (let i = 0; i < 120; i++) {
    state = stepSpringPhysics(state, 100, 1 / 60, {
      stiffness: 180,
      damping: 22,
    });
  }
  assert.ok(Math.abs(state.position - 100) < 0.5, `Expected near 100, got ${state.position}`);
});

test('dampValue interpolates monotonically toward target', () => {
  const halfStep = dampValue(0, 10, 8, 0.1);
  assert.ok(halfStep > 0 && halfStep < 10);
  const stationary = dampValue(5, 5, 8, 0.016);
  assert.equal(stationary, 5);
});

test('computeCardTilt calculates balanced 3D perspective angles and glare coordinates', () => {
  const rect = { left: 100, top: 100, width: 400, height: 300 };
  const center = computeCardTilt(300, 250, rect, 8);
  assert.equal(center.rotateX, 0);
  assert.equal(center.rotateY, 0);
  assert.equal(center.glareX, 50);
  assert.equal(center.glareY, 50);

  const topLeft = computeCardTilt(100, 100, rect, 8);
  assert.equal(topLeft.rotateX, 8);
  assert.equal(topLeft.rotateY, -8);
});

test('filterProjects filters by category and technology query accurately', () => {
  const sample = [
    {
      id: 'p1',
      title: 'Aether Consensus Engine',
      category: 'Distributed Systems',
      technologies: ['Rust', 'gRPC', 'Raft'],
    },
    {
      id: 'p2',
      title: 'Lumina Spatial Shader Studio',
      category: 'Spatial & WebGL',
      technologies: ['TypeScript', 'Three.js', 'GLSL'],
    },
  ];

  assert.equal(filterProjects(sample, 'All Work').length, 2);
  assert.equal(filterProjects(sample, 'Distributed Systems').length, 1);
  assert.equal(filterProjects(sample, 'All Work', 'glsl')[0].id, 'p2');
});

test('getConnectedTechNodes returns bidirectional neighbors in constellation', () => {
  const nodes = [
    { id: 'ts', label: 'TypeScript', category: 'Programming Languages', connections: ['react', 'node'] },
    { id: 'react', label: 'React', category: 'Frontend Development', connections: ['three'] },
    { id: 'node', label: 'Node.js', category: 'Backend Development', connections: [] },
    { id: 'three', label: 'Three.js', category: 'Frontend Development', connections: ['ts'] },
  ];

  const connectedToTs = getConnectedTechNodes(nodes, 'ts');
  assert.ok(connectedToTs.includes('react'));
  assert.ok(connectedToTs.includes('node'));
  assert.ok(connectedToTs.includes('three'));
});

test('resolveArchitectureTracePath returns accurate nodes and edges for each flow', () => {
  const cached = resolveArchitectureTracePath('read-cached');
  assert.ok(cached.orderedNodeIds.includes('cache'));
  assert.ok(!cached.orderedNodeIds.includes('database'));

  const writeTx = resolveArchitectureTracePath('write-transaction');
  assert.ok(writeTx.orderedNodeIds.includes('database'));
  assert.ok(writeTx.activeEdgeIds.includes('business-logic->database'));

  const asyncFlow = resolveArchitectureTracePath('async-pipeline');
  assert.ok(asyncFlow.orderedNodeIds.includes('background-jobs'));
});

test('resolveJumpKeyCommand handles arrow wrap-around, number shortcuts, Enter, and Escape', () => {
  const downFromLast = resolveJumpKeyCommand(
    'ArrowDown',
    PORTFOLIO_JUMP_SECTIONS.length - 1
  );
  assert.deepEqual(downFromLast, { type: 'move', nextIndex: 0 });

  const upFromFirst = resolveJumpKeyCommand('ArrowUp', 0);
  assert.deepEqual(upFromFirst, {
    type: 'move',
    nextIndex: PORTFOLIO_JUMP_SECTIONS.length - 1,
  });

  const num3 = resolveJumpKeyCommand('3', 0);
  assert.equal(num3.type, 'select');
  if (num3.type === 'select') {
    assert.equal(num3.selectedSection.id, 'work');
  }

  const enterOn4 = resolveJumpKeyCommand('Enter', 4);
  assert.equal(enterOn4.type, 'select');
  if (enterOn4.type === 'select') {
    assert.equal(enterOn4.selectedSection.id, 'architecture');
  }

  const esc = resolveJumpKeyCommand('Escape', 2);
  assert.deepEqual(esc, { type: 'close' });
});

test('toggleThemeMode and resolveThemePalette switch cleanly between midnight and day themes', () => {
  assert.equal(toggleThemeMode('midnight'), 'day');
  assert.equal(toggleThemeMode('day'), 'midnight');

  const midnightPalette = resolveThemePalette('midnight');
  const dayPalette = resolveThemePalette('day');

  assert.equal(midnightPalette.label, 'Midnight');
  assert.equal(dayPalette.label, 'Day');
  assert.notEqual(midnightPalette.fogHex, dayPalette.fogHex);
  assert.ok(dayPalette.hemiIntensity > midnightPalette.hemiIntensity);
});

test('resolveProjectRepositoryUrl checks if repositoryUrl property exists and is non-empty', () => {
  assert.equal(
    resolveProjectRepositoryUrl({
      repositoryUrl:
        'https://github.com/kiranmkHackHeroic/Silent_Bridge---Sign-Language-Recognition-Model',
    }),
    'https://github.com/kiranmkHackHeroic/Silent_Bridge---Sign-Language-Recognition-Model'
  );
  assert.equal(resolveProjectRepositoryUrl({ repositoryUrl: '   ' }), null);
  assert.equal(resolveProjectRepositoryUrl({}), null);
  assert.equal(resolveProjectRepositoryUrl(null), null);
});

test('generateSpiralGalaxyBuffers produces finite 3D logarithmic spiral coordinates and bounded RGB colors', () => {
  const galaxy = generateSpiralGalaxyBuffers({
    starCount: 240,
    arms: 4,
    galaxyRadius: 3.5,
  });

  assert.equal(galaxy.starCount, 240);
  assert.equal(galaxy.arms, 4);
  assert.equal(galaxy.basePositions.length, 240 * 3);
  assert.equal(galaxy.colors.length, 240 * 3);
  assert.equal(galaxy.normalizedRadii.length, 240);

  for (let i = 0; i < galaxy.basePositions.length; i++) {
    assert.ok(Number.isFinite(galaxy.basePositions[i]));
    assert.ok(galaxy.colors[i] >= 0 && galaxy.colors[i] <= 1);
  }
});

test('resolveConstellationTooltipPlacement avoids clipping near top, left, and right edges', () => {
  assert.deepEqual(resolveConstellationTooltipPlacement(50, 14), {
    vertical: 'below',
    horizontal: 'center',
  });
  assert.deepEqual(resolveConstellationTooltipPlacement(16, 48), {
    vertical: 'above',
    horizontal: 'left',
  });
  assert.deepEqual(resolveConstellationTooltipPlacement(86, 70), {
    vertical: 'above',
    horizontal: 'right',
  });
});

test('formatTechTooltipMetrics formats years of experience and proficiency level accurately', () => {
  const formatted = formatTechTooltipMetrics({
    name: 'Java (Java 17)',
    yearsOfExperience: '3+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 94,
  });

  assert.equal(formatted.yearsLabel, '3+ Years');
  assert.equal(formatted.proficiencyLabel, 'Advanced');
  assert.equal(formatted.clampedScore, 94);
  assert.equal(formatted.summaryLine, '3+ Years Experience · Advanced (94%)');
});
