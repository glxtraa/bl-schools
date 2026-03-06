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
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-2xl font-bold uppercase tracking-tight">{t('allInstallations')}</h3>
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="bg-dark-navy border border-border p-3 px-6 text-ice-white focus:outline-none focus:border-accent w-full md:max-w-md font-sans text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSchools.map((school) => (
                    <div
                        key={school.id}
                        className="school-card"
                    >
                        <div className="flex-1">
                            <div className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                                {school.project || 'Project'}
                            </div>
                            <h3 className="text-xl font-bold mb-3 leading-tight">{school.name}</h3>
                            {!school.hasCoordinates && !school.userLat && (
                                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-500/30 text-red-400 rounded-sm">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider">{t('needsCoordinates')}</span>
                                </div>
                            )}
                            {(school.userLat || school.userLng) && (
                                <div className="mb-4 flex flex-col gap-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/30 text-accent rounded-sm w-fit">
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider">{t('userUpdated')}</span>
                                    </div>
                                    <div className="px-3 py-1 bg-midnight-blue border border-border text-cool-mist text-[8px] font-bold uppercase tracking-widest w-fit">
                                        {t('adminVerification')}
                                    </div>
                                </div>
                            )}
                            <p className="text-cool-mist text-xs mb-4 uppercase tracking-wider">
                                {school.municipality}, {school.state}
                            </p>

                            {school.riskScore !== undefined && (
                                <div className={`mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${school.riskLevel === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        school.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                            'bg-green-500/10 text-green-400 border border-green-500/20'
                                    }`}>
                                    Risk: {school.riskLevel} (${school.riskScore}/100)
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex-1">
                                    <p className="text-[10px] text-cool-mist uppercase tracking-[0.15em] mb-1">{t('meterReadingLabel')}</p>
                                    <p className="text-2xl font-extrabold text-ice-white">{school.meterReading} <span className="text-xs font-normal text-cool-mist">m³</span></p>
                                </div>
                                {school.meterPhotoUrl && (
                                    <div className="relative w-20 h-20 border border-border overflow-hidden">
                                        <img
                                            src={school.meterPhotoUrl}
                                            alt="Meter"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedSchool(school)}
                            className="btn-outline w-full text-xs font-bold tracking-widest hover:bg-ice-white hover:text-navy transition-colors py-3"
                        >
                            {t('viewDetails')}
                        </button>
                    </div>
                ))}
            </div>

            {filteredSchools.length === 0 && (
                <div className="text-center py-20 text-cool-mist uppercase tracking-widest text-xs">
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
