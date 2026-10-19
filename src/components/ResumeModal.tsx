import React, { useEffect } from 'react';
import { Download, ExternalLink, Printer, X } from 'lucide-react';
import {
  ACHIEVEMENTS_DATA,
  CERTIFICATIONS_DATA,
  EXPERIENCE_DATA,
} from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESUME_PDF_URL = '/Kiran_M_K_Resume.pdf';

const RESUME_PLAIN_TEXT = `KIRAN M K
Software Engineering Student | Full-Stack Development
+91 9740374098 | kiranmk1803@gmail.com
LinkedIn: https://www.linkedin.com/in/kiran-m-k-43a5aa299/
GitHub: https://github.com/kiranmkHackHeroic
LeetCode: https://leetcode.com/u/Kiranmk1803/

PROFESSIONAL SUMMARY
Computer Science and Business Systems undergraduate building full-stack applications and REST APIs with Java, Python, React.js, Spring Boot, and FastAPI. Experience in unit testing and Docker-based deployment.

EDUCATION
BMS College of Engineering (Oct 2023 – Jul 2027 Expected) | Bengaluru, India
Bachelor of Engineering, Computer Science and Business Systems | CGPA: 8.6

TECHNICAL SKILLS
- Languages: Java, Python
- Full Stack: React.js, Node.js, Spring Boot, FastAPI, REST APIs, HTML, Tailwind CSS
- Databases: MySQL, MongoDB
- Core CS: Data Structures & Algorithms, OOP's, Operating Systems, Computer Networks
- Testing & Tools: Unit Testing, Git, GitHub, Bash
- Cloud & DevOps: Docker, AWS, Vercel, Render, Kubernetes (basics)

EXPERIENCE
Software Developer Intern — Bluestock | Remote (Oct 2025 – Nov 2025)
- Gained exposure to REST API concepts, including HTTP methods, status codes, and JSON request/response handling.
- Learned backend API testing fundamentals, including endpoint validation and response verification.

Open Source Contributor — GirlScript Summer of Code (GSSoC) | Remote
- Collaborated with maintainers through GitHub issues and pull requests on documentation, features, and code quality.

PROJECTS
1. MediPulse Pro – Inventory & Expiry Predictor
   Java 17, Spring Boot, MySQL (Aiven Cloud), Docker, Render
   - Built a hospital inventory platform with batch-level expiry tracking and stock management across six wards.
   - Validated first-expiry-first-out (FEFO) prioritization, formula-based reorder logic, expiry alerts, and low-stock recommendations using synthetic data.
   - Implemented JWT-based role access and SSL-secured MySQL connectivity; deployed with Docker on Render.

2. DSA Logic Builder
   React.js, Tailwind CSS, Gemini AI, Node.js, JWT
   - Built a Gemini-powered code explainer for Python, Java, C++, and JavaScript with step-by-step explanations, variable tracking, and boundary-error highlighting.
   - Created a seven-step interview-practice learning path covering 100+ questions and 15+ algorithmic patterns.

RESEARCH PUBLICATION
Published Research Article (2026)
International Journal of Drug Delivery Technology, Vol. 16, Issue 7.

ACHIEVEMENTS
- Smart India Hackathon (SIH): Selected as a finalist after developing and finalizing a project for the competition.
- College Coding Clubs: Placed among the top 50 out of 1,000 participants in college coding-club activities.

CERTIFICATIONS
- Nutanix – Certified Associate 6 – Multicloud Infrastructure (Apr 2026)
- Oracle Academy – Java Programming Fundamentals (Nov 2025)
- Google Cloud – Generative AI (Jun 2025)
- Oracle Academy – Database Programming (May 2025)
`;

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = RESUME_PDF_URL;
    link.download = 'Kiran_M_K_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintResume = () => {
    // Open the official PDF in a print/view tab or print via hidden iframe
    const existingIframe = document.getElementById('resume-print-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'resume-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = RESUME_PDF_URL;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.open(RESUME_PDF_URL, '_blank');
      }
    };
  };

  const handleOpenPdf = () => {
    window.open(RESUME_PDF_URL, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#05070E]/88 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0A0F1D] border border-slate-700/80 shadow-2xl p-6 sm:p-8 md:p-10 text-slate-100 space-y-6"
      >
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs font-mono text-sky-400">
              SOFTWARE ENGINEERING STUDENT · FULL-STACK DEVELOPMENT
            </p>
            <h2
              id="resume-modal-title"
              className="text-2xl sm:text-3xl font-display font-bold text-white"
            >
              Kiran M K
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadResume}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-400 text-slate-950 hover:bg-sky-300 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Download official PDF resume"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={handlePrintResume}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Print official PDF resume"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleOpenPdf}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Open official PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>Open PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume modal"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Contact Bar with Clickable Profile Links */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-4 border-b border-slate-800/80 text-xs font-mono text-slate-300 tabular-nums">
          <a
            href="tel:+919740374098"
            className="hover:text-sky-300 transition-colors"
          >
            +91 9740374098
          </a>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <a
            href="mailto:kiranmk1803@gmail.com"
            className="hover:text-sky-300 transition-colors"
          >
            kiranmk1803@gmail.com
          </a>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span>Bengaluru, India</span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <a
            href="https://www.linkedin.com/in/kiran-m-k-43a5aa299/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline underline-offset-4 transition-colors"
          >
            LinkedIn
          </a>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <a
            href="https://github.com/kiranmkHackHeroic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline underline-offset-4 transition-colors"
          >
            GitHub
          </a>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <a
            href="https://leetcode.com/u/Kiranmk1803/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline underline-offset-4 transition-colors"
          >
            LeetCode
          </a>
        </div>

        <div className="space-y-6 text-sm text-slate-300">
          {/* Professional Summary */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-mono text-sky-400 tracking-wider">
              01. PROFESSIONAL SUMMARY
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Computer Science and Business Systems undergraduate building full-stack applications and REST APIs with Java, Python, React.js, Spring Boot, and FastAPI. Experience in unit testing and Docker-based deployment.
            </p>
          </section>

          {/* Education */}
          <section className="space-y-1.5 pt-4 border-t border-slate-800/70">
            <h3 className="text-xs font-mono text-sky-400 tracking-wider">
              02. EDUCATION
            </h3>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-base font-semibold text-white">
                BMS College of Engineering — Bengaluru, India
              </h4>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                Oct 2023 – Jul 2027 (Expected)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              Bachelor of Engineering, Computer Science and Business Systems ·{' '}
              <span className="text-sky-300 font-mono tabular-nums">
                CGPA: 8.6
              </span>
            </p>
          </section>

          {/* Technical Skills */}
          <section className="space-y-2 pt-4 border-t border-slate-800/70">
            <h3 className="text-xs font-mono text-sky-400 tracking-wider">
              03. TECHNICAL SKILLS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div>
                <span className="text-white font-semibold">Languages: </span>
                <span>Java, Python</span>
              </div>
              <div>
                <span className="text-white font-semibold">Full Stack: </span>
                <span>
                  React.js, Node.js, Spring Boot, FastAPI, REST APIs, HTML, Tailwind CSS
                </span>
              </div>
              <div>
                <span className="text-white font-semibold">Databases: </span>
                <span>MySQL, MongoDB</span>
              </div>
              <div>
                <span className="text-white font-semibold">Core CS: </span>
                <span>
                  Data Structures & Algorithms, OOP’s, Operating Systems, Computer Networks
                </span>
              </div>
              <div>
                <span className="text-white font-semibold">
                  Testing & Tools:{' '}
                </span>
                <span>Unit Testing, Git, GitHub, Bash</span>
              </div>
              <div>
                <span className="text-white font-semibold">
                  Cloud & DevOps:{' '}
                </span>
                <span>Docker, AWS, Vercel, Render, Kubernetes (basics)</span>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="space-y-3 pt-4 border-t border-slate-800/70">
            <h3 className="text-xs font-mono text-sky-400 tracking-wider">
              04. EXPERIENCE
            </h3>
            {EXPERIENCE_DATA.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-wrap justify-between text-white font-semibold">
                  <span>
                    {exp.role} — {exp.organization} ({exp.location})
                  </span>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                  {exp.highlights.map((h) => (
                    <li key={h}>• {h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="space-y-3 pt-4 border-t border-slate-800/70">
            <h3 className="text-xs font-mono text-sky-400 tracking-wider">
              05. PROJECTS
            </h3>

            <div className="space-y-1">
              <div className="flex flex-wrap justify-between text-white font-semibold">
                <span className="text-white font-semibold">
                  MediPulse Pro – Inventory & Expiry Predictor
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Java 17 · Spring Boot · MySQL (Aiven Cloud) · Docker · Render
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                • Built a hospital inventory platform with batch-level expiry tracking and stock management across six wards.
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                • Validated first-expiry-first-out (FEFO) prioritization, formula-based reorder logic, expiry alerts, and low-stock recommendations using synthetic data.
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                • Implemented JWT-based role access and SSL-secured MySQL connectivity; deployed with Docker on Render.
              </p>
            </div>

            <div className="space-y-1 pt-2">
              <div className="flex flex-wrap justify-between text-white font-semibold">
                <span className="text-white font-semibold">
                  DSA Logic Builder
                </span>
                <span className="text-xs font-mono text-slate-400">
                  React.js · Tailwind CSS · Gemini AI · Node.js · JWT
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                • Built a Gemini-powered code explainer for Python, Java, C++, and JavaScript with step-by-step explanations, variable tracking, and boundary-error highlighting.
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                • Created a seven-step interview-practice learning path covering 100+ questions and 15+ algorithmic patterns.
              </p>
            </div>
          </section>

          {/* Research Publication, Achievements & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/70">
            <section className="space-y-3">
              <h3 className="text-xs font-mono text-sky-400 tracking-wider">
                06. RESEARCH & ACHIEVEMENTS
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <div className="text-white font-semibold">
                    Published Research Article (2026)
                  </div>
                  <div className="text-slate-300">
                    International Journal of Drug Delivery Technology, Vol. 16, Issue 7.
                  </div>
                </div>
                {ACHIEVEMENTS_DATA.map((ach) => (
                  <div key={ach.title}>
                    <div className="text-white font-semibold">{ach.title}</div>
                    <div className="text-slate-300">{ach.detail}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-xs font-mono text-violet-300 tracking-wider">
                07. CERTIFICATIONS
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                {CERTIFICATIONS_DATA.map((cert) => (
                  <div
                    key={cert.title}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <div>
                      <span className="text-white font-semibold">
                        {cert.issuer}
                      </span>{' '}
                      – {cert.title}
                    </div>
                    <span className="text-xs font-mono text-slate-400 tabular-nums shrink-0">
                      {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
