'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';

export default function InterconnectionCard() {
    const { t } = useLanguage();
    const [data, setData] = useState<Record<string, any>>({});

    useEffect(() => {
        fetch('/data/hydrologic_interconnection.json')
            .then(res => res.json())
            .then(d => setData(d))
            .catch(err => console.error(err));
    }, []);

    const basins = Object.entries(data);

    if (basins.length === 0) return null;

    return (
        <div className="bg-midnight-blue/40 backdrop-blur-md rounded-xl p-4 border border-border/20 shadow-2xl">
            <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-4">{t('hydrologicInterconnection')}</h4>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {basins.map(([id, info]: [string, any]) => (
                    <div key={id} className="space-y-2 border-b border-border/10 pb-4 last:border-0">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-core-blue">{t('basin')} {id}</span>
                            <div className="flex gap-1">
                                {info.shared_aquifer_risk && (
                                    <span className="bg-red-500/10 text-red-400 text-[8px] px-1.5 py-0.5 rounded border border-red-500/20">{t('aquiferRisk')}</span>
                                )}
                                {info.transfer_system_dependent && (
                                    <span className="bg-amber-500/10 text-amber-400 text-[8px] px-1.5 py-0.5 rounded border border-amber-500/20">{t('transferDep')}</span>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-cool-mist leading-relaxed italic">
                            {info.summary}
                        </p>
                        <div className="space-y-1">
                            {info.sources.map((s: any, i: number) => (
                                <a
                                    key={i}
                                    href={s.url}
                                    target="_blank"
                                    className="block text-[9px] text-accent hover:underline flex items-center gap-1"
                                >
                                    <span>🔗</span> {s.title} ({s.type})
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
