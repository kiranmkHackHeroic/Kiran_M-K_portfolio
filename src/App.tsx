import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Compass,
  Download,
  FileText,
  Github,
  Linkedin,
  Mail,
  Moon,
  Phone,
  Sliders,
  Sun,
  Terminal,
} from 'lucide-react';
import {
  ACHIEVEMENTS_DATA,
  CERTIFICATIONS_DATA,
  EXPERIENCE_DATA,
  PROJECTS_DATA,
  ProjectCaseStudy,
} from './data/portfolioData';
import {
  filterProjects,
  resolveThemePalette,
  ThemeMode,
  toggleThemeMode,
} from './utils/physicsAndPortfolioLogic';
import { HeroScene3D, MaterialFinishPreset } from './components/HeroScene3D';
import { ContactScene3D } from './components/ContactScene3D';
import { ProjectCard3D } from './components/ProjectCard3D';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { TechStackSection } from './components/TechStackSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { ResumeModal } from './components/ResumeModal';
import { JumpToSectionModal } from './components/JumpToSectionModal';

const NAV_SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'contact', label: 'Contact' },
] as const;

const PROJECT_CATEGORIES = [
  'All Work',
  'AI & 3D Vision',
  'Full-Stack & Healthcare',
  'AI & EdTech',
  'Research & Publication',
  'APIs & Open Source',
] as const;

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Theme Mode: Default 'midnight' with 'day' glassmorphism toggle
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem('kiran-portfolio-theme');
      return saved === 'day' ? 'day' : 'midnight';
    } catch {
      return 'midnight';
    }
  });

  // Sync themeMode with document root & localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    try {
      window.localStorage.setItem('kiran-portfolio-theme', themeMode);
    } catch {
      // ignore storage errors
    }
  }, [themeMode]);

  // 3D Hero Centerpiece Interactive Controls (Collapsible Bottom Dock)
  const [finishPreset, setFinishPreset] =
    useState<MaterialFinishPreset>('optical-glass');
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Project Showcase State
  const [activeCategory, setActiveCategory] = useState<string>('All Work');
  const [selectedProject, setSelectedProject] =
    useState<ProjectCaseStudy | null>(null);

  // Resume, Jump Modal & Contact State
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isJumpModalOpen, setIsJumpModalOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Keyboard shortcuts: 'K' to open Jump to Section modal, 'H' to toggle 3D HUD Dock, 'T' to toggle Midnight/Day theme
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const targetTag = (e.target as HTMLElement)?.tagName || '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) return;

      const key = e.key.toLowerCase();
      if (key === 'k' && !isJumpModalOpen) {
        e.preventDefault();
        setIsJumpModalOpen(true);
      } else if (key === 'h' && !isJumpModalOpen) {
        setIsDockCollapsed((prev) => !prev);
      } else if (key === 't' && !isJumpModalOpen) {
        setThemeMode((prev) => toggleThemeMode(prev));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isJumpModalOpen]);

  // Scroll tracking for compact navigation bar & active section indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 36);

      const sectionIds = [
        'hero',
        'about',
        'work',
        'stack',
        'architecture',
        'contact',
      ];
      let current = 'hero';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects = useMemo(
    () => filterProjects(PROJECTS_DATA, activeCategory),
    [activeCategory]
  );

  const themePalette = useMemo(
    () => resolveThemePalette(themeMode),
    [themeMode]
  );

  const handleToggleTheme = () => {
    setThemeMode((prev) => toggleThemeMode(prev));
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('kiranmk1803@gmail.com').catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 bg-[#05070E] text-[#F1F5F9] bg-film-grain relative selection:bg-sky-400/25 ${
        themeMode === 'day' ? 'theme-day' : 'theme-midnight'
      }`}
    >
      {/* Subtle Ambient Background Lighting Gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className={`absolute -top-48 left-1/4 w-[38rem] h-[38rem] rounded-full blur-[140px] transition-colors duration-500 ${
            themeMode === 'day' ? 'bg-sky-400/18' : 'bg-sky-500/8'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full blur-[140px] transition-colors duration-500 ${
            themeMode === 'day' ? 'bg-indigo-400/15' : 'bg-violet-500/8'
          }`}
        />
      </div>

      {/* Strict 3-Zone Top Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#05070E]/92 border-b border-slate-800/80 py-3.5 shadow-lg shadow-black/40'
            : 'bg-transparent py-5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between gap-8">
          {/* Zone 1: Highlighted Name Wordmark in Header */}
          <a
            href="#hero"
            data-testid="header-name-highlight"
            className="header-brand-highlight group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-sky-400/12 hover:bg-sky-400/20 border border-sky-400/45 hover:border-sky-300 shadow-[0_0_22px_rgba(56,189,248,0.22)] transition-all whitespace-nowrap shrink-0"
          >
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38BDF8]"
            />
            <span className="header-brand-name text-lg sm:text-xl font-display font-bold tracking-tight bg-gradient-to-r from-white via-sky-200 to-cyan-300 bg-clip-text text-transparent">
              Kiran M K
            </span>
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Portfolio Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
          >
            {NAV_SECTIONS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-sky-400 rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 320,
                        damping: 28,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Subtle Theme Toggle + Primary Action Button (2 elements total) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={themePalette.toggleActionLabel}
              title={themePalette.toggleActionLabel}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0A0F1D]/85 hover:bg-slate-900 border border-slate-800 hover:border-sky-400/50 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {themeMode === 'midnight' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                  <span>Day</span>
                </>
              ) : (
                <>
                  <Moon
                    className="w-3.5 h-3.5 text-sky-400"
                    aria-hidden="true"
                  />
                  <span>Midnight</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              View Resume
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* 1. ANIMATED HERO EXPERIENCE */}
        <section
          id="hero"
          aria-labelledby="hero-heading"
          className="relative min-h-screen flex flex-col justify-center pt-24 pb-32 px-6 sm:px-10 overflow-hidden"
        >
          {/* 3D WebGL Centerpiece Canvas */}
          <Suspense fallback={null}>
            <HeroScene3D
              finishPreset={finishPreset}
              explodedFactor={explodedFactor}
              speedMultiplier={speedMultiplier}
              reducedMotion={reducedMotion}
              themeMode={themeMode}
            />
          </Suspense>

          {/* Hero Foreground Content */}
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-none">
            <div className="lg:col-span-7 space-y-6 pointer-events-auto rounded-2xl bg-[#05070E]/75 lg:bg-transparent p-5 sm:p-6 lg:p-0">
              {/* Availability Label (Static editorial typography — zero pulsing dot) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="inline-flex items-center gap-2.5 text-xs font-mono tracking-widest text-sky-400"
              >
                <span>00</span>
                <span aria-hidden="true">·</span>
                <span>OPEN TO SOFTWARE ENGINEERING OPPORTUNITIES</span>
              </motion.div>

              {/* Oversized Editorial Headline */}
              <motion.h1
                id="hero-heading"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12 }}
                className="font-display font-bold tracking-tight text-white leading-[1.06] text-balance"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
              >
                I BUILD{' '}
                <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
                  DIGITAL EXPERIENCES
                </span>{' '}
                THAT{' '}
                <span className="bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
                  FEEL ALIVE.
                </span>
              </motion.h1>

              {/* Concise Introduction Aligned to Resume (CGPA removed from home page) */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22 }}
                className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed"
              >
                I’m <strong className="text-sky-300 font-semibold">Kiran M K</strong>, a Computer Science and Business Systems undergraduate at{' '}
                <strong className="text-white font-medium">BMS College of Engineering, Bengaluru</strong>, building full-stack applications and REST APIs with Java, Python, React.js, Spring Boot, and FastAPI.
              </motion.p>

              {/* Animated CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <a
                  href="#work"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-sky-500/20 whitespace-nowrap shrink-0"
                >
                  <span>Explore My Work</span>
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0A0F1D]/90 hover:bg-slate-900 border border-slate-700/80 hover:border-sky-400/50 text-slate-100 font-medium text-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <FileText className="w-4 h-4 text-sky-400" aria-hidden="true" />
                  <span>View Resume</span>
                </button>
              </motion.div>

              {/* Subtle Architectural Spec Line & Direct Clickable Profile Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="pt-4 space-y-2.5 text-xs font-mono text-slate-400 tabular-nums"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Java 17 & Spring Boot</span>
                  <span aria-hidden="true">·</span>
                  <span>React.js & FastAPI</span>
                  <span aria-hidden="true">·</span>
                  <span>SIH Finalist & Published Researcher</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <a
                    href="https://github.com/kiranmkHackHeroic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Github className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/kiran-m-k-43a5aa299/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  </a>

                  <a
                    href="https://leetcode.com/u/Kiranmk1803/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>LeetCode</span>
                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right column leaves unobstructed space for the 3D centerpiece */}
            <div className="lg:col-span-5 hidden lg:block h-[420px]" aria-hidden="true" />
          </div>

          {/* Unified Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
          <div className="relative mt-6 mx-auto lg:mt-0 lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2 z-30 w-full max-w-[min(860px,92vw)] flex flex-col items-center pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsDockCollapsed((prev) => !prev)}
              aria-expanded={!isDockCollapsed}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-t-lg bg-[#0A0F1D] border border-b-0 border-slate-800 text-[11px] font-mono text-slate-300 hover:text-sky-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>
                {isDockCollapsed
                  ? 'Show 3D Galaxy Inspector (H)'
                  : 'Hide 3D Galaxy Inspector (H)'}
              </span>
              {isDockCollapsed ? (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>

            {!isDockCollapsed && (
              <div className="w-full rounded-xl bg-[#0A0F1D]/95 border border-slate-800/90 px-3 sm:px-4 py-2.5 sm:py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                {/* Material Finish Selector */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap shrink-0">
                    GALAXY CORE:
                  </span>
                  <div
                    role="group"
                    aria-label="3D Galaxy Core Material Finish"
                    className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800"
                  >
                    {[
                      { id: 'optical-glass', label: 'Optical Crystal' },
                      { id: 'brushed-chrome', label: 'Titanium' },
                      { id: 'wireframe-lattice', label: 'Lattice' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          setFinishPreset(preset.id as MaterialFinishPreset)
                        }
                        className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          finishPreset === preset.id
                            ? 'bg-sky-400 text-slate-950 font-semibold'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exploded View Slider */}
                <div className="flex items-center gap-2.5">
                  <label
                    htmlFor="exploded-view-slider"
                    className="text-[11px] font-mono text-slate-400 whitespace-nowrap shrink-0"
                  >
                    EXPLODED VIEW:
                  </label>
                  <input
                    id="exploded-view-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={explodedFactor}
                    onChange={(e) =>
                      setExplodedFactor(parseFloat(e.target.value))
                    }
                    className="w-24 sm:w-28 accent-sky-400 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-sky-300 tabular-nums w-9">
                    {Math.round(explodedFactor * 100)}%
                  </span>
                </div>

                {/* Orbital Speed Selector + Jump to Section Trigger */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap shrink-0">
                      ORBIT:
                    </span>
                    {[0.5, 1, 2].map((mult) => (
                      <button
                        key={mult}
                        type="button"
                        onClick={() => setSpeedMultiplier(mult)}
                        className={`px-2 py-1 rounded text-xs font-mono transition-colors cursor-pointer tabular-nums whitespace-nowrap shrink-0 ${
                          speedMultiplier === mult
                            ? 'bg-slate-800 text-sky-300 border border-sky-400/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {mult}x
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsJumpModalOpen(true)}
                    aria-label="Open Jump to Section shortcut modal (Press K)"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-sky-300 transition-colors pl-2 border-l border-slate-800 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Jump (K)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. ABOUT SECTION — EDITORIAL DESIGN + EXPERIENCE, ACHIEVEMENTS & CERTIFICATIONS */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="relative py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-slate-800/70"
        >
          {/* Floating Geometric SVG Decoration */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            className="hidden lg:block absolute top-16 right-10 w-24 h-24 text-sky-400/20 pointer-events-none"
          >
            <polygon
              points="60,8 110,38 110,82 60,112 10,82 10,38"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="60"
              cy="60"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Primary Editorial Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <p className="text-xs font-mono tracking-widest text-sky-400">
                01. EDITORIAL PROFILE & CREDENTIALS
              </p>
              <h2
                id="about-heading"
                className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white text-balance"
              >
                A LITTLE ABOUT ME.
              </h2>
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-normal">
                I am a Computer Science and Business Systems undergraduate at{' '}
                <strong className="text-white font-semibold">
                  BMS College of Engineering, Bengaluru
                </strong>{' '}
                building full-stack web platforms and resilient REST APIs with Java, Python, React.js, Spring Boot, and FastAPI.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                From architecting hospital batch-expiry predictors with First-Expiry-First-Out (FEFO) logic and SSL-secured Aiven Cloud MySQL to building Gemini AI code explainers covering 100+ algorithmic problems, I focus on clean API contracts, unit testing, and Dockerized cloud deployments.
              </p>

              {/* Experience Timeline (Bluestock & GirlScript Summer of Code) */}
              <div className="pt-6 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 tracking-wider">
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                  <span>INDUSTRY & OPEN-SOURCE EXPERIENCE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {EXPERIENCE_DATA.map((exp) => (
                    <div
                      key={exp.id}
                      className="rounded-xl bg-[#0A0F1D] border border-slate-800/90 p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
                        <span className="text-sky-300">{exp.organization}</span>
                        <span>{exp.period}</span>
                      </div>
                      <div className="text-base font-display font-semibold text-white">
                        {exp.role}
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed pt-1">
                        {exp.highlights.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Secondary Column: Education, Achievements & Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 rounded-2xl bg-[#0A0F1D] border border-slate-800/90 p-6 sm:p-8 space-y-6"
            >
              {/* Education */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-sky-400 tabular-nums">
                  <span>EDUCATION · BENGALURU, INDIA</span>
                  <span>Oct 2023 – Jul 2027</span>
                </div>
                <div className="text-base sm:text-lg font-display font-bold text-white">
                  BMS College of Engineering
                </div>
                <div className="text-xs sm:text-sm text-slate-200">
                  B.E. in Computer Science and Business Systems
                </div>
              </div>

              {/* Honours, SIH & Research Publication */}
              <div className="space-y-3 pt-5 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <Award className="w-4 h-4" aria-hidden="true" />
                  <span>ACHIEVEMENTS & RESEARCH PUBLICATION</span>
                </div>
                <div className="space-y-3">
                  {ACHIEVEMENTS_DATA.map((ach) => (
                    <div key={ach.title} className="space-y-0.5">
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {ach.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ach.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Certifications */}
              <div className="space-y-3 pt-5 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-mono text-violet-300">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>CERTIFICATIONS</span>
                </div>
                <div className="space-y-2 text-xs">
                  {CERTIFICATIONS_DATA.map((cert) => (
                    <div
                      key={cert.title}
                      className="flex items-baseline justify-between gap-2 text-slate-300"
                    >
                      <div>
                        <span className="text-white font-semibold">
                          {cert.issuer}
                        </span>{' '}
                        · {cert.title}
                      </div>
                      <span className="font-mono text-slate-400 tabular-nums shrink-0">
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Three Minimalist Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              {
                index: '01',
                title: 'Problem Solver.',
                description:
                  'Smart India Hackathon (SIH) Finalist and Top 50 out of 1,000 in college coding clubs, mastering 100+ DSA problems across 15+ algorithmic patterns.',
                icon: Code2,
              },
              {
                index: '02',
                title: 'Software Engineer in Progress.',
                description:
                  'Builds full-stack platforms and tested REST APIs using Java 17, Spring Boot, Python, FastAPI, React.js, MySQL, and Dockerized cloud deployments.',
                icon: Compass,
              },
              {
                index: '03',
                title: 'AI and Technology Explorer.',
                description:
                  'Certified in Google Cloud Generative AI & Nutanix Multicloud Infrastructure, integrating Gemini AI into interactive developer learning tools.',
                icon: BrainCircuit,
              },
            ].map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="group rounded-2xl bg-[#0A0F1D]/85 border border-slate-800/80 hover:border-sky-400/50 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between gap-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-sky-400 tabular-nums">
                      {feature.index}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-sky-400/40 group-hover:scale-105 transition-transform">
                      <IconComponent
                        className="w-5 h-5 text-sky-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 3. PROJECT SHOWCASE — INTERACTIVE 3D CARDS */}
        <section
          id="work"
          aria-labelledby="work-heading"
          className="relative py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-slate-800/70"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div className="space-y-3 max-w-xl">
              <p className="text-xs font-mono tracking-widest text-sky-400">
                02. ENGINEERING CASE STUDIES & RESEARCH
              </p>
              <h2
                id="work-heading"
                className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white"
              >
                SELECTED WORK.
              </h2>
              <p className="text-base sm:text-lg text-slate-300">
                Experiments, engineering, and ideas brought to life.
              </p>
            </div>

            {/* Interactive Category Filter Controls */}
            <div
              role="group"
              aria-label="Filter projects by engineering domain"
              className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#0A0F1D] border border-slate-800"
            >
              {PROJECT_CATEGORIES.map((category) => {
                const isSelected = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-sky-400 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Asymmetric Bento Project Grid */}
          <div className="grid grid-cols-12 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard3D
                key={project.id}
                project={project}
                onSelect={(proj) => setSelectedProject(proj)}
              />
            ))}
          </div>
        </section>

        {/* 4. TECH STACK — ANIMATED VISUALIZATION & CONSTELLATION */}
        <TechStackSection />

        {/* 5. INTERACTIVE ENGINEERING ARCHITECTURE */}
        <ArchitectureSection />

        {/* 6. CONTACT SECTION — MEMORABLE FINISH */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="relative py-24 sm:py-32 px-6 sm:px-10 max-w-7xl mx-auto border-t border-slate-800/70 overflow-hidden"
        >
          <div className="rounded-3xl bg-gradient-to-b from-[#0A0F1D] to-[#060913] border border-slate-800/90 p-8 sm:p-12 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-mono tracking-widest text-sky-400">
                05. INITIATE CONVERSATION · BENGALURU, INDIA
              </p>
              <h2
                id="contact-heading"
                className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-white leading-tight text-balance"
              >
                LET'S BUILD SOMETHING EXTRAORDINARY.
              </h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Have an opportunity, an interesting idea, or a project in mind? Let's connect.
              </p>

              {/* Contact Actions: Email Button, Copy Email, Phone, Resume */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="mailto:kiranmk1803@gmail.com"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-sky-500/20 whitespace-nowrap shrink-0"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>kiranmk1803@gmail.com</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {copiedEmail ? (
                    <>
                      <Check
                        className="w-4 h-4 text-sky-400"
                        aria-hidden="true"
                      />
                      <span className="text-sky-300">
                        Copied kiranmk1803@gmail.com
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy
                        className="w-4 h-4 text-slate-400"
                        aria-hidden="true"
                      />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href="tel:+919740374098"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-mono tabular-nums transition-colors whitespace-nowrap shrink-0"
                >
                  <Phone className="w-4 h-4 text-sky-400" aria-hidden="true" />
                  <span>+91 9740374098</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download
                    className="w-4 h-4 text-violet-400"
                    aria-hidden="true"
                  />
                  <span>Resume</span>
                </button>
              </div>

              {/* Social & Coding Links: GitHub, LinkedIn, LeetCode */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-800/80 text-sm font-medium text-slate-300">
                <a
                  href="https://github.com/kiranmkHackHeroic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  <Github className="w-4 h-4 text-sky-400" aria-hidden="true" />
                  <span className="border-b border-transparent group-hover:border-sky-400 transition-colors">
                    GitHub (kiranmkHackHeroic)
                  </span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="https://www.linkedin.com/in/kiran-m-k-43a5aa299/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  <Linkedin
                    className="w-4 h-4 text-sky-400"
                    aria-hidden="true"
                  />
                  <span className="border-b border-transparent group-hover:border-sky-400 transition-colors">
                    LinkedIn
                  </span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="https://leetcode.com/u/Kiranmk1803/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  <Terminal
                    className="w-4 h-4 text-sky-400"
                    aria-hidden="true"
                  />
                  <span className="border-b border-transparent group-hover:border-sky-400 transition-colors">
                    LeetCode (Kiranmk1803)
                  </span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            {/* Floating Abstract 3D Shape */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <Suspense fallback={null}>
                <ContactScene3D
                  reducedMotion={reducedMotion}
                  themeMode={themeMode}
                />
              </Suspense>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer with Clean Typography */}
      <footer className="border-t border-slate-800/70 py-8 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Kiran M K · BMS College of Engineering, Bengaluru.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/kiranmkHackHeroic"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kiran-m-k-43a5aa299/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://leetcode.com/u/Kiranmk1803/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LeetCode
            </a>
            <button
              type="button"
              onClick={handleToggleTheme}
              className="hover:text-white transition-colors cursor-pointer font-mono"
            >
              Theme: {themePalette.label} (T)
            </button>
            <button
              type="button"
              onClick={() => setIsJumpModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer font-mono"
            >
              Jump to Section (K)
            </button>
            <a href="#hero" className="hover:text-white transition-colors">
              Back to Top ↑
            </a>
            <button
              type="button"
              onClick={() => setIsResumeOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Resume
            </button>
          </div>
        </div>
      </footer>

      {/* Project Case Study Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Interactive Resume Viewer & Download Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Jump to Section Keyboard Shortcut Modal (K) */}
      <JumpToSectionModal
        isOpen={isJumpModalOpen}
        activeSectionId={activeSection}
        onClose={() => setIsJumpModalOpen(false)}
        onNavigate={(sectionId) => {
          const targetEl = document.getElementById(sectionId);
          if (targetEl) {
            targetEl.scrollIntoView({
              behavior: reducedMotion ? 'auto' : 'smooth',
            });
            setActiveSection(sectionId);
          }
        }}
      />
    </div>
  );
}
