import React, { useMemo, useState } from 'react';
import { Activity, ArrowRight, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';
import {
  ARCHITECTURE_NODES,
  ArchitectureNodeSpec,
} from '../data/portfolioData';
import {
  ArchitectureFlowScenario,
  resolveArchitectureTracePath,
} from '../utils/physicsAndPortfolioLogic';

export const ArchitectureSection: React.FC = () => {
  const [scenario, setScenario] =
    useState<ArchitectureFlowScenario>('write-transaction');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('api-layer');

  const activeTrace = useMemo(
    () => resolveArchitectureTracePath(scenario),
    [scenario]
  );

  const selectedNode: ArchitectureNodeSpec = useMemo(() => {
    return (
      ARCHITECTURE_NODES.find((n) => n.id === selectedNodeId) ||
      ARCHITECTURE_NODES[0]
    );
  }, [selectedNodeId]);

  const primaryNodes = useMemo(
    () => ARCHITECTURE_NODES.filter((n) => n.tier === 'primary'),
    []
  );
  const auxiliaryNodes = useMemo(
    () => ARCHITECTURE_NODES.filter((n) => n.tier === 'auxiliary'),
    []
  );

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="relative py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-slate-800/70"
    >
      {/* Header + Scenario Simulator Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-mono tracking-widest text-sky-400">
            04. INTERACTIVE ENGINEERING ARCHITECTURE
          </p>
          <h2
            id="architecture-heading"
            className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white text-balance"
          >
            SYSTEMS DESIGNED FOR RESILIENCE.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Trace how requests move through a production full-stack topology—from edge authentication and RPC routing to distributed cache-aside layers, background worker queues, and ACID storage.
          </p>
        </div>

        {/* Request Trace Scenario Selector */}
        <div className="space-y-2">
          <span className="block text-xs font-mono text-slate-400">
            SIMULATE LIVE REQUEST FLOW:
          </span>
          <div
            role="group"
            aria-label="Select architecture request trace scenario"
            className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#0A0F1D] border border-slate-800"
          >
            {[
              { id: 'read-cached', label: 'Cached Read Path' },
              { id: 'write-transaction', label: 'ACID Write Transaction' },
              { id: 'async-pipeline', label: 'Async Worker Pipeline' },
            ].map((item) => {
              const isCurrent = scenario === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setScenario(item.id as ArchitectureFlowScenario)
                  }
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? 'bg-sky-400 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Architecture Diagram Container */}
      <div className="rounded-2xl bg-[#0A0F1D] border border-slate-800/90 p-6 sm:p-8 md:p-10 space-y-10">
        {/* Active Scenario Trace Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-3">
            <Activity
              className="w-5 h-5 text-sky-400 shrink-0 mt-0.5 sm:mt-0"
              aria-hidden="true"
            />
            <div>
              <div className="text-xs font-mono text-sky-400">
                ACTIVE DATAFLOW TRACE · {activeTrace.orderedNodeIds.length} STAGES ENGAGED
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {activeTrace.summary}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 shrink-0">
            Click or focus any component node to inspect
          </span>
        </div>

        {/* Primary Flow: CLIENT -> API LAYER -> BUSINESS LOGIC -> DATABASE */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400">
            PRIMARY CRITICAL PATH (CLIENT → API LAYER → BUSINESS LOGIC → DATABASE)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {primaryNodes.map((node, index) => {
              const isEngaged = activeTrace.orderedNodeIds.includes(node.id);
              const isSelected = selectedNode.id === node.id;

              return (
                <div key={node.id} className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    onFocus={() => setSelectedNodeId(node.id)}
                    className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 shadow-lg shadow-sky-500/10'
                        : isEngaged
                        ? 'bg-slate-900/90 border-sky-400/40 hover:border-sky-400'
                        : 'bg-slate-950/60 border-slate-800/70 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-sky-400">STAGE {node.stepIndex}</span>
                      <span className="text-slate-400 tabular-nums">
                        {node.latencyMetric}
                      </span>
                    </div>
                    <div className="text-base font-display font-bold text-white tracking-tight">
                      {node.title}
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {node.subtitle}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{node.protocol}</span>
                      <span className="text-sky-300">
                        {isEngaged ? 'Active' : 'Standby'}
                      </span>
                    </div>
                  </button>

                  {index < primaryNodes.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden md:flex items-center justify-center px-1 text-sky-400/70"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Auxiliary Infrastructure Nodes: Auth, Cache, Background Jobs, Logging & Monitoring */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400">
            EDGE SECURITY, CACHE, ASYNC WORKERS & OBSERVABILITY PLANES
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {auxiliaryNodes.map((node) => {
              const isEngaged = activeTrace.orderedNodeIds.includes(node.id);
              const isSelected = selectedNode.id === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  onFocus={() => setSelectedNodeId(node.id)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-500/15 border-violet-400 shadow-lg shadow-violet-500/10'
                      : isEngaged
                      ? 'bg-slate-900/80 border-violet-400/40 hover:border-violet-400'
                      : 'bg-slate-950/50 border-slate-800/70 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-violet-300">SUBSYSTEM</span>
                    <span className="text-slate-400 tabular-nums">
                      {node.latencyMetric}
                    </span>
                  </div>
                  <div className="text-sm font-display font-semibold text-white">
                    {node.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {node.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Focused Component Responsibility Inspector */}
        <div
          aria-live="polite"
          className="rounded-xl bg-[#060A14] border border-slate-800 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <Cpu className="w-4 h-4" aria-hidden="true" />
              <span>COMPONENT RESPONSIBILITY INSPECTOR</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white">
              {selectedNode.title} — {selectedNode.subtitle}
            </h3>
            <p className="text-xs font-mono text-slate-400 tabular-nums">
              Protocol: {selectedNode.protocol} · Target SLA: {selectedNode.latencyMetric}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              {selectedNode.responsibility}
            </p>
          </div>

          <div className="lg:col-span-7 lg:border-l lg:border-slate-800 lg:pl-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-violet-300">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>PRODUCTION INVARIANTS & FAILURE MITIGATION</span>
            </div>
            <div className="space-y-3">
              {selectedNode.engineeringDetails.map((detail) => (
                <div
                  key={detail}
                  className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800/90 flex items-start gap-3"
                >
                  <CheckCircle2
                    className="w-4 h-4 text-sky-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
