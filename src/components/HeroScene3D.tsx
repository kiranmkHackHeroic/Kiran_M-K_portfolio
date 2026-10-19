import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  dampValue,
  generateSpiralGalaxyBuffers,
  resolveThemePalette,
  stepSpringPhysics,
  SpringState,
  ThemeMode,
} from '../utils/physicsAndPortfolioLogic';

export type MaterialFinishPreset = 'optical-glass' | 'brushed-chrome' | 'wireframe-lattice';

interface HeroScene3DProps {
  finishPreset: MaterialFinishPreset;
  explodedFactor: number;
  speedMultiplier: number;
  reducedMotion: boolean;
  themeMode?: ThemeMode;
}

// Pre-allocated scratch objects outside the animation loop (Zero GC in render loop)
const _dummyObj = new THREE.Object3D();
const _scratchColor = new THREE.Color();

function createDialCanvasTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    const cx = 256;
    const cy = 256;

    // Outer subtle galactic coordinate ring
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 236, 0, Math.PI * 2);
    ctx.stroke();

    // Inner galactic horizon ring
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 168, 0, Math.PI * 2);
    ctx.stroke();

    // Precision tick marks around perimeter
    const ticks = 72;
    for (let i = 0; i < ticks; i++) {
      const angle = (i / ticks) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const innerR = isMajor ? 214 : 224;
      const outerR = 234;
      ctx.strokeStyle = isMajor ? 'rgba(147, 197, 253, 0.85)' : 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = isMajor ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function createStarGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.22, 'rgba(224, 242, 254, 0.92)');
    grad.addColorStop(0.55, 'rgba(56, 189, 248, 0.38)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createNebulaCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    grad.addColorStop(0, 'rgba(255, 250, 235, 0.85)');
    grad.addColorStop(0.28, 'rgba(56, 189, 248, 0.45)');
    grad.addColorStop(0.68, 'rgba(167, 139, 250, 0.18)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSpiralGalaxyDiskTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    const cx = 256;
    const cy = 256;

    // Draw 4 luminous logarithmic spiral nebula arms
    const arms = 4;
    for (let arm = 0; arm < arms; arm++) {
      const baseAngle = (arm / arms) * Math.PI * 2;
      for (let step = 0; step < 190; step++) {
        const t = step / 190;
        const r = t * 230;
        const angle = baseAngle + t * 3.45;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        const puffRadius = (1 - t * 0.55) * 34 + 8;

        const puffGrad = ctx.createRadialGradient(x, y, 0, x, y, puffRadius);
        if (t < 0.28) {
          puffGrad.addColorStop(0, 'rgba(254, 243, 199, 0.14)');
          puffGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
          puffGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else if (t < 0.65) {
          puffGrad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
          puffGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.06)');
          puffGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          puffGrad.addColorStop(0, 'rgba(192, 132, 252, 0.09)');
          puffGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.04)');
          puffGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = puffGrad;
        ctx.beginPath();
        ctx.arc(x, y, puffRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Intense Galactic Core Bulge
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 115);
    coreGrad.addColorStop(0, 'rgba(255, 251, 235, 0.95)');
    coreGrad.addColorStop(0.22, 'rgba(186, 230, 253, 0.72)');
    coreGrad.addColorStop(0.52, 'rgba(56, 189, 248, 0.28)');
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, 512, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(2, 6, 23, 0.85)');
    gradient.addColorStop(0.45, 'rgba(14, 165, 233, 0.18)');
    gradient.addColorStop(1, 'rgba(5, 7, 14, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  finishPreset,
  explodedFactor,
  speedMultiplier,
  reducedMotion,
  themeMode = 'midnight',
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Store mutable props in refs so React HUD updates never tear down the WebGLRenderer
  const propsRef = useRef({
    finishPreset,
    explodedFactor,
    speedMultiplier,
    reducedMotion,
    themeMode,
  });

  useEffect(() => {
    propsRef.current = {
      finishPreset,
      explodedFactor,
      speedMultiplier,
      reducedMotion,
      themeMode,
    };
  }, [finishPreset, explodedFactor, speedMultiplier, reducedMotion, themeMode]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isHeadless =
      navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const isMobile = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070e, 0.042);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 7.8);

    // Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // 3-Point Studio Lighting Rig with Warm/Cool Contrast
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x090d16, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf8fafc, 2.2);
    keyLight.position.set(4.5, 6.0, 5.0);
    if (!isHeadless) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 20;
      const d = 4;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cyan Rim Light & Soft Violet Backlight
    const cyanRimLight = new THREE.PointLight(0x38bdf8, 4.5, 14);
    cyanRimLight.position.set(-3.8, 2.2, -2.5);
    scene.add(cyanRimLight);

    const violetRimLight = new THREE.PointLight(0xa78bfa, 3.8, 14);
    violetRimLight.position.set(3.6, -2.0, -2.2);
    scene.add(violetRimLight);

    // Root 3D Galaxy & Accretion Centerpiece Group
    const rootGroup = new THREE.Group();
    const updateRootOffset = (w: number) => {
      rootGroup.position.x = w >= 1024 ? 1.52 : 0;
      rootGroup.position.y = w >= 1024 ? 0.08 : -1.02;
      const responsiveScale = w >= 1024 ? 1.0 : 0.64;
      rootGroup.scale.setScalar(responsiveScale);
    };
    updateRootOffset(width);
    scene.add(rootGroup);

    const sculptureGroup = new THREE.Group();
    rootGroup.add(sculptureGroup);

    // =========================================================================
    // 3D LOGARITHMIC SPIRAL GALAXY & VOLUMETRIC NEBULA ARM SYSTEM
    // =========================================================================
    const galaxyGroup = new THREE.Group();
    // Tilt the galactic plane in 3D space so all 4 spiral arms & central bulge read clearly
    galaxyGroup.rotation.x = 0.64;
    galaxyGroup.rotation.z = -0.22;
    sculptureGroup.add(galaxyGroup);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const starGlowTex = createStarGlowTexture();
    const nebulaCloudTex = createNebulaCloudTexture();
    const spiralDiskTex = createSpiralGalaxyDiskTexture(maxAniso);

    // Primary 4-Arm Spiral Galaxy Starfield
    const galaxyStarCount = isHeadless ? 2600 : isMobile ? 3200 : 6000;
    const galaxyBuffers = generateSpiralGalaxyBuffers({
      starCount: galaxyStarCount,
      arms: 4,
      galaxyRadius: 3.55,
      spinFactor: 2.35,
      randomness: 0.2,
      randomnessPower: 3.1,
      coreRgb: [1.0, 0.97, 0.86],
      midRgb: [0.22, 0.78, 0.99],
      outerRgb: [0.74, 0.38, 0.98],
      seed: 18032026,
    });

    const galaxyLivePositions = new Float32Array(galaxyBuffers.basePositions);
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPosAttr = new THREE.BufferAttribute(galaxyLivePositions, 3);
    galaxyGeo.setAttribute('position', galaxyPosAttr);
    galaxyGeo.setAttribute(
      'color',
      new THREE.BufferAttribute(galaxyBuffers.colors, 3)
    );

    const galaxyMat = new THREE.PointsMaterial({
      size: isHeadless ? 0.11 : 0.095,
      map: starGlowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.98,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyGroup.add(galaxyPoints);

    // Secondary Nebula Dust Spiral Clouds along the 4 Galactic Arms
    const nebulaCount = isHeadless ? 320 : isMobile ? 420 : 750;
    const nebulaBuffers = generateSpiralGalaxyBuffers({
      starCount: nebulaCount,
      arms: 4,
      galaxyRadius: 3.3,
      spinFactor: 2.32,
      randomness: 0.28,
      randomnessPower: 2.6,
      coreRgb: [1.0, 0.92, 0.78],
      midRgb: [0.22, 0.72, 0.98],
      outerRgb: [0.64, 0.3, 0.95],
      seed: 90421011,
    });

    const nebulaGeo = new THREE.BufferGeometry();
    nebulaGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(nebulaBuffers.basePositions, 3)
    );
    nebulaGeo.setAttribute(
      'color',
      new THREE.BufferAttribute(nebulaBuffers.colors, 3)
    );

    const nebulaMat = new THREE.PointsMaterial({
      size: isHeadless ? 0.42 : 0.45,
      map: nebulaCloudTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMat);
    galaxyGroup.add(nebulaPoints);

    // Luminous Spiral Galaxy Nebula Plane + Core Bulge Halo
    const bulgeHaloGeo = new THREE.PlaneGeometry(6.8, 6.8);
    const bulgeHaloMat = new THREE.MeshBasicMaterial({
      map: spiralDiskTex,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const bulgeHaloMesh = new THREE.Mesh(bulgeHaloGeo, bulgeHaloMat);
    bulgeHaloMesh.rotation.x = -Math.PI / 2;
    galaxyGroup.add(bulgeHaloMesh);

    // =========================================================================
    // COMPOSITE 10-PART GALACTIC SINGULARITY & ACCRETION GYROSCOPE ASSEMBLY
    // =========================================================================

    // Part 1: Inner Anisotropic Brushed Titanium Pulsar Singularity (Roughness 0.16, Metalness 0.95)
    const innerCoreGeo = new THREE.OctahedronGeometry(0.28, 2);
    const innerCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      metalness: 0.95,
      roughness: 0.16,
      anisotropy: 0.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.85,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    innerCoreMesh.castShadow = !isHeadless;
    sculptureGroup.add(innerCoreMesh);

    // Part 2: Core Lattice Wireframe Cage (Roughness 0.45, Metalness 0.85)
    const cageGeo = new THREE.IcosahedronGeometry(0.42, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      metalness: 0.85,
      roughness: 0.45,
      wireframe: true,
      transparent: true,
      opacity: 0.52,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    sculptureGroup.add(cageMesh);

    // Part 3: Primary Silhouette — Translucent Event-Horizon Crystal Lens (Roughness 0.08, Transmission 0.92)
    const glassShellGeo = new THREE.IcosahedronGeometry(0.56, 0);
    const glassShellMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.92,
      ior: 1.62,
      thickness: 1.1,
      attenuationColor: new THREE.Color(0x38bdf8),
      attenuationDistance: 2.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      depthWrite: false,
    });
    const glassShellMesh = new THREE.Mesh(glassShellGeo, glassShellMat);
    glassShellMesh.renderOrder = 2;
    sculptureGroup.add(glassShellMesh);

    // Part 4, 5, 6: Secondary Read — Three Relativistic Accretion Gimbal Rings with varied roughness
    const ring1Geo = new THREE.TorusGeometry(1.15, 0.018, 24, 96);
    const ring1Mat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.92,
      roughness: 0.14,
      anisotropy: 0.7,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI * 0.32;
    sculptureGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(1.85, 0.014, 20, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.75,
      roughness: 0.42,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI * 0.25;
    ring2Mesh.rotation.x = -Math.PI * 0.18;
    sculptureGroup.add(ring2Mesh);

    const ring3Geo = new THREE.TorusGeometry(2.45, 0.011, 16, 110);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      metalness: 0.85,
      roughness: 0.28,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.32,
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Mesh.rotation.x = Math.PI * 0.44;
    ring3Mesh.rotation.z = Math.PI * 0.15;
    sculptureGroup.add(ring3Mesh);

    // Part 7 & 8: Relativistic Polar Axis Spindles (Top & Bottom Chrome Finials)
    const finialGeo = new THREE.ConeGeometry(0.085, 0.42, 6);
    const finialMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.9,
      roughness: 0.2,
    });
    const topFinial = new THREE.Mesh(finialGeo, finialMat);
    topFinial.position.set(0, 1.38, 0);
    sculptureGroup.add(topFinial);

    const bottomFinial = new THREE.Mesh(finialGeo, finialMat);
    bottomFinial.position.set(0, -1.38, 0);
    bottomFinial.rotation.x = Math.PI;
    sculptureGroup.add(bottomFinial);

    // Part 9: Procedural Galactic Coordinate Dial Plane
    const dialTexture = createDialCanvasTexture(maxAniso);
    const dialGeo = new THREE.PlaneGeometry(4.9, 4.9);
    const dialMat = new THREE.MeshBasicMaterial({
      map: dialTexture,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.rotation.x = Math.PI * 0.36;
    sculptureGroup.add(dialMesh);

    // Part 10: Orbiting Star-Cluster Satellites (InstancedMesh with per-instance scale & tint)
    const fragmentCount = 18;
    const fragmentGeo = new THREE.OctahedronGeometry(0.095, 0);
    const fragmentMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.78,
      roughness: 0.22,
    });
    const fragmentsInstanced = new THREE.InstancedMesh(
      fragmentGeo,
      fragmentMat,
      fragmentCount
    );
    fragmentsInstanced.frustumCulled = false;

    interface FragmentOrbitData {
      angle: number;
      radius: number;
      yOffset: number;
      speed: number;
      scale: number;
      tilt: number;
    }
    const fragmentOrbits: FragmentOrbitData[] = [];

    for (let i = 0; i < fragmentCount; i++) {
      const angle = (i / fragmentCount) * Math.PI * 2;
      const radius = 1.55 + (i % 4) * 0.42;
      const yOffset = ((i % 5) - 2) * 0.26;
      const scale = 0.85 + ((i * 7) % 30) / 100; // ±15% variation
      fragmentOrbits.push({
        angle,
        radius,
        yOffset,
        speed: 0.25 + (i % 4) * 0.08,
        scale,
        tilt: i * 0.4,
      });

      if (i % 3 === 0) {
        _scratchColor.setHex(0x38bdf8);
      } else if (i % 3 === 1) {
        _scratchColor.setHex(0xa78bfa);
      } else {
        _scratchColor.setHex(0xe2e8f0);
      }
      fragmentsInstanced.setColorAt(i, _scratchColor);
    }
    if (fragmentsInstanced.instanceColor) {
      fragmentsInstanced.instanceColor.needsUpdate = true;
    }
    fragmentsInstanced.computeBoundingSphere();
    sculptureGroup.add(fragmentsInstanced);

    // Grounded Contact Shadow Disc beneath the 3D galaxy centerpiece
    const shadowTex = createContactShadowTexture();
    const shadowPlaneGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.42;
    rootGroup.add(shadowPlane);

    // Deep-Space Background Starfield across the Full Hero Viewport
    const particleCount = isHeadless ? 120 : isMobile ? 180 : 360;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 9 - 2.5;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particlesMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      map: starGlowTex,
      size: 0.065,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particlesPoints = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesPoints);

    // Pre-warm shaders once after setup
    renderer.compile(scene, camera);

    // Pointer tracking with custom spring physics
    const pointerTarget = { x: 0, y: 0 };
    let springX: SpringState = { position: 0, velocity: 0 };
    let springY: SpringState = { position: 0, velocity: 0 };
    let smoothedExploded = propsRef.current.explodedFactor;
    let lastUpdatedExploded = -1;
    let entranceProgress = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (propsRef.current.reducedMotion) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerTarget.x = nx * 0.42;
      pointerTarget.y = ny * 0.32;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      updateRootOffset(newW);
    };
    window.addEventListener('resize', handleResize);

    // WebGL Context Lost / Restored Listeners
    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const startTimeMs = performance.now();
    let prevTimeMs = startTimeMs;
    let rafId = 0;
    let lastRenderTime = 0;

    const animate = (nowMs: number) => {
      rafId = requestAnimationFrame(animate);

      // Throttle to ~15fps in headless software rendering so screenshots never stall
      if (isHeadless && nowMs - lastRenderTime < 64) {
        return;
      }
      lastRenderTime = nowMs;

      const dt = Math.min(Math.max((nowMs - prevTimeMs) / 1000, 0.001), 0.05);
      prevTimeMs = nowMs;
      const elapsed = (nowMs - startTimeMs) / 1000;
      const {
        finishPreset: currentFinish,
        explodedFactor: targetExploded,
        speedMultiplier: speedMult,
        reducedMotion: isReduced,
        themeMode: activeTheme,
      } = propsRef.current;

      const palette = resolveThemePalette(activeTheme);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setHex(palette.fogHex);
      }
      hemiLight.color.setHex(palette.hemiSkyHex);
      hemiLight.groundColor.setHex(palette.hemiGroundHex);
      hemiLight.intensity = palette.hemiIntensity;
      cyanRimLight.color.setHex(palette.cyanRimHex);
      violetRimLight.color.setHex(palette.violetRimHex);
      glassShellMat.color.setHex(palette.glassColorHex);
      glassShellMat.attenuationColor.setHex(palette.glassAttenuationHex);
      particlesMat.color.setHex(palette.particleHex);
      particlesMat.opacity = palette.particleOpacity;
      shadowPlaneMat.opacity = activeTheme === 'day' ? 0.22 : 0.5;
      ring1Mat.color.setHex(activeTheme === 'day' ? 0x334155 : 0xf1f5f9);
      galaxyMat.opacity = activeTheme === 'day' ? 0.85 : 0.98;
      nebulaMat.opacity = activeTheme === 'day' ? 0.32 : 0.44;
      bulgeHaloMat.opacity = activeTheme === 'day' ? 0.52 : 0.88;

      // Entrance materialization scale & rotation
      entranceProgress = dampValue(entranceProgress, 1, 3.2, dt);
      const scaleVal = 0.84 + 0.16 * entranceProgress;
      sculptureGroup.scale.setScalar(scaleVal);

      // Update Material Finish Preset dynamically
      if (currentFinish === 'optical-glass') {
        glassShellMat.wireframe = false;
        glassShellMat.transmission = 0.92;
        glassShellMat.roughness = 0.08;
        glassShellMat.metalness = 0.05;
        innerCoreMat.wireframe = false;
      } else if (currentFinish === 'brushed-chrome') {
        glassShellMat.wireframe = false;
        glassShellMat.transmission = 0.15;
        glassShellMat.metalness = 0.92;
        glassShellMat.roughness = 0.18;
        innerCoreMat.wireframe = false;
      } else {
        glassShellMat.wireframe = true;
        glassShellMat.transmission = 0;
        innerCoreMat.wireframe = true;
      }

      // Smoothly interpolate Exploded View factor
      smoothedExploded = dampValue(smoothedExploded, targetExploded, 6.5, dt);

      // Spring physics for pointer responsiveness
      springX = stepSpringPhysics(springX, pointerTarget.x, dt, {
        stiffness: 110,
        damping: 16,
      });
      springY = stepSpringPhysics(springY, pointerTarget.y, dt, {
        stiffness: 110,
        damping: 16,
      });

      const activeSpeed = isReduced ? 0.08 : speedMult;

      // Apply gentle rotation + pointer spring tilt to the entire 3D galaxy & core
      sculptureGroup.rotation.y = elapsed * 0.18 * activeSpeed + springX.position;
      sculptureGroup.rotation.x = Math.sin(elapsed * 0.32) * 0.07 + springY.position;

      // Differential spiral galaxy rotation around its tilted galactic axis
      galaxyPoints.rotation.y = -elapsed * 0.32 * activeSpeed;
      nebulaPoints.rotation.y = -elapsed * 0.26 * activeSpeed;
      bulgeHaloMesh.rotation.z = elapsed * 0.28 * activeSpeed;

      // Floating vertical breathing motion
      sculptureGroup.position.y = isReduced
        ? 0
        : Math.sin(elapsed * 1.1) * 0.08;

      // Exploded view layer expansion (expands spiral galaxy arms + accretion rings)
      const exp = smoothedExploded;
      if (Math.abs(exp - lastUpdatedExploded) > 0.002) {
        lastUpdatedExploded = exp;
        const basePos = galaxyBuffers.basePositions;
        const normRadii = galaxyBuffers.normalizedRadii;
        for (let i = 0; i < galaxyStarCount; i++) {
          const i3 = i * 3;
          const radialStretch = 1 + exp * (0.25 + normRadii[i] * 0.38);
          const verticalStretch = 1 + exp * 1.35;
          galaxyLivePositions[i3] = basePos[i3] * radialStretch;
          galaxyLivePositions[i3 + 1] = basePos[i3 + 1] * verticalStretch;
          galaxyLivePositions[i3 + 2] = basePos[i3 + 2] * radialStretch;
        }
        galaxyPosAttr.needsUpdate = true;
        nebulaPoints.scale.set(
          1 + exp * 0.35,
          1 + exp * 1.1,
          1 + exp * 0.35
        );
      }

      glassShellMesh.scale.setScalar(1 + exp * 0.28);
      cageMesh.scale.setScalar(1 + exp * 0.14);
      ring1Mesh.scale.setScalar(1 + exp * 0.22);
      ring2Mesh.scale.setScalar(1 + exp * 0.34);
      ring3Mesh.scale.setScalar(1 + exp * 0.45);
      topFinial.position.y = 1.38 + exp * 0.65;
      bottomFinial.position.y = -1.38 - exp * 0.65;

      // Counter-rotate inner pulsar kernel & orbital accretion rings
      innerCoreMesh.rotation.y = -elapsed * 0.45 * activeSpeed;
      innerCoreMesh.rotation.z = elapsed * 0.2 * activeSpeed;
      ring1Mesh.rotation.z = elapsed * 0.32 * activeSpeed;
      ring2Mesh.rotation.x = -Math.PI * 0.18 + elapsed * 0.22 * activeSpeed;
      ring3Mesh.rotation.y = elapsed * 0.18 * activeSpeed;
      dialMesh.rotation.z = -elapsed * 0.12 * activeSpeed;

      // Update Orbiting Instanced Star-Cluster Satellites
      for (let i = 0; i < fragmentCount; i++) {
        const orb = fragmentOrbits[i];
        const a = orb.angle + elapsed * orb.speed * activeSpeed;
        const r = orb.radius * (1 + exp * 0.42);
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const y =
          orb.yOffset * (1 + exp * 0.5) +
          Math.sin(elapsed * 1.4 + i) * 0.08;

        _dummyObj.position.set(x, y, z);
        _dummyObj.rotation.set(
          elapsed * 0.6 + orb.tilt,
          elapsed * 0.8 + i,
          orb.tilt
        );
        _dummyObj.scale.setScalar(orb.scale);
        _dummyObj.updateMatrix();
        fragmentsInstanced.setMatrixAt(i, _dummyObj.matrix);
      }
      fragmentsInstanced.instanceMatrix.needsUpdate = true;

      // Subtle drift for deep-space background stars
      particlesPoints.rotation.y = elapsed * 0.02 * activeSpeed;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      // Dispose all geometries, materials, and textures
      galaxyGeo.dispose();
      galaxyMat.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      bulgeHaloGeo.dispose();
      bulgeHaloMat.dispose();
      starGlowTex.dispose();
      nebulaCloudTex.dispose();
      spiralDiskTex.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      glassShellGeo.dispose();
      glassShellMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      finialGeo.dispose();
      finialMat.dispose();
      dialGeo.dispose();
      dialMat.dispose();
      dialTexture.dispose();
      fragmentGeo.dispose();
      fragmentMat.dispose();
      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      shadowTex.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div
        data-testid="hero-3d-fallback"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-72 h-72 rounded-full border border-sky-400/20 bg-radial from-sky-500/15 via-indigo-500/5 to-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={canvasMountRef}
      data-testid="hero-3d-canvas-container"
      data-scene="3d-spiral-galaxy"
      aria-label="Interactive 3D logarithmic spiral galaxy and optical accretion core"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

