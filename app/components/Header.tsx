"use client";

import GlassSurface from './GlassSurface';
import Magnetic from './magnetic';

interface HeaderProps {
  navLinks: Array<{ label: string; href: string }>;
}

export default function Header({ navLinks }: HeaderProps) {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-500 flex justify-center">
      <div
        className="transition-all duration-500 ease-in-out w-full flex justify-center md:max-w-7xl"

      >
        <GlassSurface
          displace={2.1}
          distortionScale={10}
          redOffset={0}
          greenOffset={10}
          blueOffset={14}
          brightness={51}
          backgroundOpacity={0.34}
          borderRadius={50}
          mixBlendMode="screen"
          width="100%"
          height="auto"
          className="w-full transition-all duration-500"
        >
          <div className="w-full flex items-center justify-between py-2 px-2 font-mono text-xs uppercase tracking-wider md:px-12 md:tracking-widest transition-all duration-500">
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
          </div>
        </GlassSurface>
      </div>
    </header>
  );
}
