# Kiran M.K. — 3D Creative & Systems Software Engineer Portfolio

> A cinematic, interactive 3D developer portfolio featuring real-time WebGL sculptures, distributed systems architecture visualizations, an interactive tech stack constellation, and full-stack project case studies.

---

## 🌟 Key Features

### 1. Interactive 3D WebGL Hero Centerpiece
- **Three.js Powered Mesh**: Interactive geometric sculpture with real-time vertex shaders and dynamic lighting.
- **Material Presets**: Toggle between Optical Glass, Brushed Obsidian, Chrome Liquid, and Iridescent Titanium finishes.
- **Exploded View Control**: Inspect internal mesh geometries with smooth parametric interpolation.
- **Pointer-reactive Lighting**: Real-time spotlight tracking, cursor-driven rotation damping, and ambient particle field.

### 2. Comprehensive Systems & AI Case Studies
- **SilentBridge**: Real-time two-way Indian Sign Language (ISL) ↔ spoken language translation prototype integrating MediaPipe keypoint extraction, ST-GCN, Transformer sequence modeling, and interactive Three.js 3D avatar playback.
- **MediPulse Pro** ([Live Demo](https://medipulse-pro.onrender.com/) · [GitHub](https://github.com/kiranmkHackHeroic/MediPulse-Pro-Hospital-Inventory-Expiry-Predictor)): Full-stack healthcare pharmaceutical inventory forecasting engine executing First-Expiry-First-Out (FEFO) stock allocation with SSL-secured Aiven Cloud MySQL and Spring Boot.
- **DSA Logic Builder** ([Live Demo](https://dsa-logic-builder.vercel.app/) · [GitHub](https://github.com/kiranmkHackHeroic/dsa-logic-builder)): AI-assisted algorithmic code explainer supporting line-by-line variable state tracking, edge-case boundary condition checks, and 7-step learning path.
- **Academic Research**: Published author in the *International Journal of Drug Delivery Technology (IJDDT)*, Vol. 16, Issue 7.

### 3. Interactive Architecture & Tech Stack Matrix
- **Architecture Pipeline**: Visual multi-tier walkthrough of real-time client-to-cloud request lifecycles, streaming channels, and database transactions.
- **Tech Stack Constellation**: Filterable skill nodes across Languages (Python, Java, TypeScript, C++), 3D & Vision (Three.js, WebGL, MediaPipe), Frontend, Backend & Cloud (FastAPI, Express, Node.js, Docker), and Databases (MySQL, MongoDB).

### 4. Interactive Tools & Experience
- **Interactive Terminal**: CLI-style terminal emulator with command navigation.
- **Interactive Resume Modal**: In-browser ATS-friendly resume inspector with copy and PDF download capabilities.
- **Theme Modes**: Seamlessly switch between 'Midnight' dark mode and 'Day' glassmorphism.
- **Accessibility & Performance**: Reduced motion toggle, responsive layouts, and GPU-optimized rendering loops.

---

## 🛠️ Tech Stack

- **Core Framework**: React 19, TypeScript
- **Build Tool**: Vite
- **3D Graphics & Shaders**: Three.js, WebGL
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Animations & Transitions**: Motion (`motion/react`)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/kiran-portfolio.git
   cd kiran-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables (optional):**
   ```bash
   cp .env.example .env
   ```
   Add any optional configuration keys (e.g. `GEMINI_API_KEY`) if using AI-assisted interactive modules.

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

---

## 📦 Build & Deployment

To generate an optimized production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📂 Project Structure

```text
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI & 3D WebGL components
│   │   ├── ArchitectureSection.tsx    # Multi-tier systems pipeline visualizer
│   │   ├── ContactScene3D.tsx         # 3D interactive contact visualizer
│   │   ├── HeroScene3D.tsx            # Three.js interactive WebGL sculpture
│   │   ├── JumpToSectionModal.tsx     # Quick navigation modal
│   │   ├── ProjectCard3D.tsx          # 3D tilt project cards
│   │   ├── ProjectDetailModal.tsx     # In-depth case study modal
│   │   ├── ProjectVisualPreview.tsx   # Custom visual preview per project
│   │   ├── ResumeModal.tsx            # Full interactive resume viewer
│   │   └── TechStackSection.tsx       # Interactive skill graph & constellation
│   ├── data/
│   │   └── portfolioData.ts           # Case studies, timeline, skills & achievements
│   ├── utils/
│   │   └── physicsAndPortfolioLogic.ts# Color resolution, filtering & helper logic
│   ├── App.tsx             # Main layout, nav, sections & dock controls
│   ├── index.css           # Global tokens, typography & Tailwind imports
│   └── main.tsx            # React application entry point
├── index.html              # HTML template & web font imports
├── package.json            # Scripts & project dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build & server configuration
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
