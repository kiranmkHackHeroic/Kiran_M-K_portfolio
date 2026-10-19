import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThemeMode } from '../utils/physicsAndPortfolioLogic';

interface ContactScene3DProps {
  reducedMotion: boolean;
  themeMode?: ThemeMode;
}

export const ContactScene3D: React.FC<ContactScene3DProps> = ({
  reducedMotion,
  themeMode = 'midnight',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const themeRef = useRef<ThemeMode>(themeMode);

  useEffect(() => {
    themeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isHeadless =
      navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        alpha: true,
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xf8fafc, 2.0);
    dirLight.position.set(3, 4, 4);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xa78bfa, 3.5, 10);
    rimLight.position.set(-3, -2, 2);
    scene.add(rimLight);

    // 3-part abstract sculptural knot + orbital halo + inner core
    const group = new THREE.Group();
    scene.add(group);

    const knotGeo = new THREE.TorusKnotGeometry(0.95, 0.24, 96, 24, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      iridescence: 0.5,
      iridescenceIOR: 1.4,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    group.add(knotMesh);

    const haloGeo = new THREE.TorusGeometry(1.55, 0.015, 16, 80);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.45,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 3;
    group.add(haloMesh);

    const coreGeo = new THREE.OctahedronGeometry(0.42, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      metalness: 0.5,
      roughness: 0.5,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    renderer.compile(scene, camera);

    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const startTimeMs = performance.now();
    let rafId = 0;
    let lastMs = 0;

    // Render initial frame immediately
    renderer.render(scene, camera);

    const animate = (nowMs: number) => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;
      if (isHeadless && nowMs - lastMs < 80) return;
      lastMs = nowMs;

      const isDay = themeRef.current === 'day';
      hemiLight.color.setHex(isDay ? 0x0284c7 : 0x38bdf8);
      hemiLight.groundColor.setHex(isDay ? 0xcbd5e1 : 0x1e1b4b);
      hemiLight.intensity = isDay ? 1.65 : 1.2;
      knotMat.color.setHex(isDay ? 0x475569 : 0xe2e8f0);
      haloMat.color.setHex(isDay ? 0x0284c7 : 0x38bdf8);
      coreMat.color.setHex(isDay ? 0x6d28d9 : 0xa78bfa);

      const elapsed = (nowMs - startTimeMs) / 1000;
      const speed = reducedMotion ? 0.05 : 1;
      knotMesh.rotation.y = elapsed * 0.35 * speed;
      knotMesh.rotation.x = elapsed * 0.2 * speed;
      haloMesh.rotation.z = -elapsed * 0.25 * speed;
      coreMesh.rotation.y = -elapsed * 0.5 * speed;

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      knotGeo.dispose();
      knotMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      data-testid="contact-3d-sculpture"
      aria-hidden="true"
      className="w-64 h-64 md:w-80 md:h-80 mx-auto pointer-events-none"
    />
  );
};
