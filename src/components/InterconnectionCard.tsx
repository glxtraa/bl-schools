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
        <div className="glass-panel p-6 shadow-2xl">
            <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-6 opacity-80">{t('hydrologicInterconnection')}</h4>

            <div className="space-y-6 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                {basins.map(([id, info]: [string, any]) => (
                    <div key={id} className="space-y-3 border-b border-white/5 pb-6 last:border-0 last:pb-0 group">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-core-blue uppercase tracking-widest group-hover:text-accent transition-colors">
                                {t('basin')} <span className="text-sm">{id}</span>
                            </span>
                            <div className="flex gap-1.5">
                                {info.shared_aquifer_risk && (
                                    <span className="bg-red-500/10 text-red-400 text-[8px] px-2 py-0.5 rounded-sm border border-red-500/20 font-bold uppercase tracking-tighter">
                                        {t('aquiferRisk')}
                                    </span>
                                )}
                                {info.transfer_system_dependent && (
                                    <span className="bg-amber-500/10 text-amber-400 text-[8px] px-2 py-0.5 rounded-sm border border-amber-500/20 font-bold uppercase tracking-tighter">
                                        {t('transferDep')}
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-cool-mist leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity">
                            "{info.summary}"
                        </p>
                        <div className="space-y-1.5">
                            {info.sources.map((s: any, i: number) => (
                                <a
                                    key={i}
                                    href={s.url}
                                    target="_blank"
                                    className="block text-[9px] text-accent/70 hover:text-accent transition-colors flex items-center gap-2 group/link"
                                >
                                    <span className="opacity-50 group-hover/link:opacity-100">🔗</span> 
                                    <span className="uppercase tracking-wider truncate font-medium">{s.title}</span>
                                    <span className="text-[8px] opacity-40">({s.type})</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: var(--midnight-blue); 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--accent); }
            `}</style>
        </div>
    );
}
