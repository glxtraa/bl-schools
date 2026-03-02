import dynamic from 'next/dynamic';
import { getSchools } from '@/lib/data-parser';
import SchoolList from '@/components/SchoolList';

// Dynamically import the map to avoid SSR issues with Leaflet
const SchoolMap = dynamic(() => import('@/components/SchoolMap'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', background: 'var(--midnight-blue)' }} className="flex items-center justify-center text-cool-mist">Loading Map...</div>
});

export default async function Home() {
  const schools = await getSchools();

  return (
    <main className="container min-h-screen">
      <header className="mb-12">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl">💧</span>
          <h1 className="text-5xl font-extrabold uppercase tracking-tighter">
            Blue<span className="text-accent">Lifeline</span>
          </h1>
        </div>
        <p className="text-cool-mist text-lg max-w-2xl">
          Verified Water Benefit Tracking Dashboard. Direct monitoring of school water systems to ensure sustainability and accountability.
        </p>
      </header>

      <section className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-2">01 — Geographic Distribution</div>
            <h2 className="text-4xl font-extrabold">Schools Map</h2>
          </div>
        </div>
        <SchoolMap schools={schools} />
      </section>

      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-2">02 — Detailed Metrics</div>
            <h2 className="text-4xl font-extrabold">All Installations</h2>
          </div>
        </div>
        <SchoolList schools={schools} />
      </section>

      <footer className="mt-32 pt-8 border-t border-border flex justify-between items-center text-xs text-cool-mist uppercase tracking-widest pb-12">
        <div>&copy; 2026 Blue Lifeline — The Standard for Water Sustainability</div>
        <div>Vercel Deployment Candidate</div>
      </footer>
    </main>
  );
}
