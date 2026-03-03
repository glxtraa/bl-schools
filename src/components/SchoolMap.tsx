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
}

// Component to handle map view updates
function MapController({ geojson, showBasins }: { geojson: any, showBasins: boolean }) {
    const map = useMap();

    useEffect(() => {
        if (showBasins && geojson && geojson.features.length > 0) {
            const bounds = L.geoJSON(geojson).getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50], animate: true });
            }
        }
    }, [showBasins, geojson, map]);

    return null;
}

export default function SchoolMap({ schools, showBasins = false }: SchoolMapProps) {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [basinData, setBasinData] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        // Fetch HydroBASINS GeoJSON
        fetch('/data/hydrobasins_l6_schools.geojson')
            .then(res => res.json())
            .then(data => setBasinData(data))
            .catch(err => console.error('HydroBASINS not found yet or error:', err));
    }, []);

    if (!isMounted) return <div style={{ height: '600px', background: 'var(--midnight-blue)' }} className="flex items-center justify-center text-cool-mist text-xs uppercase tracking-widest">{t('loadingMap')}</div>;

    const center: [number, number] = schools.length > 0
        ? [19.3456, -98.9428]
        : [19.4326, -99.1332];

    const basinStyle = {
        color: '#00b0ff',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#2196f3',
        fillOpacity: 0.2,
    };

    const onEachBasin = (feature: any, layer: any) => {
        if (feature.properties) {
            const { HYBAS_ID, schools, school_count } = feature.properties;
            layer.bindPopup(`
        <div class="text-navy p-2">
          <div class="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">HydroBASINS Level 6</div>
          <h3 class="text-sm font-bold mb-1">Basin ID: ${HYBAS_ID}</h3>
          <p class="text-[10px] text-cool-mist uppercase mb-2">Schools identified: ${school_count}</p>
          <div class="pt-2 border-t border-border/20 max-h-40 overflow-y-auto">
            <p class="text-[9px] text-cool-mist leading-relaxed">${schools}</p>
          </div>
        </div>
      `);

            layer.on({
                mouseover: (e: any) => {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.4, weight: 3 });
                },
                mouseout: (e: any) => {
                    const l = e.target;
                    l.setStyle(basinStyle);
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
                        data={basinData}
                        style={basinStyle}
                        onEachFeature={onEachBasin}
                    />
                )}

                <MapController geojson={basinData} showBasins={showBasins} />

                {schools.filter(s => s.hasCoordinates).map((school) => (
                    <Marker
                        key={school.id}
                        position={[school.latitude, school.longitude]}
                    >
                        <Popup>
                            <div className="text-navy p-1">
                                <div className="text-[10px] font-bold text-core-blue uppercase tracking-wider mb-1">{school.project || 'Project'}</div>
                                <h3 className="text-sm font-bold mb-1">{school.name}</h3>
                                <p className="text-[10px] text-cool-mist uppercase mb-2">{school.municipality}, {school.state}</p>
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
