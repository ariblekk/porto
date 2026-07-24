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
    let lastH = 0;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      
      // Update on both width and height changes to prevent stretching on mobile
      if (w !== lastW || h !== lastH) {
        lastW = w;
        lastH = h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        // responsive: pull camera back on narrow screens so the mesh fits
        baseZ = camera.aspect < 1 ? 6 / camera.aspect : 6;
      }
    };
    fit();

    // Planet Group (for consistent tilt and orbit)
    const planetGroup = new THREE.Group();
    // Fixed tilt for the whole system
    planetGroup.rotation.x = 0.4;
    planetGroup.rotation.z = 0.2;
    scene.add(planetGroup);

    // Central Planet (Geodesic Sphere)
    const planet = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 3), 
      new THREE.MeshBasicMaterial({
        color: 0xc6ff3e,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      }),
    );
    planetGroup.add(planet);

    // Orbit Rings
    // We use a clean solid line (wireframe: false) to avoid messy overlapping geometry
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xc6ff3e,
      wireframe: false, 
      transparent: true,
      opacity: 0.4,
    });
    
    // Concentric rings on the exact same plane
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.006, 4, 64), ringMaterial);
    ring1.rotation.x = Math.PI / 2;
    planetGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.01, 4, 64), ringMaterial);
    ring2.rotation.x = Math.PI / 2;
    planetGroup.add(ring2);
    
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.004, 4, 64), ringMaterial);
    ring3.rotation.x = Math.PI / 2;
    planetGroup.add(ring3);

    // Particle Galaxy (Disk shape)
    const count = 1200;
    const basePositions = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Galaxy disk distribution
      const r = 2.0 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      // Thickness decreases as radius increases
      const y = (Math.random() - 0.5) * (3 / r); 
      
      const px = r * Math.cos(theta);
      const py = y;
      const pz = r * Math.sin(theta);
      
      basePositions[i * 3] = px;
      basePositions[i * 3 + 1] = py;
      basePositions[i * 3 + 2] = pz;
      
      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;
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

    const resizeObserver = new ResizeObserver(() => fit());
    resizeObserver.observe(el);

    let raf = 0;
    let progress = 0;
    const timer = new THREE.Timer();
    const tick = () => {
      timer.update();
      const t = timer.getElapsed();
      
      const max = Math.max(document.body.scrollHeight, 1000);
      const target = (window.scrollY / max) * 1.5; 
      progress += (target - progress) * 0.08;

      // Animate Planet Group (slowly revolves and reacts to scroll)
      planetGroup.rotation.y = t * 0.05 + progress * Math.PI * 2;
      
      // The planet itself spins smoothly on its own Y axis
      planet.rotation.y = t * 0.15;

      // Galaxy rotation
      particles.rotation.y = t * 0.03 + progress * Math.PI * 0.5;
      particles.rotation.z = Math.sin(t * 0.1) * 0.05; // slight wobble

      // Particle Repulsion Logic
      const mouseWorldX = mouse.x * 4;
      const mouseWorldY = -mouse.y * 4;
      
      const angle = -particles.rotation.y;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      // reverse rotation for mouse to match particles local space
      const localMouseX = mouseWorldX * cosA - 0 * sinA;
      const localMouseZ = mouseWorldX * sinA + 0 * cosA;
      const localMouseY = mouseWorldY;

      const posAttribute = particles.geometry.attributes.position;
      const arr = posAttribute.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const bz = basePositions[i * 3 + 2];

        const dx = bx - localMouseX;
        const dy = by - localMouseY;
        const dz = bz - localMouseZ;
        const distSq = dx * dx + dy * dy + dz * dz;

        const maxDist = 2.0;
        let targetX = bx;
        let targetY = by;
        let targetZ = bz;

        if (distSq < maxDist * maxDist) {
          const dist = Math.sqrt(distSq);
          const force = Math.pow((maxDist - dist) / maxDist, 2);
          targetX = bx + (dx / dist) * force * 1.5;
          targetY = by + (dy / dist) * force * 1.5;
          targetZ = bz + (dz / dist) * force * 1.5;
        }

        arr[i * 3] += (targetX - arr[i * 3]) * 0.1;
        arr[i * 3 + 1] += (targetY - arr[i * 3 + 1]) * 0.1;
        arr[i * 3 + 2] += (targetZ - arr[i * 3 + 2]) * 0.1;
      }
      posAttribute.needsUpdate = true;

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
      resizeObserver.disconnect();
      renderer.dispose();
      geoDispose(planet, ring1, ring2, ring3, particles);
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      // Gunakan h-[100lvh] (Large Viewport Height) agar tinggi div tidak berubah-ubah
      // saat URL bar muncul/hilang, sehingga tidak men-trigger resize event berulang kali.
      className="fixed top-0 left-0 w-screen h-[100lvh] -z-10 [&>canvas]:block [&>canvas]:size-full"
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
