"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hovering = false;
    let lastX = -1;
    let lastY = -1;

    const render = () => {
      el.style.transform = `translate(${lastX}px, ${lastY}px) translate(-50%, -50%) scale(${hovering ? 2 : 1})`;
    };

    const setHover = (target: EventTarget | Element | null) => {
      const t = target instanceof Element ? target : null;
      hovering = !!t?.closest("a, button");
      // hide the dot when a work preview image is showing
      el.style.opacity = t?.closest("[data-preview]") ? "0" : "1";
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
    <div
      ref={ref}
      aria-hidden
      className="cursor-dot"
      style={{ transform: "translate(-100px, -100px)" }}
    />
  );
}
