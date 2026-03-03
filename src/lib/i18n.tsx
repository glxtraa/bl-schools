'use client';

import { useState, createContext, useContext, ReactNode } from 'react';

type Language = 'en' | 'es';

interface Translations {
    [key: string]: {
        en: string;
        es: string;
    };
}

const translations: Translations = {
    title: { en: "Blue Lifeline | Schools Water Dashboard", es: "Blue Lifeline | Tablero de Agua Escolar" },
    subtitle: { en: "Verified Water Benefit Tracking Dashboard", es: "Tablero de Seguimiento de Beneficios de Agua Verificados" },
    description: { en: "Direct monitoring of school water systems to ensure sustainability and accountability.", es: "Monitoreo directo de los sistemas de agua escolares para asegurar la sostenibilidad y la rendición de cuentas." },
    geographicDistribution: { en: "01 — Geographic Distribution", es: "01 — Distribución Geográfica" },
    schoolsMap: { en: "Schools Map", es: "Mapa de Escuelas" },
    detailedMetrics: { en: "02 — Detailed Metrics", es: "02 — Métricas Detalladas" },
    allInstallations: { en: "All Installations", es: "Todas las Instalaciones" },
    searchPlaceholder: { en: "Search schools or municipalities...", es: "Buscar escuelas o municipios..." },
    meterReadingLabel: { en: "Meter Reading", es: "Lectura del Medidor" },
    viewDetails: { en: "View Details", es: "Ver Detalles" },
    close: { en: "Close", es: "Cerrar" },
    loadingMap: { en: "Loading Map...", es: "Cargando Mapa..." },
    noSchoolsFound: { en: "No schools found matching your search.", es: "No se encontraron escuelas que coincidan con su búsqueda." },
    schoolDetails: { en: "School Details", es: "Detalles de la Escuela" },
    address: { en: "Address", es: "Dirección" },
    municipality: { en: "Municipality", es: "Municipio" },
    state: { en: "State", es: "Estado" },
    students: { en: "Students", es: "Alumnos" },
    staff: { en: "Staff", es: "Personal" },
    project: { en: "Project", es: "Proyecto" },
    lastUpdated: { en: "Last Updated", es: "Última Actualización" },
    status: { en: "Status", es: "Estado" },
    images: { en: "Gallery", es: "Galería de Imágenes" },
    needsCoordinates: { en: "Requires Coordinate Confirmation", es: "Requiere Confirmación de Coordenadas" },
    coordConfidence: { en: "Location approximate based on address. Field verification pending.", es: "Ubicación aproximada por dirección. Verificación de campo pendiente." },
    imageDateTaken: { en: "Image Taken", es: "Imagen Tomada" },
    meterPhoto: { en: "Meter Photo", es: "Foto del Medidor" },
    receiptPhoto: { en: "Receipt Photo", es: "Foto del Recibo" },
    visitPhoto: { en: "Site Visit Photo", es: "Foto de la Visita" },
    nectarPhoto: { en: "Nectar Photo", es: "Foto del Nectar" },
    footerTagline: { en: "The Standard for Water Sustainability", es: "El Estándar para la Sostenibilidad del Agua" },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('es');

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
