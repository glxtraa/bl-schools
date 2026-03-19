'use client';

import { School } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

interface SchoolDetailModalProps {
    school: School;
    onClose: () => void;
}

export default function SchoolDetailModal({ school, onClose }: SchoolDetailModalProps) {
    const { t } = useLanguage();

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const images = [
        { url: school.meterPhotoUrl, label: t('meterPhoto') },
        { url: school.receiptPhotoUrl, label: t('receiptPhoto') },
        { url: school.visitPhotoUrl, label: t('visitPhoto') },
        { url: school.nectarPhotoUrl, label: t('nectarPhoto') },
    ].filter(img => img.url);

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-navy/80 backdrop-blur-xl p-4 animate-in"
            onClick={handleBackdropClick}
        >
            <div className="glass-panel w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border-white/5">
                <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-navy/40 backdrop-blur-2xl z-20">
                    <div>
                        <div className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase mb-2 opacity-80">{school.project}</div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight gradient-text">{school.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-accent hover:text-navy transition-all duration-300 text-xl font-light"
                    >
                        ×
                    </button>
                </div>

                <div className="p-10 space-y-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left Column: Core Info */}
                        <div className="space-y-12">
                            <section>
                                <h3 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                                    <span className="w-8 h-[1px] bg-accent/30"></span>
                                    {t('schoolDetails')}
                                </h3>
                                <div className="space-y-8">
                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-3">
                                        {!school.hasCoordinates && !school.userLat && (
                                            <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center gap-3">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-red-400">{t('needsCoordinates')}</span>
                                            </div>
                                        )}
                                        {(school.userLat || school.userLng) && (
                                            <div className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-sm flex items-center gap-3">
                                                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-accent">{t('userUpdated')}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="card-premium !p-6 !bg-white/5">
                                            <span className="text-cool-mist uppercase block text-[9px] tracking-[0.2em] mb-2 opacity-60">{t('address')}</span>
                                            <p className="text-sm font-medium leading-relaxed">{school.address}, {school.neighborhood}</p>
                                            <p className="text-xs text-cool-mist mt-2">{school.municipality}, {school.state}</p>
                                        </div>
                                        <div className="card-premium !p-6 !bg-white/5 flex flex-col justify-center">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-center flex-1">
                                                    <span className="text-cool-mist uppercase block text-[9px] tracking-[0.2em] mb-1 opacity-60">{t('students')}</span>
                                                    <p className="text-2xl font-black text-ice-white">{school.studentsTotal}</p>
                                                </div>
                                                <div className="w-[1px] h-8 bg-white/10"></div>
                                                <div className="text-center flex-1">
                                                    <span className="text-cool-mist uppercase block text-[9px] tracking-[0.2em] mb-1 opacity-60">{t('staff')}</span>
                                                    <p className="text-2xl font-black text-ice-white">{school.staffTotal}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coordinate form refined */}
                                    <div className="bg-navy/40 p-6 border border-white/5 rounded-sm">
                                        <h4 className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mb-4">{t('updateCoords')}</h4>
                                        <form
                                            className="flex flex-col md:flex-row gap-3"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const formData = new FormData(e.currentTarget);
                                                const lat = formData.get('lat');
                                                const lng = formData.get('lng');
                                                if (lat && lng) {
                                                    const updates = JSON.parse(localStorage.getItem('school_coord_updates') || '{}');
                                                    updates[school.id] = { lat: parseFloat(lat as string), lng: parseFloat(lng as string) };
                                                    localStorage.setItem('school_coord_updates', JSON.stringify(updates));
                                                    window.location.reload();
                                                }
                                            }}
                                        >
                                            <input
                                                name="lat"
                                                type="number"
                                                step="any"
                                                placeholder="LATITUDE"
                                                defaultValue={school.userLat || (school.hasCoordinates ? school.latitude : '')}
                                                className="bg-navy/60 border border-white/10 p-3 text-[10px] text-ice-white focus:border-accent outline-none flex-1 font-mono tracking-widest"
                                            />
                                            <input
                                                name="lng"
                                                type="number"
                                                step="any"
                                                placeholder="LONGITUDE"
                                                defaultValue={school.userLng || (school.hasCoordinates ? school.longitude : '')}
                                                className="bg-navy/60 border border-white/10 p-3 text-[10px] text-ice-white focus:border-accent outline-none flex-1 font-mono tracking-widest"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-accent text-navy text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 hover:brightness-110 transition-all"
                                            >
                                                {t('save')}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </section>

                            {school.rainStats && (
                                <section className="animate-in" style={{ animationDelay: '0.2s' }}>
                                    <h3 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                                        <span className="w-8 h-[1px] bg-accent/30"></span>
                                        {t('rainfallHistory')}
                                    </h3>
                                    <div className="card-premium !bg-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4">
                                            {school.rainStats.isVerified ? (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                                                    <span className="text-[8px] font-bold uppercase tracking-widest">{t('verifiedByBlockchain')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                                                    <span className="text-[8px] font-bold uppercase tracking-widest">{t('integrityFailure')}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-end gap-6 pt-4">
                                            <div>
                                                <span className="text-cool-mist uppercase block text-[10px] tracking-[0.2em] mb-2 opacity-60">{t('totalRainfall')}</span>
                                                <p className="text-5xl font-black text-ice-white tracking-tighter group-hover:text-accent transition-colors duration-500">
                                                    {school.rainStats.totalMillimeters.toFixed(1)}
                                                    <span className="text-xl font-normal text-cool-mist ml-2 uppercase">mm</span>
                                                </p>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-cool-mist uppercase block text-[8px] tracking-[0.2em] mb-1 opacity-40">{t('lastUpdated')}</span>
                                                <p className="text-[10px] text-ice-white font-mono opacity-80">{school.rainStats.lastCatch}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Infrastructure & Risk */}
                        <div className="space-y-12">
                            <section>
                                <h3 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                                    <span className="w-8 h-[1px] bg-accent/30"></span>
                                    Infrastructure
                                </h3>
                                <div className="card-premium bg-navy/20 space-y-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <span className="text-cool-mist uppercase block text-[9px] tracking-[0.2em] mb-2 opacity-60">Cistern</span>
                                            <p className="text-2xl font-black">{school.infrastructure.cisternLiters.toLocaleString()} <span className="text-xs font-normal opacity-40 uppercase">L</span></p>
                                        </div>
                                        <div>
                                            <span className="text-cool-mist uppercase block text-[9px] tracking-[0.2em] mb-2 opacity-60">Tinaco</span>
                                            <p className="text-2xl font-black">{school.infrastructure.tinacoLiters.toLocaleString()} <span className="text-xs font-normal opacity-40 uppercase">L</span></p>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                        <div>
                                            <span className="text-accent uppercase block text-[10px] font-bold tracking-[0.3em] mb-2">Total Capacity</span>
                                            <p className="text-5xl font-black text-accent glow-text tracking-tighter">{school.infrastructure.totalLiters.toLocaleString()} <span className="text-xl font-normal opacity-50">L</span></p>
                                        </div>
                                    </div>
                                    {school.notes && (
                                        <div className="mt-6 p-4 bg-white/5 border-l-2 border-accent/20 italic text-xs text-cool-mist leading-relaxed opacity-70">
                                            "{school.notes}"
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className="animate-in" style={{ animationDelay: '0.4s' }}>
                                <h3 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                                    <span className="w-8 h-[1px] bg-accent/30"></span>
                                    Environmental Risk
                                </h3>
                                <div className="card-premium !bg-white/5 space-y-8">
                                    <div className="flex items-center gap-8">
                                        <div className="relative">
                                            <svg className="w-24 h-24 transform -rotate-90">
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                <circle 
                                                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                                    strokeDasharray={251.2} 
                                                    strokeDashoffset={251.2 - (251.2 * (school.riskScore || 0)) / 100}
                                                    className={school.riskLevel === 'high' ? 'text-red-500' : school.riskLevel === 'medium' ? 'text-orange-500' : 'text-green-500'}
                                                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-2xl font-black">{school.riskScore}</span>
                                                <span className="text-[8px] opacity-40 uppercase tracking-tighter">/ 100</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className={`px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] mb-2 inline-block ${
                                                school.riskLevel === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                school.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                'bg-green-500/10 text-green-400 border border-green-500/20'
                                            }`}>
                                                {school.riskLevel} Risk Profile
                                            </div>
                                            <p className="text-[10px] text-cool-mist uppercase tracking-widest leading-relaxed">
                                                Based on Aqueduct 4.0 <br />Hydrologic Variability Analysis
                                            </p>
                                        </div>
                                    </div>

                                    {school.riskReasons && school.riskReasons.length > 0 && (
                                        <div className="space-y-3 pt-6 border-t border-white/5">
                                            {school.riskReasons.map((reason, i) => (
                                                <div key={i} className="flex items-start gap-4 text-[10px] text-cool-mist uppercase tracking-wider group">
                                                    <span className="text-accent group-hover:scale-150 transition-transform mt-1">◽</span>
                                                    <span className="opacity-80 group-hover:opacity-100 transition-opacity">{reason}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* VWB Auditor View - Full Width */}
                        <div className="lg:col-span-2 card-premium !bg-accent/5 !border-accent/20 p-10 relative overflow-hidden animate-in" style={{ animationDelay: '0.6s' }}>
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <span className="text-9xl font-black">AUDIT</span>
                            </div>
                            
                            <h3 className="text-accent text-[11px] font-black tracking-[0.4em] uppercase mb-10 flex items-center gap-6">
                                {t('volumetricBenefit')} — Verified Auditor Report
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                                <div className="space-y-8">
                                    <div>
                                        <span className="text-cool-mist uppercase block text-[9px] tracking-[0.3em] mb-2 opacity-60">Verified Benefit</span>
                                        <p className="text-4xl font-black text-ice-white tracking-tighter">{school.vwb?.totalBenefitM3.toFixed(1)} <span className="text-sm font-normal opacity-50 ml-1">m³</span></p>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="h-1 flex-1 bg-accent/20"></div>
                                        <div className="h-1 flex-1 bg-accent/20"></div>
                                        <div className="h-1 flex-1 bg-accent/20 opacity-30"></div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-2 gap-12 p-8 bg-navy/40 border border-white/5">
                                    <div>
                                        <span className="text-accent uppercase block text-[9px] font-black tracking-[0.2em] mb-3">CSR Value Asset</span>
                                        <p className="text-4xl font-black text-green-400 glow-text">$ {(school.vwb?.riskAdjustedValue || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                                            <span className="text-cool-mist">Corporate Mult:</span>
                                            <span className="text-accent">x{(school.vwb?.riskAdjustedValue && school.vwb?.totalBenefitM3) ? (school.vwb.riskAdjustedValue / (school.vwb.totalBenefitM3 * 12.5)).toFixed(1) : '1.0'}</span>
                                        </div>
                                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                            <span className="text-cool-mist">Audit Grade:</span>
                                            <span className="text-ice-white">ISO 14046</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div>
                                        <span className="text-cool-mist uppercase block text-[9px] tracking-[0.3em] mb-4 opacity-60">Confidence</span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl font-black font-mono tracking-tighter">{((school.vwb?.confidenceScore || 0) * 100).toFixed(0)}%</span>
                                            <div className="flex-1 h-3 bg-navy rounded-full overflow-hidden border border-white/5">
                                                <div 
                                                    className="h-full bg-accent relative" 
                                                    style={{ width: `${(school.vwb?.confidenceScore || 0) * 100}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full bg-accent text-navy text-[10px] font-black uppercase tracking-[0.2em] py-4 hover:brightness-110 transition-all flex items-center justify-center gap-3 mt-6">
                                        <span>Download Certificate</span>
                                        <span className="text-lg">📁</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <section className="animate-in" style={{ animationDelay: '0.8s' }}>
                        <h3 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-10 flex items-center gap-4 text-center justify-center">
                            <span className="w-12 h-[1px] bg-accent/30"></span>
                            {t('images')}
                            <span className="w-12 h-[1px] bg-accent/30"></span>
                        </h3>
                        {images.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {images.map((img, idx) => (
                                    <div key={idx} className="space-y-4 group">
                                        <div className="relative aspect-square glass-panel overflow-hidden border-white/5">
                                            <img
                                                src={img.url}
                                                alt={img.label}
                                                className="object-cover w-full h-full grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 transition-all duration-700 opacity-60 group-hover:opacity-100"
                                            />
                                            <div className="absolute inset-0 border-[10px] border-navy opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cool-mist text-center group-hover:text-accent transition-colors">{img.label}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-cool-mist text-[10px] uppercase font-black tracking-[0.3em] glass-panel border-dashed">
                                No verified imagery available for this site.
                            </div>
                        )}
                    </section>
                </div>
                
                <footer className="p-10 border-t border-white/5 bg-navy/20 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] font-bold text-cool-mist uppercase tracking-[0.2em] opacity-40">
                         Blue Lifeline — school monitoring system — v2.1.0-redesign
                    </div>
                </footer>
            </div>
        </div>
    );
}
