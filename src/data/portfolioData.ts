export interface ProjectCaseStudy {
  id: string;
  index: string;
  title: string;
  category:
    | 'AI & 3D Vision'
    | 'Full-Stack & Healthcare'
    | 'AI & EdTech'
    | 'Research & Publication'
    | 'APIs & Open Source';
  year: string;
  summary: string;
  technologies: string[];
  featuredSpan: 'wide' | 'standard';
  visualTheme:
    | 'silent-bridge'
    | 'medipulse'
    | 'dsa-builder'
    | 'research'
    | 'api-oss';
  repositoryUrl?: string;
  githubUrl: string;
  liveUrl?: string;
  problemStatement: string;
  systemArchitecture: {
    overview: string;
    nodes: { label: string; role: string }[];
  };
  individualContribution: string[];
  engineeringChallenges: {
    title: string;
    resolution: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface CertificationItem {
  issuer: string;
  title: string;
  date: string;
}

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'bluestock-intern',
    role: 'Software Developer Intern',
    organization: 'Bluestock',
    location: 'Remote',
    period: 'Oct 2025 – Nov 2025',
    highlights: [
      'Gained exposure to REST API concepts, including HTTP methods, status codes, and JSON request/response handling.',
      'Learned backend API testing fundamentals, including endpoint validation and response verification.',
    ],
  },
  {
    id: 'gssoc-contributor',
    role: 'Open Source Contributor',
    organization: 'GirlScript Summer of Code (GSSoC)',
    location: 'Remote',
    period: '2025',
    highlights: [
      'Collaborated with maintainers through GitHub issues and pull requests on documentation, features, and code quality.',
    ],
  },
];

export const ACHIEVEMENTS_DATA = [
  {
    title: 'Smart India Hackathon (SIH) Finalist',
    detail:
      'Selected as a finalist after developing and finalizing a full-stack engineering project for the national competition.',
  },
  {
    title: 'Top 50 of 1,000 — College Coding Clubs',
    detail:
      'Placed among the top 50 out of 1,000 participants in competitive college coding-club algorithmic activities.',
  },
  {
    title: 'Published Research Author (2026)',
    detail:
      'Published research article in the International Journal of Drug Delivery Technology, Vol. 16, Issue 7.',
  },
];

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    issuer: 'Nutanix',
    title: 'Certified Associate 6 – Multicloud Infrastructure',
    date: 'Apr 2026',
  },
  {
    issuer: 'Oracle Academy',
    title: 'Java Programming Fundamentals',
    date: 'Nov 2025',
  },
  {
    issuer: 'Google Cloud',
    title: 'Generative AI',
    date: 'Jun 2025',
  },
  {
    issuer: 'Oracle Academy',
    title: 'Database Programming',
    date: 'May 2025',
  },
];

