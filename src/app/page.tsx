'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getSchools } from '@/lib/data-parser';
import { School } from '@/lib/types';
import SchoolList from '@/components/SchoolList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';
import { useLanguage, LanguageProvider } from '@/lib/i18n';

const SchoolMap = dynamic(() => import('@/components/SchoolMap'), {
  ssr: false,
  loading: () => <div style={{ height: '600px', background: 'var(--midnight-blue)' }} className="flex items-center justify-center text-cool-mist text-xs uppercase tracking-widest">Loading...</div>
});

import MapToggle from '@/components/MapToggle';
import Legend from '@/components/Legend';
import InterconnectionCard from '@/components/InterconnectionCard';
import AggregatedMetrics from '@/components/AggregatedMetrics';

import { analyzeRainDataFromIPFS } from '@/lib/rain-analyzer';

function DashboardContent() {
  const { t } = useLanguage();
  const [schools, setSchools] = useState<School[]>([]);
  const [showBasins, setShowBasins] = useState(false);
  const [showDatacenters, setShowDatacenters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'metrics'>('map');
  const [basinData, setBasinData] = useState<any>(null);

  useEffect(() => {
    // Fetch Basin Data for synchronization
    fetch('/data/hydrobasins_l6_schools.geojson')
      .then(res => res.json())
      .then(data => setBasinData(data))
      .catch(err => console.error('Basin data fetch error:', err));

    async function loadData() {
      try {
        const res = await fetch('/api/schools');
        let data: School[] = await res.json();

        // 1. Fetch IPFS Rain Data & Verify Integrity
        try {
          const registryRes = await fetch('/data/ipfs_registry.json');
          const registry = await registryRes.json();
          const dates = Object.keys(registry).sort().reverse();

          if (dates.length > 0) {
            const latestCid = registry[dates[0]];
            const rainStats = await analyzeRainDataFromIPFS(latestCid);

            data = data.map((s, idx) => {
              // Priority 1: Direct ID match
              let stats = rainStats[s.id];

              // Priority 2: Demo fallback (Link first school to a known sensor from our log)
              if (!stats && idx === 0) {
                stats = rainStats['eca340c2-42f4-46ad-ae3f-60bb3397d9b3'];
              }

              if (stats) return { ...s, rainStats: stats };
              return s;
            });
          }
        } catch (rainErr) {
          console.warn('Rain data not available or verification failed:', rainErr);
        }

        // 2. Simulate persistence for demo
        if (typeof window !== 'undefined') {
          const updates = JSON.parse(localStorage.getItem('school_coord_updates') || '{}');
          data = data.map(s => {
            if (updates[s.id]) {
              return {
                ...s,
                userLat: updates[s.id].lat,
                userLng: updates[s.id].lng,
                needsVerification: true
              };
            }
            return s;
          });
        }

        setSchools(data);
      } catch (err) {
        console.error('Failed to load schools:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="container min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-navy/80 border-b border-white/5 z-50 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(0,176,255,0.5)]">💧</span>
            <div className="text-2xl font-black uppercase tracking-tighter leading-none">
              Blue<span className="text-accent group-hover:glow-text transition-all duration-300">Lifeline</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-cool-mist">
              <Link href="/documentation" className="hover:text-accent transition-colors">Documentation</Link>
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
            </nav>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <header className="mb-32 pt-40 relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="text-accent text-[11px] font-bold tracking-[0.4em] uppercase mb-8 flex items-center gap-6 animate-in">
            <span className="h-[1px] w-12 bg-accent/30"></span>
            {t('footerTagline')}
            <span className="h-[1px] w-12 bg-accent/30"></span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.9] animate-in" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">{t('title').split('|')[1].trim()}</span><br />
            <span className="text-accent glow-text">{t('title').split('|')[0].trim()}</span>
          </h1>
          
          <p className="text-cool-mist text-lg md:text-xl max-w-2xl leading-relaxed opacity-80 animate-in" style={{ animationDelay: '0.2s' }}>
            {t('description')}
          </p>

          <div className="flex gap-12 mt-20 border-b border-white/5 w-full justify-center animate-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setActiveTab('map')}
              className={`pb-6 text-xs font-black uppercase tracking-[0.3em] transition-all relative group ${activeTab === 'map' ? 'text-accent' : 'text-cool-mist hover:text-white'
                }`}
            >
              <span className="relative z-10">{t('schoolsMap')}</span>
              {activeTab === 'map' && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-accent shadow-[0_0_15px_rgba(0,176,255,0.8)]"></div>
              )}
              <div className="absolute inset-0 bg-accent/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500"></div>
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`pb-6 text-xs font-black uppercase tracking-[0.3em] transition-all relative group ${activeTab === 'metrics' ? 'text-accent' : 'text-cool-mist hover:text-white'
                }`}
            >
              <span className="relative z-10">{t('detailedMetrics').split('—')[1].trim()}</span>
              {activeTab === 'metrics' && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-accent shadow-[0_0_15px_rgba(0,176,255,0.8)]"></div>
              )}
              <div className="absolute inset-0 bg-accent/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500"></div>
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'map' ? (
        <section className="mb-24 animate-in fade-in duration-700">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="text-accent text-xs font-bold tracking-[0.25em] uppercase mb-3">{t('geographicDistribution')}</div>
              <h2 className="text-4xl font-extrabold uppercase tracking-tight">{t('schoolsMap')}</h2>
            </div>
            <div className="flex gap-4">
              <MapToggle
                active={showDatacenters}
                onToggle={setShowDatacenters}
                label={t('showDatacenters')}
              />
              <MapToggle
                active={showBasins}
                onToggle={setShowBasins}
                label={t('showBasins')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <SchoolMap schools={schools} showBasins={showBasins} showDatacenters={showDatacenters} />
            </div>
            <div className="space-y-6">
              <Legend />
              <InterconnectionCard />
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-24 animate-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8">
            <div className="text-accent text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center">{t('detailedMetrics')}</div>
            <h2 className="text-4xl font-extrabold uppercase tracking-tight text-center">{t('basinAggregation')}</h2>
          </div>
          <AggregatedMetrics schools={schools} basinData={basinData} />
        </section>
      )}

      <section>
        <SchoolList schools={schools} />
      </section>

      <footer className="mt-40 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-cool-mist uppercase tracking-[0.2em] pb-20">
        <div>&copy; 2026 Blue Lifeline — {t('footerTagline')}</div>
        <div className="flex gap-8">
          <Link href="/documentation" className="hover:text-accent transition-colors">Documentation</Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          <Link href="/vercel-candidate" className="hover:text-accent transition-colors">Vercel candidate</Link>
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
