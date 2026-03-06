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
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-navy/80 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-dark-navy border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-dark-navy z-10">
                    <div>
                        <div className="text-accent text-xs font-bold tracking-widest uppercase mb-1">{school.project}</div>
                        <h2 className="text-2xl font-bold">{school.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-cool-mist hover:text-ice-white text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        <span>{t('close')}</span>
                        <span className="text-xl">×</span>
                    </button>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 className="text-accent text-xs font-bold tracking-widest uppercase mb-4 border-b border-border pb-2">
                                {t('schoolDetails')}
                            </h3>
                            <div className="space-y-4 text-sm">
                                {!school.hasCoordinates && !school.userLat && (
                                    <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-sm">
                                        <div className="flex items-center gap-2 mb-1 text-red-400">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider">{t('needsCoordinates')}</span>
                                        </div>
                                        <p className="text-[9px] text-cool-mist leading-relaxed uppercase tracking-[0.05em] mb-3">
                                            {t('coordConfidence')}
                                        </p>
                                        <a
                                            href={`https://www.google.com/maps/search/${encodeURIComponent(`${school.name} ${school.address} ${school.municipality} ${school.state}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-accent font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
                                        >
                                            <span>{t('googleMapsSearch')}</span>
                                            <span>↗</span>
                                        </a>
                                    </div>
                                )}

                                {(school.userLat || school.userLng) && (
                                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-sm">
                                        <div className="flex items-center gap-2 mb-1 text-accent">
                                            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider">{t('userUpdated')}</span>
                                        </div>
                                        <p className="text-[9px] text-cool-mist leading-relaxed uppercase tracking-[0.05em]">
                                            {t('adminVerification')}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <span className="text-cool-mist uppercase block text-[10px] tracking-wider mb-1">{t('address')}</span>
                                    <p>{school.address}, {school.neighborhood}</p>
                                </div>

                                <div className="pt-4 border-t border-border/10">
                                    <h4 className="text-[10px] text-accent uppercase tracking-widest font-bold mb-3">{t('updateCoords')}</h4>
                                    <form
                                        className="grid grid-cols-2 gap-3"
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
                                            placeholder="Latitude"
                                            defaultValue={school.userLat || (school.hasCoordinates ? school.latitude : '')}
                                            className="bg-navy border border-border p-2 text-xs text-ice-white focus:border-accent outline-none"
                                        />
                                        <input
                                            name="lng"
                                            type="number"
                                            step="any"
                                            placeholder="Longitude"
                                            defaultValue={school.userLng || (school.hasCoordinates ? school.longitude : '')}
                                            className="bg-navy border border-border p-2 text-xs text-ice-white focus:border-accent outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="col-span-2 bg-accent/20 border border-accent/40 text-accent text-[10px] font-bold uppercase tracking-widest py-2 hover:bg-accent hover:text-navy transition-all"
                                        >
                                            {t('save')}
                                        </button>
                                    </form>
                                </div>

                                <div>
                                    <span className="text-cool-mist uppercase block text-[10px] tracking-wider mb-1">{t('municipality')}</span>
                                    <p>{school.municipality}, {school.state}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-cool-mist uppercase block text-[10px] tracking-wider mb-1">{t('students')}</span>
                                        <p className="text-lg font-bold">{school.studentsTotal}</p>
                                    </div>
                                    <div>
                                        <span className="text-cool-mist uppercase block text-[10px] tracking-wider mb-1">{t('staff')}</span>
                                        <p className="text-lg font-bold">{school.staffTotal}</p>
                                    </div>
                                </div>
                                {school.imageMetadata?.dateTaken && (
                                    <div className="pt-4 border-t border-border/10">
                                        <span className="text-accent uppercase block text-[10px] tracking-wider mb-1">{t('imageDateTaken')}</span>
                                        <p className="font-bold">{school.imageMetadata.dateTaken}</p>
                                    </div>
                                )}

                                {school.rainStats && (
                                    <div className="pt-4 border-t border-border/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-accent uppercase block text-[10px] tracking-wider">{t('rainfallHistory')}</span>
                                            {school.rainStats.isVerified ? (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-900/20 border border-green-500/30 text-green-400 rounded-full">
                                                    <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                                    <span className="text-[7px] font-bold uppercase tracking-tight">{t('verifiedByBlockchain')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-900/20 border border-red-500/30 text-red-400 rounded-full">
                                                    <span className="w-1 h-1 bg-red-500 rounded-full animate-ping"></span>
                                                    <span className="text-[7px] font-bold uppercase tracking-tight">{t('integrityFailure')}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 bg-midnight-blue/50 p-3 border border-border/10 rounded-sm">
                                            <div>
                                                <span className="text-cool-mist uppercase block text-[8px] tracking-widest mb-1">{t('totalRainfall')}</span>
                                                <p className="text-xl font-bold text-ice-white">{school.rainStats.totalMillimeters.toFixed(2)} <span className="text-xs font-normal text-cool-mist">mm</span></p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-cool-mist uppercase block text-[8px] tracking-widest mb-1">{t('lastUpdated')}</span>
                                                <p className="text-[10px] text-ice-white font-mono">{school.rainStats.lastCatch}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-accent text-xs font-bold tracking-widest uppercase mb-4 border-b border-border pb-2">
                                Water Infrastructure
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-cool-mist uppercase text-[10px] tracking-wider">Cistern Capacity</span>
                                    <p className="font-bold">{school.infrastructure.cisternLiters} L</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-cool-mist uppercase text-[10px] tracking-wider">Tinaco Capacity</span>
                                    <p className="font-bold">{school.infrastructure.tinacoLiters} L</p>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-border">
                                    <span className="text-cool-mist uppercase text-[10px] tracking-wider">Total Storage</span>
                                    <p className="text-xl font-bold text-accent">{school.infrastructure.totalLiters} L</p>
                                </div>
                                {school.notes && (
                                    <div className="mt-6 pt-4 border-t border-border">
                                        <p className="text-xs italic text-cool-mist">{school.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-border">
                                <h3 className="text-accent text-xs font-bold tracking-widest uppercase mb-4">
                                    Risk Profile
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`text-2xl font-black ${school.riskLevel === 'high' ? 'text-red-500' :
                                                school.riskLevel === 'medium' ? 'text-orange-500' : 'text-green-500'
                                            }`}>
                                            {school.riskScore}
                                            <span className="text-xs font-normal text-cool-mist"> / 100</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${school.riskLevel === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                school.riskLevel === 'medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                    'bg-green-500/10 text-green-400 border border-green-500/20'
                                            }`}>
                                            {school.riskLevel} Risk
                                        </div>
                                    </div>

                                    {school.riskReasons && school.riskReasons.length > 0 && (
                                        <ul className="space-y-2">
                                            {school.riskReasons.map((reason, i) => (
                                                <li key={i} className="flex items-start gap-2 text-[11px] text-cool-mist">
                                                    <span className="text-accent">•</span>
                                                    {reason}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-accent text-xs font-bold tracking-widest uppercase mb-6 border-b border-border pb-2">
                            {t('images')}
                        </h3>
                        {images.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {images.map((img, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="relative aspect-video bg-midnight-blue border border-border overflow-hidden">
                                            <img
                                                src={img.url}
                                                alt={img.label}
                                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <p className="text-[10px] text-cool-mist uppercase tracking-widest text-center">{img.label}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-cool-mist text-sm">No images available for this school.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
