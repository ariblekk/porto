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
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      el.clientWidth / el.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 6;

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

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const timer = new THREE.Timer();
    const tick = () => {
      timer.update();
      const t = timer.getElapsed();
      const progress =
        window.scrollY /
        Math.max(document.body.scrollHeight - window.innerHeight, 1);

      mesh.rotation.y = t * 0.15 + progress * Math.PI * 2;
      mesh.rotation.x = t * 0.08 + progress * Math.PI;
      shell.rotation.y = -t * 0.05;
      particles.rotation.y = t * 0.02;

      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.05;
      camera.position.z = 6 - progress * 1.5;
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
      className="fixed inset-0 -z-10 [&>canvas]:block"
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
