import { ArrowUpRight, Dot } from "lucide-react";
import SceneLoader from "./components/scene-loader";
import Gsap from "./components/gsap";
import ProjectPreview from "./components/project-preview";

import Magnetic from "./components/magnetic";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiGsap, SiFlutter, SiPostgresql, SiSupabase, SiDocker } from 'react-icons/si';
import { db } from "@/lib/db";

const marquee = [
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiGsap />, title: "GSAP", href: "https://greensock.com/gsap/" },
  { node: <SiFlutter />, title: "Flutter", href: "https://flutter.dev/" },
  { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org/" },
  { node: <SiSupabase />, title: "Supabase", href: "https://supabase.com/" },
  { node: <SiDocker />, title: "Docker", href: "https://www.docker.com/" },
];

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default async function Home() {
  const works = await db.work.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <SceneLoader />
      <Gsap>
        {/* Nav */}
        <header className="fixed top-0 z-10 flex w-full items-center justify-between bg-background/50 px-6 py-2 font-mono text-xs uppercase tracking-wider backdrop-blur-md md:px-12 md:tracking-widest">
          <span>
            <span className="sm:hidden">BCT — ©2026</span>
            <span className="hidden sm:inline">Blek Creative Tech</span>
          </span>
          <nav className="flex gap-4 sm:gap-6">
            {navLinks.map((l) => (
              <Magnetic key={l.href}>
                <a href={l.href} className="glitch p-2" data-hover>
                  {l.label}
                </a>
              </Magnetic>
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
                <span data-hero-title className="block">Blek</span>
              </span>
              <span className="block overflow-hidden text-[10vw] md:text-[7vw]">
                <span data-hero-title className="block text-accent">Creative Tech</span>
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
          <div className="overflow-hidden border-y border-foreground/10 py-4">
            <div data-marquee className="flex w-max font-mono text-xs uppercase tracking-widest whitespace-nowrap will-change-transform sm:text-sm">
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0" aria-hidden={half === 1 ? "true" : undefined}>
                  {[...Array(4)].flatMap((_, rep) =>
                    marquee.map((item, idx) => (
                      <span key={`${rep}-${idx}`} className="flex items-center">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={half === 1 || rep > 0 ? -1 : undefined}
                          className="flex items-center gap-1 px-6 transition-transform duration-250 hover:scale-115 hover:text-accent origin-center inline-flex"
                        >
                          <span className="text-sm sm:text-base" aria-hidden>{item.node}</span>
                          <span>{item.title}</span>
                        </a>
                        <Dot className="size-4 text-accent" aria-hidden />
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
                  <ProjectPreview imageUrl={w.image} >
                    <a
                      href={w.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-4 border-b border-foreground/10 py-6 transition-colors hover:border-accent sm:py-8"
                    >
                      <span className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-mono text-xs text-muted">
                          0{i + 1}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2 group-hover:text-accent sm:text-3xl md:text-5xl">
                            {w.title}
                          </span>
                          <span className="font-mono text-xs text-muted md:hidden mt-1">
                            {w.tag} — {w.year}
                          </span>
                        </span>
                        <span className=" font-mono text-xs text-muted sm:block">
                          <ArrowUpRight className="size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" aria-hidden />
                        </span>
                      </span>
                      <span className="hidden font-mono text-xs text-muted sm:block">
                        {w.tag} — {w.year}
                      </span>
                    </a>
                  </ProjectPreview>
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
                I&apos;m a fullstack developer passionate about creating immersive web experiences. With expertise in React, Three.js, and GSAP, I specialize in building interactive and visually stunning applications that engage users and deliver seamless performance.
              </p>
              <p data-reveal className="text-muted">
                I&apos;m always eager to explore new technologies and push the boundaries of web development. Whether it&apos;s crafting dynamic user interfaces, optimizing performance, or implementing cutting-edge animations, I strive to deliver exceptional digital experiences that leave a lasting impact.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="flex min-h-[70vh] flex-col items-start justify-center px-6 py-20 md:px-12 md:py-32">
            <h2 data-animate className="mb-8 font-mono text-xs uppercase tracking-widest text-muted">
              Got a project in mind?
            </h2>
            <Magnetic>
              <a
                data-animate
                data-hover
                href="mailto:ariharyanto067@gmail.com"
                className="group inline-block text-[10vw] leading-none font-bold tracking-tighter uppercase transition-colors hover:text-accent md:text-[7vw]"
              >
                Let&apos;s Talk{" "}
                <ArrowUpRight className="inline size-[0.7em] transition-transform duration-300 group-hover:translate-x-4 group-hover:-translate-y-4" aria-hidden />
              </a>
            </Magnetic>
          </section>
        </main>

        <footer className="flex flex-col items-center gap-4 border-t border-foreground/10 bg-background/50 px-6 py-6 font-mono text-xs text-muted backdrop-blur-md sm:flex-row sm:justify-between md:px-12">
          <span>© 2026 Blek Creative Tech</span>
          <div className="flex gap-4 sm:gap-6">
            <Magnetic>
              <a href="https://github.com/ariblekk" target="_blank" rel="noopener noreferrer" className="glitch p-2 transition-colors hover:text-accent" data-hover>GitHub</a>
            </Magnetic>
            <Magnetic>
              <a href="https://www.instagram.com/ariharyanto_/" target="_blank" rel="noopener noreferrer" className="glitch p-2 transition-colors hover:text-accent" data-hover>Instagram</a>
            </Magnetic>
            <Magnetic>
              <a href="https://www.tiktok.com/@ariharyanto_" target="_blank" rel="noopener noreferrer" className="glitch p-2 transition-colors hover:text-accent" data-hover>TikTok</a>
            </Magnetic>
          </div>
        </footer>
      </Gsap>
    </>
  );
}