export const PROJECTS_DATA: ProjectCaseStudy[] = [
  {
    id: 'silent-bridge',
    index: '01',
    title: 'Silent Bridge — Bidirectional Sign Language & 3D Avatar Studio',
    category: 'AI & 3D Vision',
    year: '2025 – 2026',
    summary:
      'Real-time bidirectional Indian Sign Language (ISL) ↔ Kannada/English platform featuring offline WebAssembly hand/face tracking (@mediapipe/tasks-vision), Three.js bone-retargeted 3D signing avatars, in-app calibration studio, and model promotion guardrails.',
    technologies: [
      'MediaPipe Wasm',
      'Three.js / WebGL',
      'TypeScript',
      'React.js',
      'Kannada TTS & NLP',
      'Model Registry & OOD',
    ],
    featuredSpan: 'wide',
    visualTheme: 'silent-bridge',
    repositoryUrl:
      'https://github.com/kiranmkHackHeroic/Silent_Bridge---Sign-Language-Recognition-Model',
    githubUrl:
      'https://github.com/kiranmkHackHeroic/Silent_Bridge---Sign-Language-Recognition-Model',
    liveUrl:
      'https://github.com/kiranmkHackHeroic/Silent_Bridge---Sign-Language-Recognition-Model',
    problemStatement:
      'Deaf and hard-of-hearing signers in Karnataka face a two-way communication barrier: most sign-language tools only classify static alphabets without motion segmentation, regional Kannada translation/speech, reverse text-to-3D signing avatars, or user-specific lighting calibration.',
    systemArchitecture: {
      overview:
        'A browser-native WebAssembly & WebGL pipeline combining high-framerate @mediapipe/tasks-vision landmark extraction, dynamic gesture segmentation, bidirectional ISL ↔ Kannada NLP/TTS, Three.js skeletal retargeting, and an automated Model Registry with >2% regression rejection.',
      nodes: [
        {
          label: 'MediaPipe Wasm Tracker',
          role: 'High-FPS offline hand/face landmarks, palm normals & OOD scores',
        },
        {
          label: 'Motion Segmenter & Gloss',
          role: 'Deliberate gesture vs. idle rest detection → ISL gloss & Kannada TTS',
        },
        {
          label: 'Three.js 3D Sign Avatar',
          role: 'Longest-match Kannada phrase tokenizer & bone-retargeted WebGL rig',
        },
        {
          label: 'Dataset & Model Registry',
          role: '5–10 sample user calibration & >2% regression guardrail gate',
        },
      ],
    },
    individualContribution: [
      'Engineered live browser sign language recognition using offline WebAssembly (@mediapipe/tasks-vision) with dynamic motion segmentation to separate deliberate gestures from idle hand rest, outputting dual ISL gloss sequences and translated Kannada sentences with Kannada Text-to-Speech.',
      'Built the Kannada-to-3D Sign Avatar pipeline supporting Kannada text/voice input, longest-match phrase dictionary tokenization, and smooth bone-retargeted skeletal signing animations in real-time WebGL via Three.js.',
      'Created an in-app Dataset & Model Studio allowing users to record 5–10 calibration samples for their camera and lighting, backed by a Model Registry that automatically rejects candidate models regressing by >2% on held-out test sets.',
      'Implemented real-time Pipeline Diagnostics & Inspection surfacing live FPS, inference latency, palm normal vectors, landmark validity, and out-of-distribution (OOD) confidence scores.',
    ],
    engineeringChallenges: [
      {
        title: 'Dynamic Motion Segmentation & Out-of-Distribution (OOD) Filtering',
        resolution:
          'Combined velocity thresholds, palm normal orientation vectors, and landmark validity checks with OOD scoring to distinguish intentional ISL signing phrases from transitional hand movements or resting states.',
      },
      {
        title: 'Automated Model Registry Guardrails & User Calibration',
        resolution:
          'Designed an in-app 5–10 sample few-shot calibration workflow paired with a deterministic evaluation gate that blocks any candidate model whose accuracy drops by more than 2% on held-out test benchmarks.',
      },
    ],
  },
  {
    id: 'medipulse-pro',
    index: '02',
    title: 'MediPulse Pro — Inventory & Expiry Predictor',
    category: 'Full-Stack & Healthcare',
    year: '2025 – 2026',
    summary:
      'Hospital inventory platform with batch-level expiry tracking, First-Expiry-First-Out (FEFO) prioritization, formula-based reorder logic, and stock management across six wards.',
    technologies: [
      'Java 17',
      'Spring Boot',
      'MySQL (Aiven Cloud)',
      'JWT',
      'Docker',
      'Render',
    ],
    featuredSpan: 'standard',
    visualTheme: 'medipulse',
    repositoryUrl: 'https://github.com/kiranmkHackHeroic',
    githubUrl: 'https://github.com/kiranmkHackHeroic',
    liveUrl: '#architecture',
    problemStatement:
      'Hospital pharmacies and multi-ward stockrooms frequently suffer from critical medication stockouts or expired batch wastage due to manual tracking and lack of automated First-Expiry-First-Out (FEFO) dispatch rules.',
    systemArchitecture: {
      overview:
        'A Spring Boot (Java 17) REST backend secured with stateless JWT role-based access control, connected over SSL to Aiven Cloud MySQL, and containerized via Docker on Render.',
      nodes: [
        {
          label: 'Ward Portal & JWT Guard',
          role: 'Role-based access control across 6 hospital wards',
        },
        {
          label: 'Spring Boot REST Core',
          role: 'Batch-level stock controllers & RESTful JSON endpoints',
        },
        {
          label: 'FEFO & Reorder Engine',
          role: 'First-Expiry-First-Out dispatch & formula-based low-stock alerts',
        },
        {
          label: 'Aiven Cloud MySQL (SSL)',
          role: 'Encrypted relational storage for batches, wards & audit logs',
        },
      ],
    },
    individualContribution: [
      'Built a hospital inventory platform with batch-level expiry tracking and real-time stock management across six hospital wards.',
      'Validated First-Expiry-First-Out (FEFO) prioritization, formula-based reorder logic, expiry alerts, and low-stock recommendations using synthetic clinical inventory datasets.',
      'Implemented JWT-based role access and SSL-secured MySQL (Aiven Cloud) connectivity; containerized and deployed with Docker on Render.',
    ],
    engineeringChallenges: [
      {
        title: 'Batch-Level FEFO Prioritization Across Six Wards',
        resolution:
          'Designed composite relational queries ordered by earliest batch expiration timestamp so dispensation requests automatically deplete near-expiry stock first.',
      },
      {
        title: 'Secure Cloud Database Connectivity & Containerized Deployment',
        resolution:
          'Configured SSL/TLS certificate verification for Aiven Cloud MySQL connections and packaged the Spring Boot JAR in a multi-stage Docker build deployed on Render.',
      },
    ],
  },
  {
    id: 'dsa-logic-builder',
    index: '03',
    title: 'DSA Logic Builder — AI Code Explainer & Pattern Path',
    category: 'AI & EdTech',
    year: '2025 – 2026',
    summary:
      'Gemini-powered code explainer for Python, Java, C++, and JavaScript with step-by-step explanations, variable tracking, boundary-error highlighting, and a 7-step interview learning path.',
    technologies: [
      'React.js',
      'Tailwind CSS',
      'Gemini AI',
      'Node.js',
      'JWT',
    ],
    featuredSpan: 'standard',
    visualTheme: 'dsa-builder',
    repositoryUrl: 'https://github.com/kiranmkHackHeroic',
    githubUrl: 'https://github.com/kiranmkHackHeroic',
    liveUrl: '#stack',
    problemStatement:
      'Students preparing for technical interviews often memorize code templates without understanding step-by-step variable mutations, off-by-one boundary conditions, or underlying algorithmic patterns.',
    systemArchitecture: {
      overview:
        'A React.js & Tailwind CSS interactive learning workspace backed by a Node.js + JWT API layer that orchestrates structured Gemini AI code analysis prompts.',
      nodes: [
        {
          label: 'React.js Practice UI',
          role: '7-step learning path covering 100+ questions & 15+ patterns',
        },
        {
          label: 'Node.js & JWT Gateway',
          role: 'Authenticated session progress & prompt orchestration',
        },
        {
          label: 'Gemini AI Explainer',
          role: 'Polyglot AST breakdown for Python, Java, C++ & JS',
        },
        {
          label: 'Variable & Boundary Tracker',
          role: 'Step-by-step state trace & edge-case error highlighting',
        },
      ],
    },
    individualContribution: [
      'Built a Gemini-powered code explainer supporting Python, Java, C++, and JavaScript with step-by-step execution explanations, variable tracking, and boundary-error highlighting.',
      'Created a structured seven-step interview-practice learning path covering 100+ curated questions and 15+ core algorithmic patterns.',
      'Secured user learning progress and session state using JWT authentication with a responsive React.js and Tailwind CSS interface.',
    ],
    engineeringChallenges: [
      {
        title: 'Deterministic Variable Tracking & Boundary Highlighting',
        resolution:
          'Structured the Gemini AI analysis output schema to separate line-by-line variable state transitions from loop boundary and off-by-one condition warnings.',
      },
      {
        title: 'Structuring 100+ Questions into Progressive Patterns',
        resolution:
          'Organized 15+ algorithmic paradigms into a seven-step mastery sequence so learners build intuition before tackling complex dynamic programming and graph problems.',
      },
    ],
  },
  {
    id: 'drug-delivery-research',
    index: '04',
    title: 'Published Research — International Journal of Drug Delivery Technology',
    category: 'Research & Publication',
    year: '2026',
    summary:
      'Peer-reviewed research article published in the International Journal of Drug Delivery Technology (Vol. 16, Issue 7), combining analytical modeling with structured data evaluation.',
    technologies: [
      'Python',
      'Data Analysis',
      'Research Methodology',
      'Scientific Publishing',
    ],
    featuredSpan: 'standard',
    visualTheme: 'research',
    repositoryUrl: 'https://github.com/kiranmkHackHeroic',
    githubUrl: 'https://github.com/kiranmkHackHeroic',
    liveUrl: '#about',
    problemStatement:
      'Translating complex experimental and pharmaceutical delivery parameters into reproducible, peer-reviewed findings requires rigorous validation and quantitative documentation.',
    systemArchitecture: {
      overview:
        'Structured literature synthesis, parameter modeling, validation analysis, and peer-reviewed publication workflow for Vol. 16, Issue 7 (2026).',
      nodes: [
        {
          label: 'Domain Literature Review',
          role: 'Comparative analysis of drug delivery mechanisms',
        },
        {
          label: 'Parameter & Data Modeling',
          role: 'Quantitative formulation & release profile evaluation',
        },
        {
          label: 'Validation & Verification',
          role: 'Statistical consistency & experimental cross-checking',
        },
        {
          label: 'IJDDT Vol. 16 Issue 7',
          role: 'Published peer-reviewed manuscript (2026)',
        },
      ],
    },
    individualContribution: [
      'Co-authored and published the research article in the International Journal of Drug Delivery Technology, Vol. 16, Issue 7 (2026).',
      'Synthesized technical data tables, comparative evaluation metrics, and manuscript documentation for peer review.',
    ],
    engineeringChallenges: [
      {
        title: 'Cross-Disciplinary Data Rigor',
        resolution:
          'Applied systematic software engineering verification habits to experimental dataset validation and manuscript formatting.',
      },
    ],
  },
  {
    id: 'bluestock-gssoc-apis',
    index: '05',
    title: 'REST API Validation Suite & Open-Source Contributions',
    category: 'APIs & Open Source',
    year: '2025',
    summary:
      'Backend REST API endpoint validation, HTTP status & JSON schema verification developed during the Bluestock internship and GirlScript Summer of Code (GSSoC).',
    technologies: [
      'Java',
      'Python',
      'FastAPI',
      'Spring Boot',
      'REST APIs',
      'Unit Testing',
      'Git & GitHub',
    ],
    featuredSpan: 'wide',
    visualTheme: 'api-oss',
    repositoryUrl: 'https://github.com/kiranmkHackHeroic',
    githubUrl: 'https://github.com/kiranmkHackHeroic',
    liveUrl: '#architecture',
    problemStatement:
      'Production REST services require strict contract validation across HTTP verbs, status codes, and JSON payloads to prevent regressions during collaborative multi-contributor development.',
    systemArchitecture: {
      overview:
        'Automated endpoint testing and GitHub pull-request verification workflow covering REST controllers, status code invariants, and JSON serialization.',
      nodes: [
        {
          label: 'REST Contract Layer',
          role: 'HTTP methods (GET/POST/PUT/DELETE) & status code semantics',
        },
        {
          label: 'JSON Payload Validator',
          role: 'Request/response schema verification & edge-case handling',
        },
        {
          label: 'Unit & Endpoint Tests',
          role: 'Automated assertion suites for backend reliability',
        },
        {
          label: 'GSSoC PR Workflow',
          role: 'Issue triage, collaborative code reviews & documentation',
        },
      ],
    },
    individualContribution: [
      'During the Bluestock Software Developer Internship (Oct–Nov 2025), worked with REST API concepts including HTTP methods, status codes, and JSON request/response handling.',
      'Applied backend API testing fundamentals for endpoint validation and response verification.',
      'Collaborated with open-source maintainers in GirlScript Summer of Code (GSSoC) through GitHub issues and pull requests on features, documentation, and code quality.',
    ],
    engineeringChallenges: [
      {
        title: 'Consistent Error & Status Code Semantics',
        resolution:
          'Standardized endpoint verification checks across 2xx, 4xx, and 5xx response paths to ensure malformed JSON payloads return clear diagnostic responses.',
      },
    ],
  },
];

