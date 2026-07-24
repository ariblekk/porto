"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    if (!dotEl || !ringEl) return;

    let hovering = false;
    let lastX = -1;
    let lastY = -1;

    const render = () => {
      ringEl.style.transform = `translate(${lastX}px, ${lastY}px) translate(-50%, -50%) scale(${hovering ? 1.5 : 1})`;
      dotEl.style.transform = `translate(${lastX}px, ${lastY}px) translate(-50%, -50%)`;
    };

    const setHover = (target: EventTarget | Element | null) => {
      const t = target instanceof Element ? target : null;
      hovering = !!t?.closest("a, button");
      render(); // re-apply scale even when the mouse didn't move (e.g. scroll)
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      render();
    };
    const onOver = (e: MouseEvent) => setHover(e.target);
    // scrolling moves elements under a stationary cursor without firing mousemove
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
        style={{ transform: "translate(-100px, -100px)" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot"
        style={{ transform: "translate(-100px, -100px)" }}
      />
    </>
  );
}
