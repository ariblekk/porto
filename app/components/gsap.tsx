"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Gsap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const marqueeCleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      // Hero titles: split by char
      gsap.utils.toArray<HTMLElement>("[data-hero-title]").forEach((el) => {
        const text = el.textContent ?? "";
        el.innerHTML = text
          .split("")
          .map((c) => (c === " " ? " " : `<span class="inline-block">${c}</span>`))
          .join("");
      });
      
      gsap.from("[data-hero-title] span", {
        yPercent: 120,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.04,
        delay: 0.2,
      });

      // Hero intro: masked lines slide up
      gsap.from("[data-hero]", {
        yPercent: 120,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.09,
        delay: 0.4,
      });

      // Generic scroll reveals
      gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Word-by-word color reveal, scrubbed to scroll
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const words = el.textContent ?? "";
        el.innerHTML = words
          .split(" ")
          .map((w) => `<span class="inline-block">${w}</span>`)
          .join(" ");
        gsap.fromTo(
          el.children,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 30%",
              scrub: true,
            },
          },
        );
      });

      // Marquee: rAF loop, eases to a crawl on hover
      const marquee = ref.current?.querySelector<HTMLElement>("[data-marquee]");
      if (marquee) {
        let x = 0;
        let speed = 50; // px/s
        let target = 50;
        let last = performance.now();
        const slow = () => (target = 8);
        const resume = () => (target = 50);
        marquee.addEventListener("mouseenter", slow);
        marquee.addEventListener("mouseleave", resume);

        const tick = (now: number) => {
          const dt = Math.min(now - last, 50);
          last = now;
          speed += (target - speed) * 0.05;
          x -= (speed * dt) / 1000;
          const half = marquee.scrollWidth / 2;
          if (-x >= half) x += half;
          marquee.style.transform = `translateX(${x}px)`;
          rafId = requestAnimationFrame(tick);
        };
        let rafId = requestAnimationFrame(tick);

        marqueeCleanups.push(() => {
          cancelAnimationFrame(rafId);
          marquee.removeEventListener("mouseenter", slow);
          marquee.removeEventListener("mouseleave", resume);
        });
      }
    }, ref);

    return () => {
      marqueeCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
