'use client';

import { useMemo } from 'react';
import { School } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

interface AggregatedMetricsProps {
    schools: School[];
    basinData: any;
}

export default function AggregatedMetrics({ schools, basinData }: AggregatedMetricsProps) {
    const { t } = useLanguage();

    const aggregation = useMemo(() => {
        const basinMap: Record<string, string> = {};
        if (basinData && basinData.features) {
            basinData.features.forEach((f: any) => {
                const hybasId = f.properties.HYBAS_ID.toString();
                const schoolIds = f.properties.schools.split(', ');
                schoolIds.forEach((name: string) => {
                    basinMap[name] = hybasId;
                });
            });
        }

        const dataByBasin: Record<string, any[]> = {};

        schools.forEach(school => {
            const basin = basinMap[school.name] || t('unidentifiedBasin');
            if (!dataByBasin[basin]) dataByBasin[basin] = [];

            dataByBasin[basin].push({
                date: school.lastUpdated,
                reading: parseFloat(school.meterReading) || 0,
                schoolName: school.name
            });
        });

        // Sort by date and calculate increments
        const result: any[] = [];
        Object.entries(dataByBasin).forEach(([basin, visits]) => {
            visits.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            let cumulative = 0;
            let lastReading = 0;

            visits.forEach((visit, i) => {
                let increment = 0;
                if (i === 0) {
                    increment = visit.reading;
                } else {
                    increment = visit.reading - lastReading;
                    if (increment < 0) increment = visit.reading; // Fallback for resets
                }

                cumulative += increment;
                lastReading = visit.reading;

                result.push({
                    basin,
                    date: visit.date,
                    incremental: increment,
                    cumulative: cumulative,
                });
            });
        });

        // Group by date for the chart
        const dailyData: Record<string, any> = {};
        result.forEach(r => {
            if (!dailyData[r.date]) dailyData[r.date] = { date: r.date, incremental: 0, cumulative: 0 };
            dailyData[r.date].incremental += r.incremental;
            dailyData[r.date].cumulative += r.cumulative;
        });

        return Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [schools, basinData, t]);

    const maxInc = Math.max(...aggregation.map(d => d.incremental), 1);
    const maxCum = Math.max(...aggregation.map(d => d.cumulative), 1);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Incremental Chart */}
                <div className="bg-midnight-blue/40 p-6 rounded-2xl border border-border/20 shadow-xl">
                    <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-6">{t('incrementalUsage')}</h3>
                    <div className="h-48 flex items-end gap-1 px-2 border-b border-l border-border/10">
                        {aggregation.map((d, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-core-blue/60 hover:bg-core-blue transition-colors rounded-t-sm relative group"
                                style={{ height: `${(d.incremental / maxInc) * 100}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-navy text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap border border-border/20">
                                    {d.date}: {d.incremental.toFixed(1)} m³
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cumulative Chart */}
                <div className="bg-midnight-blue/40 p-6 rounded-2xl border border-border/20 shadow-xl">
                    <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-6">{t('cumulativeUsage')}</h3>
                    <div className="h-48 relative border-b border-l border-border/10">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <polyline
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="2"
                                points={aggregation.map((d, i) => {
                                    const x = (i / (aggregation.length - 1)) * 100;
                                    const y = 100 - (d.cumulative / maxCum) * 100;
                                    return `${x}%,${y}%`;
                                }).join(' ')}
                                style={{ vectorEffect: 'non-scaling-stroke' }}
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-2xl border border-border/20 shadow-xl bg-midnight-blue/20">
                <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                        <tr className="bg-navy/50 text-cool-mist uppercase tracking-widest border-b border-border/20">
                            <th className="px-6 py-4 font-bold">{t('basinAggregation')}</th>
                            <th className="px-6 py-4 font-bold">{t('lastUpdated')}</th>
                            <th className="px-6 py-4 font-bold">{t('incrementalUsage')}</th>
                            <th className="px-6 py-4 font-bold">{t('cumulativeUsage')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                        {aggregation.slice().reverse().map((row, i) => (
                            <tr key={i} className="hover:bg-accent/5 transition-colors group">
                                <td className="px-6 py-4 font-bold text-accent">{row.basin}</td>
                                <td className="px-6 py-4 text-cool-mist">{row.date}</td>
                                <td className="px-6 py-4 font-black">{row.incremental.toFixed(2)} m³</td>
                                <td className="px-6 py-4 font-black text-core-blue">{row.cumulative.toFixed(2)} m³</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assumption Warning */}
            <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 text-[10px] text-amber-200/60 leading-relaxed italic">
                * {t('assumptionsNote') || 'Aggregation based on school visit history. Incremental usage calculated as the difference between consecutive readings. For the first recorded visit of a meter, the reading is treated as initial usage. Resets are detected and handled as new initial readings.'}
            </div>
        </div>
    );
}
