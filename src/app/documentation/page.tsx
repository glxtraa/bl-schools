'use client';

import { useLanguage, LanguageProvider } from '@/lib/i18n';
import Link from 'next/link';

function DocumentationContent() {
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
          00 — System Documentation
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-8 max-w-4xl">
          Technical<br />
          <span className="text-accent">Specifications</span>
        </h1>
        <p className="text-cool-mist text-lg md:text-xl max-w-3xl leading-relaxed">
          The standard for water sustainability. Measured. Verified. Auditable.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
        <section className="glass-panel p-8 animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4">01 — Mission</div>
          <h2 className="text-2xl mb-6 uppercase tracking-tight">Who We Are</h2>
          <p className="text-cool-mist mb-6">
            Blue Lifeline is a water sustainability platform that issues verified Water Benefit Tokens (WBTs) — 
            each representing one cubic meter of certified water benefit. 
          </p>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span>Enable companies to become credibly water positive.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span>Connect corporate demand to verified water impact projects.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent">✓</span>
              <span>Eliminate greenwashing through IoT and Blockchain transparency.</span>
            </li>
          </ul>
        </section>

        <section className="glass-panel p-8 animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4">02 — The Product</div>
          <h2 className="text-2xl mb-6 uppercase tracking-tight">Water Benefit Tokens</h2>
          <p className="text-cool-mist mb-6">
            Measured. Verified. Auditable. Every WBT is backed by real-world impact data.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-navy/50 p-4 border border-border">
              <div className="text-xl mb-1">🌊</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Standard</div>
              <div className="text-sm">VWBA Certified</div>
            </div>
            <div className="bg-navy/50 p-4 border border-border">
              <div className="text-xl mb-1">⛓️</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Tech</div>
              <div className="text-sm">Blockchain Traced</div>
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 animate-in md:col-span-2" style={{ animationDelay: '0.3s' }}>
          <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4">03 — Data Integrity</div>
          <h2 className="text-2xl mb-6 uppercase tracking-tight">Visual Language & Transparency</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg mb-3">IoT Measurement</h3>
              <p className="text-cool-mist text-sm">
                Direct monitoring of school water systems ensures every drop is accounted for.
              </p>
            </div>
            <div>
              <h3 className="text-lg mb-3">IPFS Storage</h3>
              <p className="text-cool-mist text-sm">
                All data, including sensor logs and field verification photos, is stored on IPFS for decentralized availability.
              </p>
            </div>
            <div>
              <h3 className="text-lg mb-3">Public Audit</h3>
              <p className="text-cool-mist text-sm">
                The Blue Lifeline registry is open for public audit via the dashboard, ensuring absolute accountability.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-40 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-cool-mist uppercase tracking-[0.2em] pb-20">
        <div>&copy; 2026 Blue Lifeline — {t('footerTagline')}</div>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          <Link href="/vercel-candidate" className="hover:text-accent transition-colors">Vercel candidate</Link>
        </div>
      </footer>
    </main>
  );
}

export default function Documentation() {
  return (
    <LanguageProvider>
      <DocumentationContent />
    </LanguageProvider>
  );
}
