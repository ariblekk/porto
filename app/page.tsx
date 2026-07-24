import { ArrowUpRight, Dot } from "lucide-react";
import SceneLoader from "./components/scene-loader";
import Gsap from "./components/gsap";

const works = [
  { title: "Diginvited", tag: "Nextjs / Invitations App", year: "2025" },
  { title: "KASR", tag: "Flutter / E-commerce", year: "2025" },
  { title: "LaundryIN", tag: "Flutter / E-commerce", year: "2025" },
];

const marqueeItems = ["Design", "Development", "Motion", "WebGL", "GSAP"];

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Home() {
  return (
    <>
      <SceneLoader />
      <Gsap>
        {/* Nav */}
        <header className="fixed top-0 z-10 flex w-full items-center justify-between bg-background/50 px-6 py-5 font-mono text-xs uppercase tracking-wider backdrop-blur-md md:px-12 md:tracking-widest">
          <span>
            <span className="sm:hidden">BCT — ©2026</span>
            <span className="hidden sm:inline">Blek Creative Tech</span>
          </span>
          <nav className="flex gap-4 sm:gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="glitch">
                {l.label}
              </a>
            ))}
          </nav>
        </header>

        <main>
          {/* Hero */}
          <section className="flex min-h-screen flex-col justify-end px-6 pb-16 md:px-12">
            <p className="mb-4 overflow-hidden font-mono text-xs uppercase tracking-wider text-muted sm:tracking-widest">
              <span data-hero className="block">Fullstack Developer — Available for work</span>
            </p>
            <h1 className="leading-[0.85] font-bold tracking-tighter uppercase">
              <span className="block overflow-hidden text-[16vw] md:text-[12vw]">
                <span data-hero className="block">Blek</span>
              </span>
              <span className="block overflow-hidden text-[10vw] md:text-[7vw]">
                <span data-hero className="block text-accent">Creative Tech</span>
              </span>
            </h1>
            <div className="mt-8 overflow-hidden">
              <p data-hero className="block max-w-md text-muted">
                Fullstack developer building digital products end to end —
                from pixel to database. Scroll to explore.
              </p>
            </div>
          </section>

          {/* Marquee */}
          <div className="overflow-hidden border-y border-foreground/10 py-4" aria-hidden>
            <div data-marquee className="flex w-max font-mono text-xs uppercase tracking-widest whitespace-nowrap will-change-transform sm:text-sm">
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0">
                  {[...Array(4)].flatMap((_, rep) =>
                    marqueeItems.map((item) => (
                      <span key={`${rep}-${item}`} className="flex items-center gap-6 px-6">
                        {item} <Dot className="size-4 text-accent" aria-hidden />
                      </span>
                    )),
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Work */}
          <section id="work" className="px-6 py-20 md:px-12 md:py-32">
            <h2 data-animate className="mb-10 font-mono text-xs uppercase tracking-widest text-muted md:mb-16">
              Selected Work
            </h2>
            <ul>
              {works.map((w, i) => (
                <li key={w.title} data-animate>
                  <a
                    href="#contact"
                    className="group flex items-baseline justify-between gap-4 border-b border-foreground/10 py-6 transition-colors hover:border-accent sm:py-8"
                  >
                    <span className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-mono text-xs text-muted">
                        0{i + 1}
                      </span>
                      <span className="text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2 group-hover:text-accent sm:text-3xl md:text-5xl">
                        {w.title}
                      </span>
                    </span>
                    <span className="hidden font-mono text-xs text-muted sm:block">
                      {w.tag} — {w.year}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* About */}
          <section id="about" className="grid gap-8 px-6 py-20 md:grid-cols-2 md:gap-12 md:px-12 md:py-32">
            <h2 data-animate className="font-mono text-xs uppercase tracking-widest text-muted">
              About
            </h2>
            <div className="space-y-6 text-lg leading-relaxed sm:text-xl md:text-2xl">
              <p data-reveal>
                Blek Creative Tech is a fullstack developer studio focused on
                the intersection of design and technology — building fast,
                expressive products with React, Three.js, and GSAP.
              </p>
              <p data-reveal className="text-muted">
                From concept to deployment, front to back: buttery animations,
                solid APIs, accessible markup, and code that&apos;s easy to
                maintain.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="flex min-h-[70vh] flex-col items-start justify-center px-6 py-20 md:px-12 md:py-32">
            <h2 data-animate className="mb-8 font-mono text-xs uppercase tracking-widest text-muted">
              Got a project in mind?
            </h2>
            <a
              data-animate
              href="mailto:hello@blekcreative.tech"
              className="text-[10vw] leading-none font-bold tracking-tighter uppercase transition-colors hover:text-accent md:text-[7vw]"
            >
              Let&apos;s Talk{" "}
              <ArrowUpRight className="inline size-[0.7em] " aria-hidden />
            </a>
          </section>
        </main>

        <footer className="flex flex-col items-center gap-4 border-t border-foreground/10 bg-background/50 px-6 py-6 font-mono text-xs text-muted backdrop-blur-md sm:flex-row sm:justify-between md:px-12">
          <span>© 2026 Blek Creative Tech</span>
          <div className="flex gap-4 sm:gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">LinkedIn</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">X</a>
          </div>
        </footer>
      </Gsap>
    </>
  );
}
