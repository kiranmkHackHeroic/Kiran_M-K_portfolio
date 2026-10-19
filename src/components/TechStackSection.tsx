import React, { useMemo, useState } from 'react';
import { Compass, Network, Sparkles } from 'lucide-react';
import {
  TECH_CATEGORIES,
  TECH_STACK_DATA,
  TechSkillItem,
} from '../data/portfolioData';
import {
  formatTechTooltipMetrics,
  getConnectedTechNodes,
  resolveConstellationTooltipPlacement,
} from '../utils/physicsAndPortfolioLogic';

export const TechStackSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTechId, setActiveTechId] = useState<string>('java');
  const [hoveredTechId, setHoveredTechId] = useState<string | null>(null);

  const activeTech: TechSkillItem = useMemo(() => {
    return (
      TECH_STACK_DATA.find((t) => t.id === activeTechId) || TECH_STACK_DATA[0]
    );
  }, [activeTechId]);

  const hoveredTech: TechSkillItem | null = useMemo(() => {
    if (!hoveredTechId) return null;
    return TECH_STACK_DATA.find((t) => t.id === hoveredTechId) || null;
  }, [hoveredTechId]);

  const activeMetrics = useMemo(
    () => formatTechTooltipMetrics(activeTech),
    [activeTech]
  );

  const connectedIds = useMemo(() => {
    const constellationNodes = TECH_STACK_DATA.map((item) => ({
      id: item.id,
      label: item.name,
      category: item.category,
      connections: item.connections,
    }));
    return getConnectedTechNodes(constellationNodes, activeTech.id);
  }, [activeTech]);

  const visibleCategories = useMemo(() => {
    if (selectedCategory === 'All') return [...TECH_CATEGORIES];
    return TECH_CATEGORIES.filter((c) => c === selectedCategory);
  }, [selectedCategory]);

  // Precompute constellation edges for SVG rendering
  const constellationEdges = useMemo(() => {
    const edges: {
      key: string;
      from: TechSkillItem;
      to: TechSkillItem;
      isHighlighted: boolean;
      isHoveredEdge: boolean;
    }[] = [];
    const seen = new Set<string>();

    for (const node of TECH_STACK_DATA) {
      for (const targetId of node.connections) {
        const pairKey = [node.id, targetId].sort().join('--');
        if (seen.has(pairKey)) continue;
        const targetNode = TECH_STACK_DATA.find((n) => n.id === targetId);
        if (!targetNode) continue;
        seen.add(pairKey);

        const isHighlighted =
          node.id === activeTech.id || targetNode.id === activeTech.id;
        const isHoveredEdge =
          hoveredTech !== null &&
          (node.id === hoveredTech.id || targetNode.id === hoveredTech.id);
        edges.push({
          key: pairKey,
          from: node,
          to: targetNode,
          isHighlighted,
          isHoveredEdge,
        });
      }
    }
    return edges;
  }, [activeTech, hoveredTech]);

  const tooltipPlacement = useMemo(() => {
    if (!hoveredTech) return null;
    return resolveConstellationTooltipPlacement(hoveredTech.x, hoveredTech.y);
  }, [hoveredTech]);

  const hoveredMetrics = useMemo(() => {
    if (!hoveredTech) return null;
    return formatTechTooltipMetrics(hoveredTech);
  }, [hoveredTech]);

  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="relative py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-slate-800/70"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-mono tracking-widest text-sky-400">
            03. TECHNICAL ECOSYSTEM & CONSTELLATION
          </p>
          <h2
            id="stack-heading"
            className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white text-balance"
          >
            STRUCTURED DEPTH ACROSS THE STACK.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every tool is chosen for its architectural guarantees—from memory-safe storage kernels and concurrent RPC services to physically based WebGL shaders. Hover any constellation node to inspect years of experience and proficiency level, or click to explore its architectural links.
          </p>
        </div>

        {/* Interactive Category Filter Bar */}
        <div
          role="group"
          aria-label="Filter technical skills by category"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#0A0F1D] border border-slate-800"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-sky-400 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Domains ({TECH_STACK_DATA.length})
          </button>
          {TECH_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-400 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top Interactive Constellation + Live Node Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-stretch">
        {/* Interactive Constellation Map */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0A0F1D] border border-slate-800/90 p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Network className="w-4 h-4 text-sky-400" aria-hidden="true" />
              <span>INTERACTIVE TECHNOLOGY CONSTELLATION</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 tabular-nums">
              <span>Hover node for experience & proficiency</span>
              <span aria-hidden="true">·</span>
              <span>{constellationEdges.length} Links</span>
            </div>
          </div>

          <div className="relative w-full h-72 sm:h-80 rounded-xl bg-[#060A14] border border-slate-800/70">
            {/* Clipped SVG Line Layer */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
                role="img"
                aria-label="Interactive constellation of connected technologies"
              >
                {/* Connection Lines */}
                {constellationEdges.map((edge) => (
                  <line
                    key={edge.key}
                    x1={edge.from.x}
                    y1={edge.from.y}
                    x2={edge.to.x}
                    y2={edge.to.y}
                    stroke={
                      edge.isHoveredEdge
                        ? '#7DD3FC'
                        : edge.isHighlighted
                        ? '#38BDF8'
                        : 'rgba(148, 163, 184, 0.16)'
                    }
                    strokeWidth={
                      edge.isHoveredEdge
                        ? '0.7'
                        : edge.isHighlighted
                        ? '0.55'
                        : '0.25'
                    }
                  />
                ))}
              </svg>
            </div>

            {/* Interactive Node Buttons Overlaid on Constellation Coordinates */}
            {TECH_STACK_DATA.map((item) => {
              const isSelected = item.id === activeTech.id;
              const isHovered = hoveredTech?.id === item.id;
              const isNeighbor = connectedIds.includes(item.id);
              const isCategoryMatch =
                selectedCategory === 'All' ||
                item.category === selectedCategory;
              const itemMetrics = formatTechTooltipMetrics(item);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTechId(item.id)}
                  onMouseEnter={() => setHoveredTechId(item.id)}
                  onMouseLeave={() =>
                    setHoveredTechId((prev) => (prev === item.id ? null : prev))
                  }
                  onFocus={() => setHoveredTechId(item.id)}
                  onBlur={() =>
                    setHoveredTechId((prev) => (prev === item.id ? null : prev))
                  }
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  aria-label={`Inspect ${item.name} in constellation (${itemMetrics.summaryLine})`}
                  aria-describedby={
                    isHovered ? 'constellation-node-tooltip' : undefined
                  }
                  className={`absolute px-2 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'z-30 bg-sky-400 text-slate-950 font-semibold shadow-lg shadow-sky-500/25 scale-105'
                      : isHovered
                      ? 'z-30 bg-sky-950 text-sky-100 border border-sky-300 shadow-md shadow-sky-500/20 scale-105'
                      : isNeighbor
                      ? 'z-20 bg-slate-900/95 text-sky-200 border border-sky-400/60 hover:border-sky-300'
                      : isCategoryMatch
                      ? 'z-10 bg-slate-900/80 text-slate-300 border border-slate-700/70 hover:text-white hover:border-slate-500'
                      : 'z-0 bg-slate-950/60 text-slate-500 border border-slate-800/40 opacity-45 hover:opacity-90'
                  }`}
                >
                  {item.shortLabel}
                </button>
              );
            })}

            {/* Interactive Hover / Focus Tooltip for Constellation Nodes */}
            {hoveredTech && tooltipPlacement && hoveredMetrics && (
              <div
                id="constellation-node-tooltip"
                role="tooltip"
                data-testid="constellation-node-tooltip"
                style={{
                  left: `${hoveredTech.x}%`,
                  top: `${hoveredTech.y}%`,
                  transform: `translate(${
                    tooltipPlacement.horizontal === 'left'
                      ? '-12%'
                      : tooltipPlacement.horizontal === 'right'
                      ? '-88%'
                      : '-50%'
                  }, ${
                    tooltipPlacement.vertical === 'below'
                      ? '18px'
                      : 'calc(-100% - 18px)'
                  })`,
                }}
                className="pointer-events-none absolute z-40 w-64 rounded-xl bg-slate-950/95 backdrop-blur-md border border-sky-400/50 p-3.5 shadow-2xl shadow-sky-950/60 transition-opacity duration-150"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-display font-bold text-white leading-snug">
                      {hoveredTech.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {hoveredTech.category}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-sky-300 tabular-nums shrink-0">
                    {hoveredMetrics.clampedScore}%
                  </span>
                </div>

                {/* Experience & Proficiency Level Metrics */}
                <div className="grid grid-cols-2 gap-2.5 mt-2.5 pt-2.5 border-t border-slate-800/90 text-[11px] font-mono">
                  <div>
                    <div className="text-slate-400">Experience</div>
                    <div className="text-slate-100 font-semibold tabular-nums mt-0.5">
                      {hoveredMetrics.yearsLabel}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Proficiency</div>
                    <div className="text-sky-300 font-semibold mt-0.5">
                      {hoveredMetrics.proficiencyLabel}
                    </div>
                  </div>
                </div>

                {/* Visual Proficiency Bar */}
                <div
                  className="w-full h-1.5 rounded-full bg-slate-800/90 overflow-hidden mt-2.5"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400"
                    style={{ width: `${hoveredMetrics.clampedScore}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-300 leading-snug mt-2">
                  {hoveredTech.roleSummary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Technology Deep-Dive Panel */}
        <div
          aria-live="polite"
          className="lg:col-span-5 rounded-2xl bg-[#0A0F1D] border border-sky-400/35 p-6 sm:p-8 flex flex-col justify-between gap-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs font-mono text-sky-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>ACTIVE NODE INSPECTOR</span>
              </span>
              <span className="text-slate-400">{activeTech.category}</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {activeTech.name}
              </h3>
              <p className="text-sm font-mono text-sky-300 mt-1">
                {activeTech.roleSummary}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300 tabular-nums mt-2.5">
                <span>Experience: {activeMetrics.yearsLabel}</span>
                <span aria-hidden="true" className="text-slate-500">
                  ·
                </span>
                <span>Proficiency: {activeMetrics.proficiencyLabel}</span>
                <span aria-hidden="true" className="text-slate-500">
                  ·
                </span>
                <span className="text-sky-300">
                  {activeMetrics.clampedScore}% Mastery
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              {activeTech.engineeringContext}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
              <span>CONNECTED ARCHITECTURAL NODES ({connectedIds.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {connectedIds.map((connId) => {
                const neighbor = TECH_STACK_DATA.find((t) => t.id === connId);
                if (!neighbor) return null;
                return (
                  <button
                    key={connId}
                    type="button"
                    onClick={() => setActiveTechId(neighbor.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-400/50 text-xs font-mono text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    → {neighbor.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 7 Structured Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCategories.map((category, idx) => {
          const items = TECH_STACK_DATA.filter((t) => t.category === category);
          return (
            <div
              key={category}
              className="rounded-2xl bg-[#0A0F1D]/80 border border-slate-800/80 p-6 flex flex-col justify-start gap-5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
                  <span className="text-sky-400">0{idx + 1}</span>
                  <span>{items.length} Technologies</span>
                </div>
                <h3 className="text-lg font-display font-semibold text-white">
                  {category}
                </h3>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-slate-800/70">
                {items.map((skill) => {
                  const isSelected = skill.id === activeTech.id;
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => setActiveTechId(skill.id)}
                      onMouseEnter={() => setHoveredTechId(skill.id)}
                      onMouseLeave={() =>
                        setHoveredTechId((prev) =>
                          prev === skill.id ? null : prev
                        )
                      }
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-sky-400/12 border-sky-400/60 text-white'
                          : 'bg-slate-900/45 border-slate-800/70 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-100">
                          {skill.name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {skill.roleSummary}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 tabular-nums mt-1.5">
                          <span className="text-sky-300">
                            {skill.yearsOfExperience}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{skill.proficiencyLevel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{skill.proficiencyScore}%</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-sky-400 shrink-0 mt-0.5">
                        Inspect
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

