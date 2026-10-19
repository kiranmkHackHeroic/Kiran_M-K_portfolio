import React, { useEffect, useState } from 'react';
import { ArrowDownUp, CornerDownLeft, Compass, X } from 'lucide-react';
import {
  JumpSectionItem,
  PORTFOLIO_JUMP_SECTIONS,
  resolveJumpKeyCommand,
} from '../utils/physicsAndPortfolioLogic';

interface JumpToSectionModalProps {
  isOpen: boolean;
  activeSectionId: string;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export const JumpToSectionModal: React.FC<JumpToSectionModalProps> = ({
  isOpen,
  activeSectionId,
  onClose,
  onNavigate,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  // Sync initial highlighted option with the currently visible section when opened
  useEffect(() => {
    if (!isOpen) return;
    const foundIdx = PORTFOLIO_JUMP_SECTIONS.findIndex(
      (s) => s.id === activeSectionId
    );
    setHighlightedIndex(foundIdx >= 0 ? foundIdx : 0);
  }, [isOpen, activeSectionId]);

  // Handle arrow keys, number keys (1-6), Enter, and Escape while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Ctrl/Cmd/Alt combinations to pass through untouched
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const outcome = resolveJumpKeyCommand(
        e.key,
        highlightedIndex,
        PORTFOLIO_JUMP_SECTIONS
      );

      if (outcome.type === 'move') {
        e.preventDefault();
        e.stopPropagation();
        setHighlightedIndex(outcome.nextIndex);
      } else if (outcome.type === 'select') {
        e.preventDefault();
        e.stopPropagation();
        onNavigate(outcome.selectedSection.id);
        onClose();
      } else if (outcome.type === 'close') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, highlightedIndex, onNavigate, onClose]);

  if (!isOpen) return null;

  const handleSelectSection = (item: JumpSectionItem) => {
    onNavigate(item.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="jump-to-section-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-[#05070E]/85"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-[#0A0F1D] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <Compass className="w-4 h-4 text-sky-400 shrink-0" aria-hidden="true" />
            <h2
              id="jump-to-section-title"
              className="text-sm font-mono tracking-wider text-white font-semibold whitespace-nowrap"
            >
              JUMP TO SECTION
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-[11px] font-mono text-slate-400 whitespace-nowrap">
              Press 1–6 or ↑/↓
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Jump to Section modal"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Section Options List */}
        <div
          role="listbox"
          aria-label="Portfolio sections"
          className="p-3 space-y-1.5"
        >
          {PORTFOLIO_JUMP_SECTIONS.map((section, idx) => {
            const isHighlighted = idx === highlightedIndex;
            const isCurrentSection = section.id === activeSectionId;

            return (
              <button
                key={section.id}
                type="button"
                role="option"
                aria-selected={isHighlighted}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => handleSelectSection(section)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                  isHighlighted
                    ? 'bg-sky-400/15 border-sky-400 text-white shadow-sm'
                    : 'bg-slate-900/45 border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <kbd
                    className={`w-7 h-7 rounded-lg font-mono text-xs flex items-center justify-center shrink-0 tabular-nums border ${
                      isHighlighted
                        ? 'bg-sky-400 text-slate-950 border-sky-300 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {section.numberKey}
                  </kbd>
                  <div className="min-w-0">
                    <div className="text-sm font-display font-semibold text-white flex items-center gap-2">
                      <span className="truncate">{section.title}</span>
                      {isCurrentSection && (
                        <span className="text-[11px] font-mono text-sky-400 font-normal shrink-0">
                          · Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {section.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0">
                  {isHighlighted && (
                    <span className="text-sky-300 flex items-center gap-1">
                      <span>Jump</span>
                      <CornerDownLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard Legend Footer */}
        <div className="px-5 py-3 bg-[#060A14] border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <ArrowDownUp className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>↑/↓ Navigate</span>
            </span>
            <span>1–6 Instant Jump</span>
            <span>Enter Select</span>
          </div>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
};
