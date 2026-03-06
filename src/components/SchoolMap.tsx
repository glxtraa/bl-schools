'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { School } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

// Fix Leaflet marker icon issue in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SchoolMapProps {
    schools: School[];
    showBasins?: boolean;
    showDatacenters?: boolean;
}

// Component to handle map view updates
function MapController({ geojson, showBasins, datacenters, showDatacenters }: { geojson: any, showBasins: boolean, datacenters: any[], showDatacenters: boolean }) {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds([]);
        let hasBounds = false;

        if (showBasins && geojson && geojson.features && geojson.features.length > 0) {
            const basinBounds = L.geoJSON(geojson).getBounds();
            if (basinBounds.isValid()) {
                bounds.extend(basinBounds);
                hasBounds = true;
            }
        }

        if (showDatacenters && datacenters && datacenters.length > 0) {
            datacenters.forEach(dc => {
                bounds.extend([dc.latitude, dc.longitude]);
            });
            hasBounds = true;
        }

        if (hasBounds) {
            console.log('[MapController] Fitting bounds to shown layers');
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
    }, [showBasins, geojson, showDatacenters, datacenters, map]);

    return null;
}

const RISK_COLORS: Record<number, string> = {
    0: '#ffff00', // Low (Yellow)
    1: '#ffe600', // Low-Medium
    2: '#ff9900', // Medium-High
    3: '#ff1900', // High (Red)
    4: '#990000', // Extremely High (Dark Red)
};

const PROVIDER_COLORS: Record<string, string> = {
    'Google': '#4285F4',
    'AWS': '#FF9900',
    'Microsoft': '#00A4EF',
};

