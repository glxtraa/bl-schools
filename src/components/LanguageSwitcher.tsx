'use client';

import { useLanguage } from '@/lib/i18n';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex gap-2">
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border border-border transition-colors ${language === 'en' ? 'bg-accent text-navy border-accent' : 'text-cool-mist hover:text-ice-white'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border border-border transition-colors ${language === 'es' ? 'bg-accent text-navy border-accent' : 'text-cool-mist hover:text-ice-white'
                    }`}
            >
                ES
            </button>
        </div>
    );
}
