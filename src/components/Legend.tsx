'use client';

import { useLanguage } from '@/lib/i18n';

export default function Legend() {
    const { t } = useLanguage();

    const riskClasses = [
        { level: 0, color: '#ffff00', label: 'Low' },
        { level: 1, color: '#ffe600', label: 'Low-Medium' },
        { level: 2, color: '#ff9900', label: 'Medium-High' },
        { level: 3, color: '#ff1900', label: 'High' },
        { level: 4, color: '#990000', label: 'Extremely High' },
    ];

    return (
        <div className="glass-panel p-6 shadow-2xl space-y-6">
            <div>
                <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-4 opacity-80">{t('aqueductRiskClass')}</h4>
                <div className="flex items-center gap-1.5">
                    {riskClasses.map((item) => (
                        <div key={item.level} className="group relative flex-1">
                            <div
                                className="h-2.5 w-full rounded-sm transition-transform duration-300 group-hover:scale-y-150"
                                style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}44` }}
                            />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-dark-navy text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-accent/20 z-50">
                                {t(`risk${item.label.replace('-', '')}`)} ({item.level})
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-3 text-[9px] text-cool-mist font-bold uppercase tracking-widest opacity-60">
                    <span>{t('low')}</span>
                    <span>{t('extreme')}</span>
                </div>
            </div>

            <div className="pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-5 opacity-80">{t('mapMarkers')}</h4>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 group">
                        <div className="w-2.5 h-2.5 rounded-full bg-core-blue border border-white/30 shadow-[0_0_8px_rgba(33,150,243,0.5)] group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cool-mist group-hover:text-ice-white transition-colors">{t('schoolMonitoringPoint')}</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#4285F4] border border-white/30 shadow-[0_0_8px_rgba(66,133,244,0.5)] group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cool-mist group-hover:text-ice-white transition-colors">Google Data Center</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF9900] border border-white/30 shadow-[0_0_8px_rgba(255,153,0,0.5)] group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cool-mist group-hover:text-ice-white transition-colors">AWS Data Center</span>
                    </div>
                    <div className="flex items-center gap-3 group">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] border border-white/30 shadow-[0_0_8px_rgba(0,164,239,0.5)] group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cool-mist group-hover:text-ice-white transition-colors">Microsoft Data Center</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