export interface TechSkillItem {
  id: string;
  name: string;
  shortLabel: string;
  category:
    | 'Programming Languages'
    | 'Backend Development'
    | 'Frontend Development'
    | 'Databases'
    | 'AI / Machine Learning'
    | 'Cloud and DevOps'
    | 'Computer Science Fundamentals';
  yearsOfExperience: string;
  proficiencyLevel: 'Advanced' | 'Proficient' | 'Core Competency' | 'Foundational';
  proficiencyScore: number;
  roleSummary: string;
  engineeringContext: string;
  connections: string[];
  x: number;
  y: number;
}

export const TECH_CATEGORIES = [
  'Programming Languages',
  'Backend Development',
  'Frontend Development',
  'Databases',
  'AI / Machine Learning',
  'Cloud and DevOps',
  'Computer Science Fundamentals',
] as const;

export const TECH_STACK_DATA: TechSkillItem[] = [
  // Programming Languages
  {
    id: 'java',
    name: 'Java (Java 17)',
    shortLabel: 'Java 17',
    category: 'Programming Languages',
    yearsOfExperience: '3+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 94,
    roleSummary: 'Enterprise backend services & OOP architecture',
    engineeringContext:
      'Primary language for MediPulse Pro (Spring Boot), Oracle Academy Java Programming Fundamentals certification, and competitive Data Structures & Algorithms.',
    connections: ['springboot', 'mysql', 'dsa', 'oop', 'unit-testing'],
    x: 22,
    y: 26,
  },
  {
    id: 'python',
    name: 'Python',
    shortLabel: 'Python',
    category: 'Programming Languages',
    yearsOfExperience: '3+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 92,
    roleSummary: 'FastAPI backends, AI integration & data scripting',
    engineeringContext:
      'Used to build high-speed FastAPI REST services, Gemini AI code analysis pipelines in DSA Logic Builder, and analytical scripts.',
    connections: ['fastapi', 'gemini-ai', 'mongodb', 'dsa'],
    x: 50,
    y: 14,
  },
  {
    id: 'bash',
    name: 'Bash & Shell Scripting',
    shortLabel: 'Bash',
    category: 'Programming Languages',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Proficient',
    proficiencyScore: 82,
    roleSummary: 'Linux CLI automation & container entrypoint scripts',
    engineeringContext:
      'Used for automating local build pipelines, Git workflows, Docker container startup scripts, and Operating Systems environments.',
    connections: ['docker', 'git-github', 'os'],
    x: 80,
    y: 22,
  },

  // Backend Development
  {
    id: 'springboot',
    name: 'Spring Boot',
    shortLabel: 'Spring Boot',
    category: 'Backend Development',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 90,
    roleSummary: 'Production Java REST APIs & JWT security',
    engineeringContext:
      'Powers MediPulse Pro with layered REST controllers, FEFO inventory business logic, JWT role-based access control, and Aiven MySQL integration.',
    connections: ['java', 'rest-apis', 'mysql', 'docker'],
    x: 36,
    y: 34,
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    shortLabel: 'FastAPI',
    category: 'Backend Development',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 88,
    roleSummary: 'Asynchronous Python REST APIs & schema validation',
    engineeringContext:
      'Builds lightweight, high-performance Python APIs with automatic OpenAPI documentation and strict JSON request/response validation.',
    connections: ['python', 'rest-apis', 'mongodb'],
    x: 62,
    y: 28,
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    shortLabel: 'Node.js',
    category: 'Backend Development',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Proficient',
    proficiencyScore: 85,
    roleSummary: 'JavaScript runtime for full-stack web backends',
    engineeringContext:
      'Powers the backend API and JWT session management for DSA Logic Builder alongside React.js and Gemini AI.',
    connections: ['react', 'rest-apis', 'gemini-ai', 'mongodb'],
    x: 34,
    y: 52,
  },
  {
    id: 'rest-apis',
    name: 'REST APIs & JWT',
    shortLabel: 'REST & JWT',
    category: 'Backend Development',
    yearsOfExperience: '2.5+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 92,
    roleSummary: 'HTTP methods, status codes, JSON & role access',
    engineeringContext:
      'Core focus during the Bluestock Software Developer Internship and across MediPulse Pro and DSA Logic Builder for stateless authentication and endpoint validation.',
    connections: ['springboot', 'fastapi', 'nodejs', 'unit-testing'],
    x: 48,
    y: 44,
  },

  // Frontend Development
  {
    id: 'react',
    name: 'React.js',
    shortLabel: 'React.js',
    category: 'Frontend Development',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 89,
    roleSummary: 'Component-driven full-stack user interfaces',
    engineeringContext:
      'Builds interactive dashboards and learning platforms including DSA Logic Builder, Silent Bridge 3D Studio, and hospital inventory views.',
    connections: ['tailwind', 'html-web', 'nodejs', 'rest-apis'],
    x: 16,
    y: 48,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    shortLabel: 'Tailwind CSS',
    category: 'Frontend Development',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 91,
    roleSummary: 'Utility-first responsive design systems',
    engineeringContext:
      'Styles modern, accessible interfaces in DSA Logic Builder, Silent Bridge, and this interactive 3D engineering portfolio.',
    connections: ['react', 'html-web'],
    x: 14,
    y: 68,
  },
  {
    id: 'html-web',
    name: 'HTML5 & Modern Web',
    shortLabel: 'HTML5',
    category: 'Frontend Development',
    yearsOfExperience: '3+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 94,
    roleSummary: 'Semantic markup & accessible DOM structure',
    engineeringContext:
      'Ensures clean semantic structure, keyboard accessibility, and responsive layouts across all full-stack web applications.',
    connections: ['react', 'tailwind'],
    x: 16,
    y: 14,
  },

  // Databases
  {
    id: 'mysql',
    name: 'MySQL (Aiven Cloud)',
    shortLabel: 'MySQL',
    category: 'Databases',
    yearsOfExperience: '2.5+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 90,
    roleSummary: 'Relational schema design & SSL cloud persistence',
    engineeringContext:
      'Backed by Oracle Academy Database Programming certification; stores ward inventory, batch expiry dates, and FEFO reorder records in MediPulse Pro.',
    connections: ['springboot', 'java', 'render-vercel'],
    x: 32,
    y: 72,
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    shortLabel: 'MongoDB',
    category: 'Databases',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Proficient',
    proficiencyScore: 84,
    roleSummary: 'Document-oriented NoSQL data modeling',
    engineeringContext:
      'Used for flexible JSON document storage in full-stack Node.js and FastAPI applications.',
    connections: ['nodejs', 'fastapi', 'python'],
    x: 50,
    y: 64,
  },

  // AI / Machine Learning
  {
    id: 'gemini-ai',
    name: 'Gemini AI & GenAI',
    shortLabel: 'Gemini AI',
    category: 'AI / Machine Learning',
    yearsOfExperience: '1.5+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 88,
    roleSummary: 'AI code explanation, variable tracking & Cloud GenAI',
    engineeringContext:
      'Certified in Google Cloud Generative AI (Jun 2025); powers DSA Logic Builder to explain Python, Java, C++, and JS code step-by-step.',
    connections: ['python', 'nodejs', 'react', 'dsa'],
    x: 68,
    y: 54,
  },

  // Cloud and DevOps
  {
    id: 'docker',
    name: 'Docker',
    shortLabel: 'Docker',
    category: 'Cloud and DevOps',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Proficient',
    proficiencyScore: 85,
    roleSummary: 'Containerized Spring Boot & full-stack deployments',
    engineeringContext:
      'Packages MediPulse Pro and backend APIs into reproducible container images for cloud deployment on Render.',
    connections: ['springboot', 'render-vercel', 'aws-cloud', 'k8s'],
    x: 78,
    y: 38,
  },
  {
    id: 'aws-cloud',
    name: 'AWS & Multicloud',
    shortLabel: 'AWS / Nutanix',
    category: 'Cloud and DevOps',
    yearsOfExperience: '1.5+ Years',
    proficiencyLevel: 'Proficient',
    proficiencyScore: 83,
    roleSummary: 'Cloud infrastructure & Nutanix NCA 6 certified',
    engineeringContext:
      'Backed by Nutanix Certified Associate 6 (Multicloud Infrastructure) and AWS fundamentals for scalable cloud hosting.',
    connections: ['docker', 'k8s', 'networks'],
    x: 86,
    y: 52,
  },
  {
    id: 'render-vercel',
    name: 'Render & Vercel',
    shortLabel: 'Render / Vercel',
    category: 'Cloud and DevOps',
    yearsOfExperience: '2+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 90,
    roleSummary: 'Continuous cloud deployment for APIs & SPAs',
    engineeringContext:
      'Hosts Dockerized Spring Boot services on Render and React.js frontends on Vercel with SSL and environment secret management.',
    connections: ['docker', 'react', 'mysql'],
    x: 66,
    y: 74,
  },
  {
    id: 'k8s',
    name: 'Kubernetes (Basics)',
    shortLabel: 'Kubernetes',
    category: 'Cloud and DevOps',
    yearsOfExperience: '1+ Year',
    proficiencyLevel: 'Foundational',
    proficiencyScore: 72,
    roleSummary: 'Container orchestration & pod lifecycle concepts',
    engineeringContext:
      'Foundational knowledge of container scheduling, service discovery, and declarative deployment manifests.',
    connections: ['docker', 'aws-cloud'],
    x: 86,
    y: 70,
  },
  {
    id: 'unit-testing',
    name: 'Unit Testing & Git/GitHub',
    shortLabel: 'Unit Tests & Git',
    category: 'Cloud and DevOps',
    yearsOfExperience: '3+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 91,
    roleSummary: 'Endpoint validation, JUnit/Node tests & GSSoC PRs',
    engineeringContext:
      'Applied in Bluestock API testing, GSSoC open-source pull requests, and automated verification suites.',
    connections: ['java', 'rest-apis', 'bash'],
    x: 64,
    y: 14,
  },

  // Computer Science Fundamentals
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    shortLabel: 'DSA (100+ Qs)',
    category: 'Computer Science Fundamentals',
    yearsOfExperience: '3+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 95,
    roleSummary: '15+ algorithmic patterns & Top 50/1,000 coder',
    engineeringContext:
      'Placed Top 50 out of 1,000 in college coding clubs; creator of DSA Logic Builder covering 100+ interview problems.',
    connections: ['java', 'python', 'gemini-ai', 'oop'],
    x: 48,
    y: 84,
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming (OOP)',
    shortLabel: 'OOP',
    category: 'Computer Science Fundamentals',
    yearsOfExperience: '3+ Years',
    proficiencyLevel: 'Advanced',
    proficiencyScore: 93,
    roleSummary: 'Encapsulation, polymorphism & modular domain design',
    engineeringContext:
      'Core architectural foundation for Java 17 and Spring Boot service layers in MediPulse Pro.',
    connections: ['java', 'springboot', 'dsa'],
    x: 24,
    y: 88,
  },
  {
    id: 'os',
    name: 'Operating Systems',
    shortLabel: 'Operating Systems',
    category: 'Computer Science Fundamentals',
    yearsOfExperience: '2.5+ Years',
    proficiencyLevel: 'Core Competency',
    proficiencyScore: 86,
    roleSummary: 'Processes, concurrency, memory & Linux scheduling',
    engineeringContext:
      'Core BMS College of Engineering CSBS curriculum applied to containerization and backend resource management.',
    connections: ['bash', 'docker', 'networks'],
    x: 82,
    y: 86,
  },
  {
    id: 'networks',
    name: 'Computer Networks',
    shortLabel: 'Networks',
    category: 'Computer Science Fundamentals',
    yearsOfExperience: '2.5+ Years',
    proficiencyLevel: 'Core Competency',
    proficiencyScore: 87,
    roleSummary: 'TCP/IP, HTTP/HTTPS, SSL/TLS & REST protocols',
    engineeringContext:
      'Applied in configuring SSL-secured Aiven MySQL connections, JWT bearer transport, and REST API status verification.',
    connections: ['rest-apis', 'aws-cloud', 'os'],
    x: 66,
    y: 88,
  },
];

