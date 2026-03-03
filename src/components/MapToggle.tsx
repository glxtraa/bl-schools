'use client';

interface MapToggleProps {
    active: boolean;
    onToggle: (active: boolean) => void;
    label: string;
}

export default function MapToggle({ active, onToggle, label }: MapToggleProps) {
    return (
        <button
            onClick={() => onToggle(!active)}
            className={`flex items-center gap-3 px-4 py-2 border transition-all duration-300 ${active
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-midnight-blue/50 border-border text-cool-mist hover:border-cool-mist'
                }`}
        >
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${active ? 'bg-accent shadow-[0_0_8px_rgba(0,176,255,0.8)]' : 'bg-midnight-blue border border-border'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
        </button>
    );
}
