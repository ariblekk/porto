"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Image from "next/image";

interface ProjectPreviewProps {
  children: ReactNode;
  imageUrl: string;
}

export default function ProjectPreview({ children, imageUrl }: ProjectPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // queueMicrotask avoids the "synchronous setState in effect" ESLint warning
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    // quickTo for performant follow animation
    const xTo = gsap.quickTo(image, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(image, "y", { duration: 0.4, ease: "power3" });

    let isHovering = false;

    const moveImage = (e: MouseEvent) => {
      if (!isHovering) return;
      const { clientX, clientY } = e;
      xTo(clientX - 150); // assuming 300px width
      yTo(clientY - 100); // assuming 200px height
    };

    const mouseEnter = (e: MouseEvent) => {
      isHovering = true;
      const { clientX, clientY } = e;
      // Snap to cursor instantly on first enter
      gsap.set(image, { x: clientX - 150, y: clientY - 100 });
      gsap.to(image, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    };

    const mouseLeave = () => {
      isHovering = false;
      gsap.to(image, { autoAlpha: 0, scale: 0.8, duration: 0.3, ease: "power2.out" });
    };

    container.addEventListener("mouseenter", mouseEnter);
    container.addEventListener("mouseleave", mouseLeave);
    window.addEventListener("mousemove", moveImage); // listen on window to keep following smoothly

    return () => {
      container.removeEventListener("mouseenter", mouseEnter);
      container.removeEventListener("mouseleave", mouseLeave);
      window.removeEventListener("mousemove", moveImage);
    };
  }, [mounted]); // Re-run effect when mounted so imageRef is available

  return (
    <>
      <div ref={containerRef} className="relative z-10 w-full" data-hover>
        {children}
      </div>
      {mounted &&
        createPortal(
          <div
            ref={imageRef}
            className="pointer-events-none fixed top-0 left-0 z-[10000] h-[200px] w-[300px] overflow-hidden rounded-lg opacity-0"
            style={{ transform: "scale(0.8)", visibility: "hidden" }}
          >
            <Image
              src={imageUrl}
              alt="Project Preview"
              fill
              className="object-cover"
            />
          </div>,
          document.body
        )}
    </>
  );
}
