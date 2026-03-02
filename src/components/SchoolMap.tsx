'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { School } from '@/lib/types';

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
    selectedSchoolId?: string | null;
}

export default function SchoolMap({ schools, selectedSchoolId }: SchoolMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div style={{ height: '500px', background: 'var(--midnight-blue)' }} />;

    const center: [number, number] = schools.length > 0
        ? [schools[0].latitude, schools[0].longitude]
        : [19.4326, -99.1332]; // Default to Mexico City

    return (
        <MapContainer center={center} zoom={10} scrollWheelZoom={false} className="leaflet-container">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {schools.map((school) => (
                <Marker
                    key={school.id}
                    position={[school.latitude, school.longitude]}
                >
                    <Popup>
                        <div className="text-navy">
                            <h3 className="text-lg font-bold">{school.name}</h3>
                            <p className="text-sm">{school.address}</p>
                            <p className="text-sm">{school.municipality}, {school.state}</p>
                            <p className="mt-2 font-semibold">Meter Reading: {school.meterReading} m³</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
