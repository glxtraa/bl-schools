import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { School } from './types';

export async function getSchools(): Promise<School[]> {
    const filePath = path.join(process.cwd(), 'src/data/school-data.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const schools: School[] = results.data.map((row: any, index: number) => {
                    // 1. Try direct columns
                    let lat = parseFloat(row['_CAPTURA LA UBICACION_latitude'] || row['LATITUDE'] || row['latitude']);
                    let lng = parseFloat(row['_CAPTURA LA UBICACION_longitude'] || row['LONGITUDE'] || row['longitude']);

                    // 2. Try the composite 'CAPTURA LA UBICACION' string
                    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                        const locString = row['CAPTURA LA UBICACION'];
                        if (locString && typeof locString === 'string') {
                            const parts = locString.trim().split(/\s+/);
                            if (parts.length >= 2) {
                                lat = parseFloat(parts[0]);
                                lng = parseFloat(parts[1]);
                            }
                        }
                    }

                    // 3. Fallback: Scan all keys for anything containing 'latitude' or 'longitude'
                    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                        for (const key in row) {
                            if (key.toLowerCase().includes('latitude') && !isNaN(parseFloat(row[key]))) {
                                lat = parseFloat(row[key]);
                            }
                            if (key.toLowerCase().includes('longitude') && !isNaN(parseFloat(row[key]))) {
                                lng = parseFloat(row[key]);
                            }
                        }
                    }

                    const hasCoordinates = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

                    return {
                        id: row['_id'] || index.toString(),
                        name: row['NOMBRE DE LA ESCUELA / CENTRO COMUNITARIO*'] || 'Unknown School',
                        latitude: lat || 0,
                        longitude: lng || 0,
                        hasCoordinates,
                        address: row['CALLE'] || '',
                        neighborhood: row['COLONIA / LOCALIDAD'] || '',
                        municipality: row['TERRITORIAL / MUNICIPIO'] || '',
                        state: row['ESTADO'] || '',
                        zipCode: row['CODIGO POSTAL'] || '',
                        meterPhotoUrl: row['FOTO DEL MEDIDOR_URL'] || '',
                        receiptPhotoUrl: row['FOTO DE RECIBO DE SEGUIMIENTO_URL'] || '',
                        visitPhotoUrl: row['FOTO DE LA VISITA MOSAC_URL'] || '',
                        nectarPhotoUrl: row['FOTO DEL MEDIDOR DEL NECTAR_URL'] || '',
                        meterReading: row['LECTURA DEL MEDIDOR (EN M CUBICOS)'] || '0',
                        studentsTotal: parseInt(row['r_alumnos_total']) || 0,
                        staffTotal: parseInt(row['r_adultos_total']) || 0,
                        project: row['PROYECTO'] || '',
                        lastUpdated: row['FECHA DE SEGUIMIENTO'] || '',
                        status: row['ESTATUS*'] || 'Active',
                        imageMetadata: {
                            dateTaken: row['FECHA DE SEGUIMIENTO'] || undefined,
                        },
                        infrastructure: {
                            cisternLiters: parseInt(row['¿QUE CAPACIDAD (LITRO)  DE ALMACENAMIENTO TIENE(N) LA(S) CISTERNA(S)?']) || 0,
                            tinacoLiters: parseInt(row['almacen_tinaco_total']) || 0,
                            totalLiters: parseInt(row['almacen_total']) || 0,
                        },
                        notes: row['DESCRIBE BREVEMENTE LA SITUACION DE AGUA EN LA ESCUELA'] || row['DESCRIBE LA SITUACION'] || '',
                    };
                });

                console.log(`[DataParser] Loaded ${schools.length} schools total. (${schools.filter(s => s.hasCoordinates).length} with coords)`);
                resolve(schools);
            },
            error: (error: any) => {
                reject(error);
            }
        });
    });
}