export interface ArchitectureNodeSpec {
  id: string;
  title: string;
  tier: 'primary' | 'auxiliary';
  stepIndex?: string;
  subtitle: string;
  latencyMetric: string;
  protocol: string;
  responsibility: string;
  engineeringDetails: string[];
}

export const ARCHITECTURE_NODES: ArchitectureNodeSpec[] = [
  {
    id: 'client',
    title: 'CLIENT',
    tier: 'primary',
    stepIndex: '01',
    subtitle: 'React.js & Tailwind CSS SPA',
    latencyMetric: 'Vercel Edge CDN',
    protocol: 'HTTPS / REST JSON',
    responsibility:
      'Renders responsive hospital ward dashboards (MediPulse Pro) and interactive code explainer views (DSA Logic Builder) with client-side state management.',
    engineeringDetails: [
      'Component-driven React.js UI styled with Tailwind CSS for fast, accessible workflows across desktop and mobile.',
      'Attaches stateless JWT Bearer tokens and validates form inputs before dispatching REST API requests.',
    ],
  },
  {
    id: 'api-layer',
    title: 'API LAYER',
    tier: 'primary',
    stepIndex: '02',
    subtitle: 'Spring Boot / FastAPI / Node.js Controllers',
    latencyMetric: 'RESTful Endpoints',
    protocol: 'HTTP Methods & Status Codes',
    responsibility:
      'Exposes clean RESTful endpoints, validates JSON request payloads, enforces HTTP status code semantics, and routes requests to service layers.',
    engineeringDetails: [
      'Validated through backend API testing fundamentals practiced during the Bluestock Software Developer Internship.',
      'Dockerized service deployment on Render with health-check probes and structured error responses.',
    ],
  },
  {
    id: 'business-logic',
    title: 'BUSINESS LOGIC',
    tier: 'primary',
    stepIndex: '03',
    subtitle: 'FEFO Prioritization & Gemini AI Engine',
    latencyMetric: 'Core Domain Rules',
    protocol: 'Java 17 / Python Services',
    responsibility:
      'Executes First-Expiry-First-Out (FEFO) stock prioritization, formula-based reorder calculations across six hospital wards, and Gemini AI code explanation.',
    engineeringDetails: [
      'Computes batch-level expiry alerts and low-stock reorder recommendations in MediPulse Pro.',
      'Orchestrates 7-step algorithmic learning paths and step-by-step variable tracking in DSA Logic Builder.',
    ],
  },
  {
    id: 'database',
    title: 'DATABASE',
    tier: 'primary',
    stepIndex: '04',
    subtitle: 'MySQL (Aiven Cloud SSL) & MongoDB',
    latencyMetric: 'SSL-Secured Persistence',
    protocol: 'JDBC SSL / Mongoose',
    responsibility:
      'Persists relational hospital batch inventories in Aiven Cloud MySQL and document-oriented learning records in MongoDB.',
    engineeringDetails: [
      'SSL-secured MySQL connectivity on Aiven Cloud protecting multi-ward inventory transactions.',
      'Indexed batch expiration timestamps supporting fast FEFO sorting and ward-level stock queries.',
    ],
  },
  {
    id: 'auth',
    title: 'Authentication',
    tier: 'auxiliary',
    subtitle: 'JWT Role-Based Access Control',
    latencyMetric: 'Stateless Token Guard',
    protocol: 'Bearer JWT (HS256/RS256)',
    responsibility:
      'Secures API endpoints in both MediPulse Pro and DSA Logic Builder with role-based permissions for hospital staff and learners.',
    engineeringDetails: [
      'Verifies JWT signatures on protected routes to isolate ward-level stock modifications.',
      'Prevents unauthorized access to administrative reorder and batch management endpoints.',
    ],
  },
  {
    id: 'cache',
    title: 'Cache Layer',
    tier: 'auxiliary',
    subtitle: 'In-Memory Query & Pattern Cache',
    latencyMetric: 'Fast Read-Through',
    protocol: 'In-Memory / Key-Value',
    responsibility:
      'Caches frequently accessed ward stock summaries and algorithmic pattern metadata to reduce redundant database round-trips.',
    engineeringDetails: [
      'Invalidates cached ward summaries immediately upon batch dispensation or restock commits.',
      'Accelerates loading of the 100+ interview practice questions and 15+ algorithmic patterns.',
    ],
  },
  {
    id: 'background-jobs',
    title: 'Background Jobs',
    tier: 'auxiliary',
    subtitle: 'Expiry Alerts & Reorder Evaluator',
    latencyMetric: 'Scheduled Batch Evaluators',
    protocol: 'Async Task Workers',
    responsibility:
      'Scans batch expiration horizons across all six hospital wards to trigger proactive expiry alerts and formula-based reorder notifications.',
    engineeringDetails: [
      'Identifies near-expiry stock batches so hospital wards can prioritize FEFO utilization.',
      'Generates low-stock reorder recommendations automatically when ward thresholds are crossed.',
    ],
  },
  {
    id: 'monitoring',
    title: 'Logging & Testing',
    tier: 'auxiliary',
    subtitle: 'Unit Testing & Endpoint Verification',
    latencyMetric: 'CI & Docker Logs',
    protocol: 'Unit Tests / Git / Docker',
    responsibility:
      'Verifies endpoint correctness, HTTP status codes, and business rules using unit test suites and containerized deployment logs.',
    engineeringDetails: [
      'Validates FEFO ordering and reorder formulas against synthetic hospital inventory datasets.',
      'Ensures response schema integrity across REST endpoints before deploying Docker images to Render.',
    ],
  },
];
