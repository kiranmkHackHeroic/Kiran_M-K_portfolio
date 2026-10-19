import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  GitBranch,
  Github,
  ShieldAlert,
  X,
} from 'lucide-react';
import { ProjectCaseStudy } from '../data/portfolioData';
import { resolveProjectRepositoryUrl } from '../utils/physicsAndPortfolioLogic';
import { ProjectVisualPreview } from './ProjectVisualPreview';

interface ProjectDetailModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const [activeArchStep, setActiveArchStep] = useState<number>(0);
  const [copiedRepoUrl, setCopiedRepoUrl] = useState<boolean>(false);

  useEffect(() => {
    setActiveArchStep(0);
    setCopiedRepoUrl(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const repositoryUrl = resolveProjectRepositoryUrl(project);
  const effectiveRepoUrl = repositoryUrl ?? project.githubUrl;

  const isExternalLiveUrl = Boolean(
    project.liveUrl && /^https?:\/\//i.test(project.liveUrl)
  );

  const repoDisplayPath = effectiveRepoUrl.replace(
    /^https?:\/\/(www\.)?github\.com\//i,
    'github.com/'
  );

  const handleCopyRepoUrl = () => {
    if (!effectiveRepoUrl) return;
    navigator.clipboard?.writeText(effectiveRepoUrl).catch(() => {});
    setCopiedRepoUrl(true);
    setTimeout(() => setCopiedRepoUrl(false), 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#05070E]/88 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0A0F1D] border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Top Header */}
        <div className="shrink-0 flex items-start justify-between gap-4 border-b border-slate-800 px-6 sm:px-8 md:px-10 pt-6 pb-5 bg-[#0A0F1D]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400">
              <span>CASE STUDY {project.index}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{project.year}</span>
            </div>
            <h2
              id="case-study-modal-title"
              className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white text-balance"
            >
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study modal"
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-10 py-6 space-y-7">
          {/* Dedicated GitHub Repository Link Section */}
          {repositoryUrl && (
            <section
              aria-label="GitHub Repository Link"
              data-testid="modal-github-repo-section"
              className="rounded-xl bg-[#060A14] border border-sky-400/35 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <GitBranch className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>DEDICATED GITHUB REPOSITORY · SOURCE CODE</span>
                </div>
                <a
                  href={repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs sm:text-sm font-mono text-white hover:text-sky-300 underline decoration-sky-400/50 underline-offset-4 break-all transition-colors"
                >
                  {repoDisplayPath}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href={repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-md shadow-sky-500/15 whitespace-nowrap shrink-0"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>Open on GitHub</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyRepoUrl}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copiedRepoUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                      <span className="text-sky-300">Copied URL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          )}

          {/* High-Resolution Interactive Schematic Preview */}
          <div className="rounded-xl border border-slate-800 overflow-hidden h-64 sm:h-72">
            <ProjectVisualPreview theme={project.visualTheme} isHovered={false} />
          </div>

          {/* Problem Statement & Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-sm font-mono text-sky-400 tracking-wide">
                01. Problem Statement
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {project.problemStatement}
              </p>
            </div>

            <div className="space-y-2 md:border-l md:border-slate-800 md:pl-6">
              <h3 className="text-sm font-mono text-sky-400 tracking-wide">
                02. Technologies Used
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
                {project.technologies.join(' · ')}
              </p>
            </div>
          </div>

          {/* Interactive System Architecture Breakdown */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-mono text-sky-400 tracking-wide flex items-center gap-2">
                <Cpu className="w-4 h-4" aria-hidden="true" />
                <span>03. System Architecture</span>
              </h3>
              <span className="text-xs text-slate-400">
                Select a subsystem stage below to inspect its responsibility
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {project.systemArchitecture.overview}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {project.systemArchitecture.nodes.map((node, idx) => {
                const isSelected = activeArchStep === idx;
                return (
                  <button
                    key={node.label}
                    type="button"
                    onClick={() => setActiveArchStep(idx)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-mono text-sky-400 mb-1">
                      STAGE 0{idx + 1}
                    </div>
                    <div className="text-sm font-semibold text-slate-100 mb-1">
                      {node.label}
                    </div>
                    <div className="text-xs text-slate-300 leading-snug">
                      {node.role}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Individual Contribution & Engineering Challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-slate-800/80">
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-sky-400 tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>04. Individual Engineering Contribution</span>
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {project.individualContribution.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-mono text-violet-400 tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>05. Key Engineering Challenges</span>
              </h3>
              <div className="space-y-4">
                {project.engineeringChallenges.map((challenge) => (
                  <div
                    key={challenge.title}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                  >
                    <div className="text-sm font-semibold text-white">
                      {challenge.title}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {challenge.resolution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 06. Modal Footer with Conditional repositoryUrl GitHub Link Button */}
        <footer
          data-testid="project-modal-footer"
          className="shrink-0 flex flex-wrap items-center justify-between gap-4 px-6 sm:px-8 md:px-10 py-4 border-t border-slate-800 bg-[#060A14]"
        >
          <div className="flex flex-wrap items-center gap-3">
            {repositoryUrl && (
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="modal-footer-github-button"
                aria-label={`View source code on GitHub for ${project.title}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-md shadow-sky-500/20 whitespace-nowrap shrink-0"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                <span>View Source on GitHub</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}

            {project.liveUrl && project.liveUrl !== repositoryUrl && (
              <a
                href={project.liveUrl}
                target={isExternalLiveUrl ? '_blank' : undefined}
                rel={isExternalLiveUrl ? 'noopener noreferrer' : undefined}
                onClick={isExternalLiveUrl ? undefined : onClose}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0"
              >
                <span>Inspect Architecture</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Close (ESC)
          </button>
        </footer>
      </div>
    </div>
  );
};


