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
                schoolName: school.name,
                vwb: school.vwb
            });
        });

        // Sort by date and calculate increments
        const result: any[] = [];
        const basinAggregates: Record<string, { totalVwb: number, riskAdjusted: number, avgConfidence: number, count: number }> = {};

        Object.entries(dataByBasin).forEach(([basin, visits]) => {
            visits.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            let cumulative = 0;
            let lastReading = 0;

            if (!basinAggregates[basin]) {
                basinAggregates[basin] = { totalVwb: 0, riskAdjusted: 0, avgConfidence: 0, count: 0 };
            }

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

                if (visit.vwb) {
                    basinAggregates[basin].totalVwb += visit.vwb.totalBenefitM3;
                    basinAggregates[basin].riskAdjusted += visit.vwb.riskAdjustedValue;
                    basinAggregates[basin].avgConfidence += visit.vwb.confidenceScore;
                    basinAggregates[basin].count++;
                }

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

        const chartData = Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
            chartData,
            basinAggregates: Object.entries(basinAggregates).map(([basin, data]) => ({
                basin,
                totalVwb: data.totalVwb,
                riskAdjusted: data.riskAdjusted,
                confidence: data.count > 0 ? data.avgConfidence / data.count : 0
            }))
        };
    }, [schools, basinData, t]);

    const { chartData, basinAggregates } = aggregation;

    const maxInc = Math.max(...chartData.map(d => d.incremental), 1);
    const maxCum = Math.max(...chartData.map(d => d.cumulative), 1);

    return (
        <div className="space-y-16 mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Incremental Chart */}
                <div className="card-premium relative animate-in">
                    <div className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-6 opacity-80">{t('incrementalUsage')}</div>
                    <div className="h-64 flex items-end gap-1.5 px-2 border-b-2 border-l-2 border-white/5 pb-2">
                        {chartData.map((d, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-core-blue/30 hover:bg-accent transition-all duration-300 rounded-t-sm relative group animate-in"
                                style={{ height: `${(d.incremental / maxInc) * 100}%`, animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 glass-panel text-[10px] font-bold p-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 whitespace-nowrap border border-accent/20">
                                    <div className="text-accent mb-1">{d.date}</div>
                                    <div className="text-ice-white font-black">{d.incremental.toFixed(1)} m³</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cumulative Chart */}
                <div className="card-premium relative animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-6 opacity-80">{t('cumulativeUsage')}</div>
                    <div className="h-64 relative border-b-2 border-l-2 border-white/5 pb-2">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d={`M 0,100 ${chartData.map((d, i) => {
                                    const x = (i / (chartData.length - 1)) * 100;
                                    const y = 100 - (d.cumulative / maxCum) * 100;
                                    return `L ${x},${y}`;
                                }).join(' ')} L 100,100 Z`}
                                fill="url(#chartGradient)"
                            />
                            <polyline
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={chartData.map((d, i) => {
                                    const x = (i / (chartData.length - 1)) * 100;
                                    const y = 100 - (d.cumulative / maxCum) * 100;
                                    return `${x}%,${y}%`;
                                }).join(' ')}
                                style={{ vectorEffect: 'non-scaling-stroke', filter: 'drop-shadow(0 0 8px rgba(0,176,255,0.4))' }}
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Usage Table */}
            <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4 opacity-80">{t('basinAggregation')}</div>
                <div className="overflow-hidden glass-panel shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-white/5 text-cool-mist uppercase tracking-[0.2em] border-b border-white/10 font-black">
                                    <th className="px-8 py-5">Basin ID</th>
                                    <th className="px-8 py-5">Timestamp</th>
                                    <th className="px-8 py-5 text-right">Delta (m³)</th>
                                    <th className="px-8 py-5 text-right">Running Total (m³)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {chartData.slice().reverse().map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-5 font-black text-accent">{row.basin}</td>
                                        <td className="px-8 py-5 text-cool-mist font-medium">{row.date}</td>
                                        <td className="px-8 py-5 font-black text-right text-lg">+{row.incremental.toFixed(2)}</td>
                                        <td className="px-8 py-5 font-black text-right text-lg text-core-blue glow-text">{row.cumulative.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* VWB Basin Report */}
            <div className="space-y-8 animate-in" style={{ animationDelay: '0.6s' }}>
                <div className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase opacity-80">{t('corporateOffsetCapacity')}</div>
                <div className="grid grid-cols-1 gap-4">
                    {basinAggregates.map((row, i) => (
                        <div key={i} className="card-premium !py-6 flex flex-col md:flex-row items-center gap-8 group">
                            <div className="flex-1">
                                <div className="text-[9px] font-bold text-cool-mist uppercase tracking-[0.2em] mb-1">{t('basin')}</div>
                                <div className="text-2xl font-black uppercase tracking-tight group-hover:text-accent transition-colors">{row.basin}</div>
                            </div>
                            
                            <div className="w-full md:w-auto flex gap-12 text-center md:text-left">
                                <div>
                                    <div className="text-[9px] font-bold text-cool-mist uppercase tracking-[0.2em] mb-1">Total Benefit</div>
                                    <div className="text-xl font-black text-ice-white">{row.totalVwb.toFixed(1)} <span className="text-[10px] font-normal opacity-50 uppercase tracking-tighter">m³</span></div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-bold text-cool-mist uppercase tracking-[0.2em] mb-1">CSR Value</div>
                                    <div className="text-xl font-black text-green-400">$ {(row.riskAdjusted / 10).toFixed(2)}K</div>
                                </div>
                                <div className="min-w-[120px]">
                                    <div className="text-[9px] font-bold text-cool-mist uppercase tracking-[0.2em] mb-1">Audit Score</div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-navy rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-accent glow-text" 
                                                style={{ width: `${row.confidence * 100}%`, boxShadow: '0 0 10px var(--accent)' }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] font-black font-mono">{(row.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Assumption Warning */}
            <div className="glass-panel p-6 border-amber-500/10 animate-in" style={{ animationDelay: '0.8s' }}>
                <div className="flex gap-4">
                    <span className="text-amber-500">⚠️</span>
                    <p className="text-[11px] text-amber-200/50 leading-relaxed italic font-medium uppercase tracking-wider">
                        {t('assumptionsNote')}
                    </p>
                </div>
            </div>
        </div>
    );
}
