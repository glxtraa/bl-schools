'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getSchools } from '@/lib/data-parser';
import { School } from '@/lib/types';
import SchoolList from '@/components/SchoolList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage, LanguageProvider } from '@/lib/i18n';

const SchoolMap = dynamic(() => import('@/components/SchoolMap'), {
  ssr: false,
  loading: () => <div style={{ height: '600px', background: 'var(--midnight-blue)' }} className="flex items-center justify-center text-cool-mist text-xs uppercase tracking-widest">Loading...</div>
});

import MapToggle from '@/components/MapToggle';

function DashboardContent() {
  const { t } = useLanguage();
  const [schools, setSchools] = useState<School[]>([]);
  const [showBasins, setShowBasins] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/schools');
      const data = await res.json();
      setSchools(data);
    }
    loadData();
  }, []);

  return (
    <main className="container min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-navy/90 border-b border-border z-50 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-xl">💧</span>
            <div className="text-xl font-extrabold uppercase tracking-tighter">
              Blue<span className="text-accent">Lifeline</span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <header className="mb-20 pt-16">
        <div className="text-accent text-xs font-bold tracking-[0.25em] uppercase mb-6 flex items-center gap-4">
          <span className="h-[1px] w-8 bg-accent"></span>
          {t('footerTagline')}
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-8 max-w-4xl">
          {t('title').split('|')[1].trim()}<br />
          <span className="text-accent">{t('title').split('|')[0].trim()}</span>
        </h1>
        <p className="text-cool-mist text-lg md:text-xl max-w-3xl leading-relaxed">
          {t('description')}
        </p>
      </header>

      <section className="mb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-accent text-xs font-bold tracking-[0.25em] uppercase mb-3">{t('geographicDistribution')}</div>
            <h2 className="text-4xl font-extrabold uppercase tracking-tight">{t('schoolsMap')}</h2>
          </div>
          <MapToggle
            active={showBasins}
            onToggle={setShowBasins}
            label={t('es') === 'Mapa' ? 'Mostrar Cuencas' : 'Show Basins'}
          />
        </div>
        <SchoolMap schools={schools} showBasins={showBasins} />
      </section>

      <section>
        <SchoolList schools={schools} />
      </section>

      <footer className="mt-40 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-cool-mist uppercase tracking-[0.2em] pb-20">
        <div>&copy; 2026 Blue Lifeline — {t('footerTagline')}</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-accent transition-colors">Documentation</a>
          <a href="#" className="hover:text-accent transition-colors">Privacy</a>
          <a href="#" className="hover:text-accent transition-colors">Vercel candidate</a>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
}
