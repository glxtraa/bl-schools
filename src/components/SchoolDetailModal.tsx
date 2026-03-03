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
                                {!school.hasCoordinates && (
                                    <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-sm">
                                        <div className="flex items-center gap-2 mb-1 text-red-400">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider">{t('needsCoordinates')}</span>
                                        </div>
                                        <p className="text-[9px] text-cool-mist leading-relaxed uppercase tracking-[0.05em]">
                                            {t('coordConfidence')}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-cool-mist uppercase block text-[10px] tracking-wider mb-1">{t('address')}</span>
                                    <p>{school.address}, {school.neighborhood}</p>
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