// Custom Marker Icons for Data Centers
const getDCIcon = (provider: string) => L.divIcon({
    className: 'custom-dc-marker',
    html: `<div style="background-color: ${PROVIDER_COLORS[provider] || '#777'}; width: 18px; height: 18px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(0,0,0,0.6);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

export default function SchoolMap({ schools, showBasins = false, showDatacenters = false }: SchoolMapProps) {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [basinData, setBasinData] = useState<any>(null);
    const [dcData, setDcData] = useState<any[]>([]);
    const [riskData, setRiskData] = useState<Record<string, any>>({});
    const [interconnectionData, setInterconnectionData] = useState<Record<string, any>>({});

    useEffect(() => {
        setIsMounted(true);
        // Fetch School Basins
        fetch('/data/hydrobasins_l6_schools.geojson')
            .then(res => res.json())
            .then(data => {
                console.log('[SchoolMap] Loaded Basin Data:', data.features?.length, 'features');
                setBasinData(data);
            })
            .catch(err => console.error('School Basins not found:', err));

        // Fetch Datacenters
        fetch('/data/mexico_datacenters_estimated.json')
            .then(res => res.json())
            .then(data => {
                console.log('[SchoolMap] Loaded Datacenters:', data.length);
                setDcData(data);
            })
            .catch(err => console.error('Datacenters not found:', err));

        // Fetch Risk Data
        fetch('/data/basin_risk_comparison.json')
            .then(res => res.json())
            .then(data => setRiskData(data))
            .catch(err => console.error('Risk data not found:', err));

        // Fetch Interconnection Data
        fetch('/data/hydrologic_interconnection.json')
            .then(res => res.json())
            .then(data => setInterconnectionData(data))
            .catch(err => console.error('Interconnection data not found:', err));
    }, []);

    useEffect(() => {
        console.log('[SchoolMap] showDatacenters toggled:', showDatacenters);
    }, [showDatacenters]);

    if (!isMounted) return <div style={{ height: '600px', background: 'var(--midnight-blue)' }} className="flex items-center justify-center text-cool-mist text-xs uppercase tracking-widest">{t('loadingMap')}</div>;

    const center: [number, number] = schools.length > 0
        ? [19.3456, -98.9428]
        : [19.4326, -99.1332];

    const getBasinStyle = (feature: any) => {
        const hybasId = feature.properties.HYBAS_ID.toString();
        const risk = riskData[hybasId];
        const riskClass = risk ? Math.floor(risk.overall_risk) : (feature.properties.risk_class || 0);

        console.log(`[SchoolMap] Styling Basin ${hybasId}, Risk Class: ${riskClass}`);

        return {
            color: '#ffffff',
            weight: 1,
            fillColor: RISK_COLORS[riskClass as keyof typeof RISK_COLORS] || '#2196f3',
            fillOpacity: 0.4,
        };
    };

    const onEachBasin = (feature: any, layer: any) => {
        if (feature.properties) {
            const hybasId = feature.properties.HYBAS_ID.toString();
            const { PFAF_ID, schools: schoolNames, school_count } = feature.properties;
            const risk = riskData[hybasId];
            const interconnection = interconnectionData[hybasId];

            layer.bindPopup(`
                <div class="text-navy p-2 min-w-[200px]">
                    <div class="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">HydroBASINS Level 6</div>
                    <h2 class="text-sm font-bold mb-1">Basin ID: ${hybasId}</h2>
                    <p class="text-[10px] text-cool-mist mb-2">PFAF ID: ${PFAF_ID}</p>
                    
                    ${risk ? `
                        <div class="mt-2 p-1.5 bg-[#f0f9ff] rounded border border-blue-100">
                            <div class="text-[9px] font-bold uppercase text-blue-600 mb-1">Aqueduct Risk Profile</div>
                            <div class="flex justify-between text-[11px]">
                                <span>Overall Risk:</span>
                                <span class="font-bold">${risk.overall_risk.toFixed(1)} / 5.0</span>
                            </div>
                        </div>
                    ` : ''}

                    <div class="mt-2 pt-2 border-t border-gray-100">
                        <p class="text-[10px] text-gray-400 uppercase mb-1">Schools (${school_count}):</p>
                        <p class="text-[9px] text-gray-600 leading-relaxed">${schoolNames}</p>
                    </div>
                </div>
            `);

            layer.on({
                mouseover: (e: any) => {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.7, weight: 2 });
                },
                mouseout: (e: any) => {
                    const l = e.target;
                    l.setStyle(getBasinStyle(feature));
                }
            });
        }
    };

    return (
        <div className="relative">
            <MapContainer center={center} zoom={10} scrollWheelZoom={false} className="leaflet-container">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {showBasins && basinData && (
                    <GeoJSON
                        key={`basins-${basinData.features?.length || 0}-${Object.keys(riskData).length}`}
                        data={basinData}
                        style={getBasinStyle}
                        onEachFeature={onEachBasin}
                    />
                )}

                <MapController
                    geojson={basinData}
                    showBasins={showBasins}
                    datacenters={dcData}
                    showDatacenters={showDatacenters}
                />

                {/* Data Center Markers */}
                {showDatacenters && dcData.map((dc, i) => (
                    <Marker
                        key={`dc-${i}`}
                        position={[dc.latitude, dc.longitude]}
                        icon={getDCIcon(dc.provider)}
                    >
                        <Popup>
                            <div className="text-navy p-2">
                                <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">{dc.provider} Data Center</div>
                                <h3 className="text-sm font-bold mb-1">{dc.region}</h3>
                                <div className="text-[10px] text-cool-mist uppercase mb-2">Basin ID: {dc.basin_id}</div>
                                <div className="pt-2 border-t border-border/20">
                                    <div className="flex justify-between text-[11px] mb-1">
                                        <span>Water Usage:</span>
                                        <span className="font-bold text-core-blue">{dc.water_usage}</span>
                                    </div>
                                    <a href={dc.disclosure_link} target="_blank" className="text-[10px] text-accent hover:underline block mt-1">
                                        View Water Disclosure →
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* School Markers */}
                {schools.filter(s => s.hasCoordinates || s.userLat).map((school) => (
                    <Marker
                        key={school.id}
                        position={[school.userLat || school.latitude, school.userLng || school.longitude]}
                    >
                        <Popup>
                            <div className="text-navy p-1">
                                <div className="text-[10px] font-bold text-core-blue uppercase tracking-wider mb-1">{school.project || 'Project'}</div>
                                <h3 className="text-sm font-bold mb-1">{school.name}</h3>
                                <p className="text-[10px] text-cool-mist uppercase mb-2">{school.municipality}, {school.state}</p>

                                {school.riskScore !== undefined && (
                                    <div className={`text-[9px] font-bold uppercase mb-2 px-1.5 py-0.5 rounded inline-block ${school.riskLevel === 'high' ? 'bg-red-100 text-red-600' :
                                        school.riskLevel === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        Risk: {school.riskLevel} ({school.riskScore}/100)
                                    </div>
                                )}

                                <div className="pt-2 border-t border-border/20">
                                    <p className="text-[10px] uppercase font-bold text-cool-mist mb-1">{t('meterReadingLabel')}</p>
                                    <p className="text-lg font-black">{school.meterReading} m³</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
