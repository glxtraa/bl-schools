'use client';

import { useState } from 'react';
import { School } from '@/lib/types';
import Image from 'next/image';

interface SchoolListProps {
    schools: School[];
    onSchoolSelect?: (id: string) => void;
}

export default function SchoolList({ schools, onSchoolSelect }: SchoolListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.municipality.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Schools Directory</h2>
                <input
                    type="text"
                    placeholder="Search schools or municipalities..."
                    className="bg-midnight-blue border border-border p-2 px-4 text-ice-white focus:outline-none focus:border-accent w-full max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.map((school) => (
                    <div
                        key={school.id}
                        className="school-card cursor-pointer flex flex-col justify-between"
                        onClick={() => onSchoolSelect?.(school.id)}
                    >
                        <div>
                            <div className="text-accent text-xs font-bold tracking-widest uppercase mb-2">
                                {school.project || 'Project'}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{school.name}</h3>
                            <p className="text-cool-mist text-sm mb-4 line-clamp-2">
                                {school.address}, {school.municipality}, {school.state}
                            </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-end">
                            <div>
                                <p className="text-xs text-cool-mist uppercase tracking-wider">Meter Reading</p>
                                <p className="text-lg font-bold text-accent">{school.meterReading} m³</p>
                            </div>
                            {school.meterPhotoUrl ? (
                                <div className="relative w-16 h-16 border border-border overflow-hidden">
                                    <img
                                        src={school.meterPhotoUrl}
                                        alt="Meter"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-midnight-blue border border-border flex items-center justify-center text-[10px] text-cool-mist text-center leading-tight">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredSchools.length === 0 && (
                <div className="text-center py-20 text-cool-mist">
                    No schools found matching your search.
                </div>
            )}
        </div>
    );
}
