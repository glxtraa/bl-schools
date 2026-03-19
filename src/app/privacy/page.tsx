'use client';

import { useLanguage, LanguageProvider } from '@/lib/i18n';
import Link from 'next/link';

function PrivacyContent() {
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
          Commitment to Transparency
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-8 max-w-4xl">
          Privacy<br />
          <span className="text-accent">Policy</span>
        </h1>
        <p className="text-cool-mist text-lg md:text-xl max-w-3xl leading-relaxed">
          At Blue Lifeline, transparency is our foundation. We protect individual privacy while ensuring verifiable impact.
        </p>
      </header>

      <div className="max-w-3xl space-y-12 mb-32">
        <section>
          <h2 className="text-2xl mb-4 uppercase tracking-tight">1. Data Transparency</h2>
          <p className="text-cool-mist">
            Our water data is public by design to ensure corporate accountability. This includes water usage statistics, 
            basin-level aggregation, and project-specific metrics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4 uppercase tracking-tight">2. IoT and Field Data</h2>
          <p className="text-cool-mist">
            Data collected from IoT sensors and field visits is used solely for the verification of Water Benefit Tokens. 
            Personal information of school staff or students is NOT stored in the public registry.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4 uppercase tracking-tight">3. Blockchain Registry</h2>
          <p className="text-cool-mist">
            Once verified, water benefit metrics are committed to the blockchain. Due to the immutable nature of this technology, 
            this data cannot be altered or removed, ensuring a permanent record of impact.
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4 uppercase tracking-tight">4. Security</h2>
          <p className="text-cool-mist">
            We implement industry-standard security measures to protect the integrity of our data transmission 
            and storage on decentralized systems like IPFS.
          </p>
        </section>
      </div>

      <footer className="mt-40 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-cool-mist uppercase tracking-[0.2em] pb-20">
        <div>&copy; 2026 Blue Lifeline — {t('footerTagline')}</div>
        <div className="flex gap-8">
          <Link href="/documentation" className="hover:text-accent transition-colors">Documentation</Link>
          <Link href="/vercel-candidate" className="hover:text-accent transition-colors">Vercel candidate</Link>
        </div>
      </footer>
    </main>
  );
}

export default function Privacy() {
  return (
    <LanguageProvider>
      <PrivacyContent />
    </LanguageProvider>
  );
}
