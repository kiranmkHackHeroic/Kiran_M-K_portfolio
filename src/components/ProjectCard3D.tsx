import React, { useRef, useState } from 'react';
import { ArrowUpRight, Github, Layers } from 'lucide-react';
import { ProjectCaseStudy } from '../data/portfolioData';
import { computeCardTilt } from '../utils/physicsAndPortfolioLogic';
import { ProjectVisualPreview } from './ProjectVisualPreview';

interface ProjectCard3DProps {
  project: ProjectCaseStudy;
  onSelect: (project: ProjectCaseStudy) => void;
}

export const ProjectCard3D: React.FC<ProjectCard3DProps> = ({
  project,
  onSelect,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt(computeCardTilt(e.clientX, e.clientY, rect, 4.5));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: isHovered
          ? `perspective(1100px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-4px)`
          : 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      }}
      className={`group relative rounded-2xl bg-[#0A0F1D]/90 border border-slate-800/80 hover:border-sky-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        project.featuredSpan === 'wide'
          ? 'col-span-12 lg:col-span-7'
          : 'col-span-12 lg:col-span-5'
      }`}
    >
      {/* Dynamic pointer edge highlight */}
      <div
        aria-hidden="true"
        style={{
          background: isHovered
            ? `radial-gradient(500px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(56, 189, 248, 0.11), transparent 65%)`
            : 'none',
        }}
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
      />

      {/* Preview Artwork Container */}
      <div className="relative h-60 sm:h-68 w-full border-b border-slate-800/70 overflow-hidden">
        <ProjectVisualPreview theme={project.visualTheme} isHovered={isHovered} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-transparent opacity-70"
        />
      </div>

      {/* Card Body */}
      <div className="relative z-20 p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
        <div className="space-y-3">
          {/* Clean Unboxed Metadata Header (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 tabular-nums">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-medium">{project.index}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.year}</span>
            </div>
            <span className="text-slate-400 group-hover:text-sky-300 transition-colors">
              {project.systemArchitecture.nodes.length} Architecture Tiers
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-display font-semibold tracking-tight text-slate-100 group-hover:text-white transition-colors text-balance">
            {project.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {project.summary}
          </p>
        </div>

        <div className="space-y-5 pt-2 border-t border-slate-800/70">
          {/* Technology Tags as Clean Unboxed Inline Text with · Separators */}
          <div
            aria-label={`Technologies used in ${project.title}`}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-400"
          >
            {project.technologies.map((tech, idx) => (
              <React.Fragment key={tech}>
                <span className="text-slate-300">{tech}</span>
                {idx < project.technologies.length - 1 && (
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Interactive Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-400/15 hover:bg-sky-400/25 border border-sky-400/40 text-sky-200 text-xs sm:text-sm font-medium transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap shrink-0"
            >
              <Layers className="w-4 h-4 text-sky-400" aria-hidden="true" />
              <span>View Project</span>
            </button>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub repository for ${project.title}`}
                className="inline-flex items-center gap-1.5 hover:text-sky-300 transition-colors py-1.5 whitespace-nowrap shrink-0"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                <span>Source</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  aria-label={`Interactive demo for ${project.title}`}
                  className="inline-flex items-center gap-1.5 hover:text-violet-300 transition-colors py-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
