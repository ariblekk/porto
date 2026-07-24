"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    if (!dotEl || !ringEl) return;

    // Use GSAP quickTo for highly performant mouse tracking
    const xToDot = gsap.quickTo(dotEl, "x", { duration: 0.1, ease: "power3" });
    const yToDot = gsap.quickTo(dotEl, "y", { duration: 0.1, ease: "power3" });
    
    const xToRing = gsap.quickTo(ringEl, "x", { duration: 0.3, ease: "power3" });
    const yToRing = gsap.quickTo(ringEl, "y", { duration: 0.3, ease: "power3" });

    let hovering = false;
    let lastX = -100;
    let lastY = -100;

    const setHover = (target: EventTarget | Element | null) => {
      const t = target instanceof Element ? target : null;
      const isHovering = !!t?.closest("a, button, [data-hover]");
      if (isHovering !== hovering) {
        hovering = isHovering;
        if (hovering) {
          ringEl.classList.add("hovering");
          gsap.to(dotEl, { scale: 0, duration: 0.2 });
          gsap.to(ringEl, { 
            scale: 1.5, 
            backgroundColor: "#fff", 
            borderColor: "transparent",
            duration: 0.2 
          });
        } else {
          ringEl.classList.remove("hovering");
          gsap.to(dotEl, { scale: 1, duration: 0.2 });
          gsap.to(ringEl, { 
            scale: 1, 
            backgroundColor: "transparent", 
            borderColor: "rgba(255, 255, 255, 0.4)",
            duration: 0.2 
          });
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      xToDot(lastX);
      yToDot(lastY);
      xToRing(lastX);
      yToRing(lastY);
    };

    const onOver = (e: MouseEvent) => setHover(e.target);
    const onScroll = () => setHover(document.elementFromPoint(lastX, lastY));

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot"
      />
    </>
  );
}
