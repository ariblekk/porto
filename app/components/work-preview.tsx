"use client";

import { useEffect, useRef } from "react";

export default function WorkPreview() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastX = -1;
    let lastY = -1;

    const setHover = (target: EventTarget | Element | null) => {
      const t = target instanceof Element ? target : null;
      const src = t?.closest("[data-preview]")?.getAttribute("data-preview");
      if (src && !el.src.endsWith(src)) el.src = src;
      el.style.opacity = src ? "1" : "0";
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      el.style.transform = `translate(${lastX}px, ${lastY}px) translate(-50%, -50%)`;
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
    // eslint-disable-next-line @next/next/no-img-element -- local SVGs swapped imperatively; next/image adds nothing here
    <img
      ref={ref}
      alt=""
      aria-hidden
      className="work-preview"
      style={{ transform: "translate(-100vw, 0)" }}
    />
  );
}
