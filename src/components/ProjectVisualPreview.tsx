import React from 'react';

interface ProjectVisualPreviewProps {
  theme:
    | 'silent-bridge'
    | 'medipulse'
    | 'dsa-builder'
    | 'research'
    | 'api-oss';
  isHovered?: boolean;
}

export const ProjectVisualPreview: React.FC<ProjectVisualPreviewProps> = ({
  theme,
  isHovered = false,
}) => {
  if (theme === 'silent-bridge') {
    return (
      <div className="relative w-full h-full bg-[#070B16] overflow-hidden flex items-center justify-center p-6 select-none">
        <div
          className={`w-full h-full transition-transform duration-500 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        >
          <svg
            viewBox="0 0 640 320"
            className="w-full h-full"
            role="img"
            aria-label="Silent Bridge bidirectional sign language recognition, MediaPipe Wasm landmarks, Kannada NLP/TTS, and Three.js 3D avatar architecture"
          >
            <defs>
              <radialGradient id="sbGlow" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.24" />
                <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#05070E" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="sbLink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Subtle perspective grid */}
            <g stroke="rgba(148,163,184,0.07)" strokeWidth="1">
              {[40, 80, 120, 160, 200, 240, 280].map((y) => (
                <line key={`sbh-${y}`} x1="0" y1={y} x2="640" y2={y} />
              ))}
              {[80, 160, 240, 320, 400, 480, 560].map((x) => (
                <line key={`sbv-${x}`} x1={x} y1="0" x2={x} y2="320" />
              ))}
            </g>

            <circle cx="320" cy="160" r="150" fill="url(#sbGlow)" />

            {/* Left Panel: MediaPipe Wasm Hand/Face Landmark Skeleton */}
            <g transform="translate(26, 36)">
              <rect
                x="0"
                y="0"
                width="168"
                height="156"
                rx="8"
                fill="#0A1122"
                stroke="#38BDF8"
                strokeWidth="1.2"
              />
              <text
                x="12"
                y="20"
                fill="#38BDF8"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                @mediapipe/tasks-vision
              </text>
              <text
                x="12"
                y="33"
                fill="#94A3B8"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                WASM HAND + FACE TRACKING
              </text>

              {/* Stylized 21-point Hand Landmark Wireframe */}
              <g
                transform="translate(84, 108)"
                stroke="#38BDF8"
                strokeWidth="1.4"
                fill="none"
              >
                {/* Palm base to fingers */}
                <line x1="0" y1="26" x2="-32" y2="2" />
                <line x1="-32" y1="2" x2="-42" y2="-16" />
                <line x1="0" y1="26" x2="-16" y2="-18" />
                <line x1="-16" y1="-18" x2="-20" y2="-44" />
                <line x1="0" y1="26" x2="0" y2="-22" />
                <line x1="0" y1="-22" x2="0" y2="-50" />
                <line x1="0" y1="26" x2="16" y2="-18" />
                <line x1="16" y1="-18" x2="20" y2="-42" />
                <line x1="0" y1="26" x2="30" y2="-6" />
                <line x1="30" y1="-6" x2="38" y2="-26" />
                {/* Palm normal vector arrow */}
                <line
                  x1="0"
                  y1="4"
                  x2="26"
                  y2="16"
                  stroke="#A78BFA"
                  strokeDasharray="2 2"
                />
              </g>
              {[
                [84, 134],
                [52, 110],
                [42, 92],
                [68, 90],
                [64, 64],
                [84, 86],
                [84, 58],
                [100, 90],
                [104, 66],
                [114, 102],
                [122, 82],
              ].map(([px, py], idx) => (
                <circle
                  key={idx}
                  cx={px}
                  cy={py}
                  r="2.6"
                  fill={idx % 2 === 0 ? '#38BDF8' : '#A78BFA'}
                />
              ))}
            </g>

            {/* Center Pipeline Nodes: Motion Segmentation + ISL Gloss ↔ Kannada TTS */}
            <g stroke="url(#sbLink)" strokeWidth="1.6" fill="none">
              <path d="M 194 95 L 238 95" />
              <path d="M 194 145 L 238 175" />
              <path d="M 402 95 L 446 95" />
              <path d="M 402 175 L 446 145" />
            </g>

            <g transform="translate(238, 56)">
              <rect
                x="0"
                y="0"
                width="164"
                height="68"
                rx="7"
                fill="#0D162C"
                stroke="#38BDF8"
                strokeWidth="1.4"
              />
              <text
                x="12"
                y="20"
                fill="#F8FAFC"
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                ISL GLOSS & KANNADA TTS
              </text>
              <text
                x="12"
                y="36"
                fill="#38BDF8"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
              >
                Motion Segmenter · Active
              </text>
              <text
                x="12"
                y="52"
                fill="#CBD5E1"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                Kannada + English Speech Out
              </text>
            </g>

            <g transform="translate(238, 142)">
              <rect
                x="0"
                y="0"
                width="164"
                height="68"
                rx="7"
                fill="#14112A"
                stroke="#A78BFA"
                strokeWidth="1.4"
              />
              <text
                x="12"
                y="20"
                fill="#F8FAFC"
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                DATASET & MODEL STUDIO
              </text>
              <text
                x="12"
                y="36"
                fill="#C4B5FD"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
              >
                5–10 Sample Calibration
              </text>
              <text
                x="12"
                y="52"
                fill="#CBD5E1"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                Guardrail: &gt;2% Drop Rejected
              </text>
            </g>

            {/* Right Panel: Kannada to 3D Sign Avatar (Three.js Bone Retargeting) */}
            <g transform="translate(446, 36)">
              <rect
                x="0"
                y="0"
                width="168"
                height="156"
                rx="8"
                fill="#0A1122"
                stroke="#A78BFA"
                strokeWidth="1.2"
              />
              <text
                x="12"
                y="20"
                fill="#C4B5FD"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                THREE.JS 3D SIGN AVATAR
              </text>
              <text
                x="12"
                y="33"
                fill="#94A3B8"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                BONE-RETARGETED RIG
              </text>

              {/* Stylized 3D Avatar Upper-Body Kinematic Rig */}
              <g
                transform="translate(84, 92)"
                stroke="#A78BFA"
                strokeWidth="1.5"
                fill="none"
              >
                <circle cx="0" cy="-26" r="11" stroke="#38BDF8" />
                {/* Spine & clavicle */}
                <line x1="0" y1="-15" x2="0" y2="28" />
                <line x1="-28" y1="-8" x2="28" y2="-8" />
                {/* Left & Right articulated signing arms */}
                <polyline
                  points="-28,-8 -42,14 -22,6"
                  stroke="#38BDF8"
                  strokeWidth="1.8"
                />
                <polyline
                  points="28,-8 44,10 24,-2"
                  stroke="#38BDF8"
                  strokeWidth="1.8"
                />
              </g>
              {[
                [84, 77],
                [56, 84],
                [112, 84],
                [42, 106],
                [128, 102],
                [62, 98],
                [108, 90],
              ].map(([bx, by], idx) => (
                <circle key={idx} cx={bx} cy={by} r="2.8" fill="#38BDF8" />
              ))}
              <text
                x="84"
                y="144"
                textAnchor="middle"
                fill="#E2E8F0"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                Longest-Match Phrase Lookup
              </text>
            </g>

            {/* Bottom Real-Time Diagnostics Telemetry Bar */}
            <g transform="translate(26, 228)">
              <rect
                x="0"
                y="0"
                width="588"
                height="54"
                rx="8"
                fill="#090F1E"
                stroke="rgba(56,189,248,0.35)"
                strokeWidth="1"
              />
              <text
                x="16"
                y="21"
                fill="#38BDF8"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                PIPELINE DIAGNOSTICS & FRAME INSPECTOR
              </text>
              <text
                x="16"
                y="39"
                fill="#E2E8F0"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
              >
                60 FPS · Latency: 8.4ms · Palm Normals: Valid · Landmark Confidence: 99.2% · OOD Score: 0.03 (In-Distribution)
              </text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  if (theme === 'medipulse') {
    return (
      <div className="relative w-full h-full bg-[#070B16] overflow-hidden flex items-center justify-center p-6 select-none">
        <div
          className={`w-full h-full transition-transform duration-500 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        >
          <svg
            viewBox="0 0 640 320"
            className="w-full h-full"
            role="img"
            aria-label="MediPulse Pro FEFO hospital inventory and 6-ward expiry predictor architecture"
          >
            <defs>
              <radialGradient id="mediGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#05070E" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="edgeCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            <g stroke="rgba(148,163,184,0.07)" strokeWidth="1">
              {[40, 80, 120, 160, 200, 240, 280].map((y) => (
                <line key={`h-${y}`} x1="0" y1={y} x2="640" y2={y} />
              ))}
              {[80, 160, 240, 320, 400, 480, 560].map((x) => (
                <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="320" />
              ))}
            </g>

            <circle cx="350" cy="160" r="145" fill="url(#mediGlow)" />

            {/* Connection lines from Spring Boot FEFO Core to Wards & Aiven Cloud */}
            <g stroke="url(#edgeCyan)" strokeWidth="1.5" opacity="0.78">
              <line x1="350" y1="70" x2="225" y2="155" />
              <line x1="350" y1="70" x2="475" y2="155" />
              <line x1="350" y1="70" x2="275" y2="248" />
              <line x1="350" y1="70" x2="435" y2="248" />
            </g>

            {/* Central Spring Boot + FEFO Core */}
            <g transform="translate(350, 68)">
              <rect
                x="-78"
                y="-24"
                width="156"
                height="48"
                rx="6"
                fill="#0D1528"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="-4"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="10.5"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                SPRING BOOT · JAVA 17
              </text>
              <text
                x="0"
                y="12"
                textAnchor="middle"
                fill="#38BDF8"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                FEFO ENGINE · JWT RBAC
              </text>
            </g>

            {/* Sub-nodes */}
            {[
              { x: 220, y: 156, id: '6 HOSPITAL WARDS', state: 'BATCH STOCK SYNC' },
              { x: 480, y: 156, id: 'AIVEN CLOUD MYSQL', state: 'SSL ENCRYPTED DB' },
              { x: 270, y: 250, id: 'EXPIRY PREDICTOR', state: 'FEFO ALERTS ACTIVE' },
              { x: 440, y: 250, id: 'DOCKER · RENDER', state: 'REORDER FORMULA' },
            ].map((node) => (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <rect
                  x="-64"
                  y="-20"
                  width="128"
                  height="42"
                  rx="6"
                  fill="#090F1E"
                  stroke="rgba(148,163,184,0.32)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="-2"
                  textAnchor="middle"
                  fill="#E2E8F0"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.id}
                </text>
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.state}
                </text>
              </g>
            ))}

            {/* Left FEFO Batch Queue */}
            <g transform="translate(22, 36)">
              <text
                x="0"
                y="0"
                fill="#94A3B8"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                FEFO BATCH PRIORITY
              </text>
              {[
                { label: 'B-104 · EXP 14d', urgent: true },
                { label: 'B-209 · EXP 42d', urgent: false },
                { label: 'B-312 · EXP 90d', urgent: false },
                { label: 'B-401 · EXP 180d', urgent: false },
              ].map((b, idx) => (
                <g key={b.label} transform={`translate(0, ${12 + idx * 24})`}>
                  <rect
                    x="0"
                    y="0"
                    width="108"
                    height="18"
                    rx="3"
                    fill={
                      b.urgent
                        ? 'rgba(56,189,248,0.22)'
                        : 'rgba(15,23,42,0.85)'
                    }
                    stroke={
                      b.urgent
                        ? 'rgba(56,189,248,0.7)'
                        : 'rgba(148,163,184,0.25)'
                    }
                  />
                  <text
                    x="8"
                    y="12"
                    fill={b.urgent ? '#E0F2FE' : '#94A3B8'}
                    fontSize="8.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {b.label}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    );
  }

  if (theme === 'dsa-builder') {
    return (
      <div className="relative w-full h-full bg-[#070B16] overflow-hidden flex items-center justify-center p-6 select-none">
        <div
          className={`w-full h-full transition-transform duration-500 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        >
          <svg
            viewBox="0 0 480 300"
            className="w-full h-full"
            role="img"
            aria-label="DSA Logic Builder Gemini AI code explainer and 7-step algorithmic pattern path"
          >
            <defs>
              <radialGradient id="dsaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.26" />
                <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#05070E" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="320" cy="150" r="120" fill="url(#dsaGlow)" />

            <g transform="translate(24, 34)">
              <rect
                x="0"
                y="0"
                width="164"
                height="62"
                rx="6"
                fill="#0D1425"
                stroke="rgba(56,189,248,0.5)"
              />
              <text
                x="12"
                y="20"
                fill="#38BDF8"
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
              >
                GEMINI AI EXPLAINER
              </text>
              <text
                x="12"
                y="36"
                fill="#E2E8F0"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
              >
                Python · Java · C++ · JS
              </text>
              <text
                x="12"
                y="50"
                fill="#94A3B8"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                Variable & Boundary Trace
              </text>

              <rect
                x="0"
                y="84"
                width="164"
                height="62"
                rx="6"
                fill="#0D1425"
                stroke="rgba(167,139,250,0.5)"
              />
              <text
                x="12"
                y="104"
                fill="#A78BFA"
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
              >
                7-STEP LEARNING PATH
              </text>
              <text
                x="12"
                y="120"
                fill="#E2E8F0"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
              >
                100+ Curated Questions
              </text>
              <text
                x="12"
                y="134"
                fill="#94A3B8"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                15+ Algorithmic Patterns
              </text>

              <path
                d="M 164 31 C 205 31, 215 125, 250 135"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.5"
              />
              <path
                d="M 164 115 C 205 115, 215 150, 250 150"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="1.5"
              />
            </g>

            {/* Right Pattern Tree Graph */}
            <g transform="translate(340, 148)">
              <circle
                cx="0"
                cy="0"
                r="76"
                fill="none"
                stroke="rgba(56,189,248,0.25)"
                strokeDasharray="3 5"
              />
              <polygon
                points="0,-64 56,-18 35,54 -35,54 -56,-18"
                fill="rgba(56,189,248,0.08)"
                stroke="#7DD3FC"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="-4"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                15+ PATTERNS
              </text>
              <text
                x="0"
                y="12"
                textAnchor="middle"
                fill="#38BDF8"
                fontSize="8.5"
                fontFamily="JetBrains Mono, monospace"
              >
                100+ DSA PROBLEMS
              </text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  if (theme === 'research') {
    return (
      <div className="relative w-full h-full bg-[#070B16] overflow-hidden flex items-center justify-center p-6 select-none">
        <div
          className={`w-full h-full transition-transform duration-500 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        >
          <svg
            viewBox="0 0 480 300"
            className="w-full h-full"
            role="img"
            aria-label="Published Research Article in International Journal of Drug Delivery Technology Vol 16 Issue 7"
          >
            <g transform="translate(36, 36)">
              <text
                x="0"
                y="0"
                fill="#38BDF8"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                PEER-REVIEWED JOURNAL PUBLICATION · 2026
              </text>
              <rect
                x="0"
                y="12"
                width="408"
                height="48"
                rx="6"
                fill="rgba(56,189,248,0.12)"
                stroke="rgba(56,189,248,0.5)"
              />
              <text
                x="14"
                y="32"
                fill="#F8FAFC"
                fontSize="10.5"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                Int. Journal of Drug Delivery Technology
              </text>
              <text
                x="14"
                y="48"
                fill="#7DD3FC"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                Volume 16 · Issue 7 · Published Research Article
              </text>

              <text
                x="0"
                y="88"
                fill="#93C5FD"
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
              >
                RESEARCH METHODOLOGY & RELEASE KINETICS MODELING
              </text>

              <rect
                x="0"
                y="100"
                width="408"
                height="96"
                rx="6"
                fill="#0D1528"
                stroke="rgba(167,139,250,0.4)"
              />
              <path
                d="M 24 176 Q 95 112, 180 132 T 384 116"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2"
              />
              <path
                d="M 24 182 Q 110 140, 200 152 T 384 138"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#070B16] overflow-hidden flex items-center justify-center p-6 select-none">
      <div
        className={`w-full h-full transition-transform duration-500 ease-out ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
      >
        <svg
          viewBox="0 0 640 320"
          className="w-full h-full"
          role="img"
          aria-label="Bluestock REST API endpoint testing and GirlScript Summer of Code pull request workflow"
        >
          <g stroke="rgba(148,163,184,0.07)" strokeWidth="1">
            {[50, 100, 150, 200, 250].map((y) => (
              <line key={`ch-${y}`} x1="0" y1={y} x2="640" y2={y} />
            ))}
          </g>

          <g stroke="#38BDF8" strokeWidth="1.5" fill="none" opacity="0.8">
            <path d="M 170 95 L 270 95" />
            <path d="M 410 95 L 485 65" />
            <path d="M 410 95 L 485 155" stroke="#A78BFA" />
          </g>

          <g transform="translate(30, 65)">
            <rect
              x="0"
              y="0"
              width="140"
              height="60"
              rx="6"
              fill="#0D1528"
              stroke="#38BDF8"
            />
            <text x="12" y="22" fill="#38BDF8" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              REST API REQUEST
            </text>
            <text x="12" y="40" fill="#CBD5E1" fontSize="9" fontFamily="JetBrains Mono, monospace">
              HTTP Verbs & JSON
            </text>
          </g>

          <g transform="translate(270, 65)">
            <rect
              x="0"
              y="0"
              width="140"
              height="60"
              rx="6"
              fill="#0D1528"
              stroke="#93C5FD"
            />
            <text x="12" y="22" fill="#93C5FD" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              ENDPOINT VALIDATOR
            </text>
            <text x="12" y="40" fill="#CBD5E1" fontSize="9" fontFamily="JetBrains Mono, monospace">
              Status & Schema Check
            </text>
          </g>

          <g transform="translate(485, 35)">
            <rect
              x="0"
              y="0"
              width="128"
              height="56"
              rx="6"
              fill="#0D1528"
              stroke="rgba(56,189,248,0.45)"
            />
            <text x="12" y="22" fill="#38BDF8" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              BLUESTOCK INTERN
            </text>
            <text x="12" y="38" fill="#94A3B8" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              API Testing Verified
            </text>
          </g>

          <g transform="translate(485, 128)">
            <rect
              x="0"
              y="0"
              width="128"
              height="58"
              rx="6"
              fill="#1E1024"
              stroke="#A78BFA"
            />
            <text x="12" y="22" fill="#C4B5FD" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              GSSoC OPEN SOURCE
            </text>
            <text x="12" y="38" fill="#E2E8F0" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              GitHub PRs & Quality
            </text>
          </g>

          <g transform="translate(30, 195)">
            <rect
              x="0"
              y="0"
              width="280"
              height="48"
              rx="6"
              fill="rgba(15,23,42,0.85)"
              stroke="rgba(148,163,184,0.25)"
            />
            <text x="14" y="20" fill="#E2E8F0" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              SMART INDIA HACKATHON (SIH) FINALIST
            </text>
            <text x="14" y="35" fill="#38BDF8" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
              Top 50 / 1,000 in College Coding Clubs
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
