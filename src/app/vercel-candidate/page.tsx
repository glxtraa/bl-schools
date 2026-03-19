'use client';

import { useLanguage, LanguageProvider } from '@/lib/i18n';
import Link from 'next/link';

function CandidateContent() {
  const { t } = useLanguage();

  return (
    <main className="container min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-navy/90 border-b border-border z-50 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-baseline gap-2 no-underline text-ice-white">
            <span className="text-xl">💧</span>
            <div className="text-xl font-extrabold uppercase tracking-tighter">
              Blue<span className="text-accent">Lifeline</span>
            </div>
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-cool-mist hover:text-accent transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <header className="mb-20 pt-16">
        <div className="text-accent text-xs font-bold tracking-[0.25em] uppercase mb-6 flex items-center gap-4">
          <span className="h-[1px] w-8 bg-accent"></span>
          Technical Assessment
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-8 max-w-4xl">
          Vercel<br />
          <span className="text-accent">Candidate</span>
        </h1>
        <p className="text-cool-mist text-lg md:text-xl max-w-3xl leading-relaxed">
          This project was developed as a technical demonstration of advanced geospatial data parsing, 
          real-time monitoring integration, and modern frontend architecture.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
        <section className="glass-panel p-8 animate-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl mb-6 uppercase tracking-tight">Project Highlights</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="text-accent">✦</span>
              <div>
                <div className="font-bold">Next.js 14 App Router</div>
                <div className="text-cool-mist">Modern server components and optimized routing.</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✦</span>
              <div>
                <div className="font-bold">Geospatial Integration</div>
                <div className="text-cool-mist">Leaflet and GeoJSON processing for real-time hydrologic mapping.</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✦</span>
              <div>
                <div className="font-bold">Multilingual (i18n)</div>
                <div className="text-cool-mist">Dynamic English/Spanish switching with custom context logic.</div>
              </div>
            </li>
          </ul>
        </section>

        <section className="glass-panel p-8 animate-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl mb-6 uppercase tracking-tight">Candidate Profile</h2>
          <p className="text-cool-mist mb-6">
            Focused on building high-performance, visually stunning web applications that solve real-world environmental challenges.
          </p>
          <div className="space-y-4">
            <div className="bg-navy/50 p-4 border border-border">
              <div className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Status</div>
              <div className="text-sm">Ready for Deployment</div>
            </div>
            <div className="bg-navy/50 p-4 border border-border">
              <div className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Stack</div>
              <div className="text-sm">TypeScript, React, Next.js, Vercel</div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-40 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-cool-mist uppercase tracking-[0.2em] pb-20">
        <div>&copy; 2026 Blue Lifeline — {t('footerTagline')}</div>
        <div className="flex gap-8">
          <Link href="/documentation" className="hover:text-accent transition-colors">Documentation</Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
        </div>
      </footer>
    </main>
  );
}

export default function VercelCandidate() {
  return (
    <LanguageProvider>
      <CandidateContent />
    </LanguageProvider>
  );
}
