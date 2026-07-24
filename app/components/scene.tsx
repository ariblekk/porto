"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 6;

    let baseZ = 6;
    let lastW = 0;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      // ponytail: skip buffer realloc on height-only change (mobile URL bar
      // show/hide) — canvas CSS stretches via size-full. Add h to the check
      // if pixel-perfect height ever matters.
      if (w !== lastW) {
        lastW = w;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        // responsive: pull camera back on narrow screens so the mesh fits
        baseZ = camera.aspect < 1 ? 6 / camera.aspect : 6;
      }
    };
    fit();

    // Main wireframe icosahedron
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.8, 1),
      new THREE.MeshBasicMaterial({
        color: 0xc6ff3e,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    );
    scene.add(mesh);

    // Larger, fainter outer shell
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.6, 0),
      new THREE.MeshBasicMaterial({
        color: 0xededed,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      }),
    );
    scene.add(shell);

    // Particle field
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: 0xededed,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => fit();
    window.addEventListener("resize", onResize);

    let raf = 0;
    let progress = 0;
    const timer = new THREE.Timer();
    const tick = () => {
      timer.update();
      const t = timer.getElapsed();
      // ponytail: lerped+clamped progress — mobile URL bar toggling changes
      // innerHeight mid-scroll and made the raw value jump (scene snapped
      // back). Smoothing absorbs it; clamp kills iOS rubber-band negatives.
      const max = Math.max(
        document.body.scrollHeight - window.innerHeight,
        1,
      );
      const target = Math.min(Math.max(window.scrollY / max, 0), 1);
      progress += (target - progress) * 0.08;

      mesh.rotation.y = t * 0.15 + progress * Math.PI * 2;
      mesh.rotation.x = t * 0.08 + progress * Math.PI;
      shell.rotation.y = -t * 0.05;
      particles.rotation.y = t * 0.02;

      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.05;
      camera.position.z = baseZ - progress * 1.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      renderer.render(scene, camera); // static frame, no loop
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geoDispose(mesh, shell, particles);
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 [&>canvas]:block [&>canvas]:size-full"
    />
  );
}

function geoDispose(...objects: THREE.Object3D[]) {
  for (const o of objects) {
    if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  }
}
