'use client';

import { useState } from 'react';
import { School } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import SchoolDetailModal from './SchoolDetailModal';

interface SchoolListProps {
    schools: School[];
}

export default function SchoolList({ schools }: SchoolListProps) {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.municipality.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-12 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <div className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-3 opacity-80">03 — {t('allInstallations')}</div>
                    <h3 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight gradient-text">{t('allInstallations')}</h3>
                </div>
                <div className="relative w-full md:max-w-md">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="bg-midnight-blue/40 border border-border p-4 px-6 text-ice-white focus:outline-none focus:border-accent w-full font-sans text-sm glass-panel backdrop-blur-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-accent opacity-50">🔍</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredSchools.map((school, index) => (
                    <div
                        key={school.id}
                        className="card-premium animate-in flex flex-col"
                        style={{ animationDelay: `${0.05 * (index % 12)}s` }}
                    >
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-accent text-[9px] font-bold tracking-[0.3em] uppercase bg-accent/5 px-2 py-1 border border-accent/10">
                                    {school.project || 'Project'}
                                </div>
                                {school.riskScore !== undefined && (
                                    <div className={`px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-widest border ${school.riskLevel === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        school.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                            'bg-green-500/10 text-green-400 border-green-500/20'
                                        }`}>
                                        {school.riskLevel}
                                    </div>
                                )}
                            </div>

                            <h3 className="text-2xl font-bold mb-2 leading-tight glow-text">{school.name}</h3>
                            <p className="text-cool-mist text-[10px] mb-6 uppercase tracking-widest opacity-60">
                                {school.municipality}, {school.state}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {!school.hasCoordinates && !school.userLat && (
                                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-red-900/10 border border-red-500/20 text-red-400/80 rounded-sm">
                                        <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
                                        <span className="text-[8px] font-bold uppercase tracking-widest">{t('needsCoordinates')}</span>
                                    </div>
                                )}
                                {(school.userLat || school.userLng) && (
                                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-accent/10 border border-accent/20 text-accent/80 rounded-sm">
                                        <span className="w-1 h-1 bg-accent rounded-full"></span>
                                        <span className="text-[8px] font-bold uppercase tracking-widest">{t('userUpdated')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-6 p-5 bg-navy/40 border border-border/40 mb-8 mt-auto group">
                                <div className="flex-1">
                                    <p className="text-[9px] text-cool-mist uppercase tracking-[0.2em] mb-1 opacity-50">{t('meterReadingLabel')}</p>
                                    <p className="text-3xl font-extrabold text-ice-white tracking-tighter group-hover:text-accent transition-colors duration-300">
                                        {school.meterReading} 
                                        <span className="text-sm font-normal text-cool-mist ml-1">m³</span>
                                    </p>
                                </div>
                                {school.meterPhotoUrl && (
                                    <div className="relative w-16 h-16 border border-border/30 overflow-hidden mix-blend-screen opacity-70 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-500">
                                        <img
                                            src={school.meterPhotoUrl}
                                            alt="Meter"
                                            className="object-cover w-full h-full scale-110 group-hover:scale-100 transition-transform duration-700"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedSchool(school)}
                            className="w-full bg-transparent border border-accent/30 text-accent text-[9px] font-bold tracking-[0.3em] uppercase py-4 hover:bg-accent hover:text-navy hover:border-accent transition-all duration-500"
                        >
                            {t('viewDetails')}
                        </button>
                    </div>
                ))}
            </div>

            {filteredSchools.length === 0 && (
                <div className="text-center py-32 text-cool-mist uppercase tracking-[0.3em] text-[10px] glass-panel">
                    {t('noSchoolsFound')}
                </div>
            )}

            {selectedSchool && (
                <SchoolDetailModal
                    school={selectedSchool}
                    onClose={() => setSelectedSchool(null)}
                />
            )}
        </div>
    );
}
