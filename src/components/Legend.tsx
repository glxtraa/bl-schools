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
        <div className="bg-midnight-blue/40 backdrop-blur-md rounded-xl p-4 border border-border/20 shadow-2xl space-y-4">
            <div>
                <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">{t('aqueductRiskClass')}</h4>
                <div className="flex items-center gap-1">
                    {riskClasses.map((item) => (
                        <div key={item.level} className="group relative flex-1">
                            <div
                                className="h-2 w-full rounded-sm"
                                style={{ backgroundColor: item.color }}
                            />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-navy text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border/20">
                                {t(`risk${item.label.replace('-', '')}`)} ({item.level})
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-1 text-[8px] text-cool-mist font-medium">
                    <span>{t('low')}</span>
                    <span>{t('extreme')}</span>
                </div>
            </div>

            <div>
                <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">{t('mapMarkers')}</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-core-blue border border-white" />
                        <span className="text-[10px] text-cool-mist">{t('schoolMonitoringPoint')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#4285F4] border border-white" />
                        <span className="text-[10px] text-cool-mist">Google Data Center</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF9900] border border-white" />
                        <span className="text-[10px] text-cool-mist">AWS Data Center</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] border border-white" />
                        <span className="text-[10px] text-cool-mist">Microsoft Data Center</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
