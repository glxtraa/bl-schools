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
                    // Extract latitude and longitude
                    let lat = parseFloat(row['_CAPTURA LA UBICACION_latitude'] || row['LATITUDE']);
                    let lng = parseFloat(row['_CAPTURA LA UBICACION_longitude'] || row['LONGITUDE']);

                    // If still zero/NaN, try parsing the 'CAPTURA LA UBICACION' string which often has 'lat lng alt accuracy'
                    if (!lat || !lng) {
                        const locString = row['CAPTURA LA UBICACION'];
                        if (locString) {
                            const parts = locString.split(' ');
                            if (parts.length >= 2) {
                                lat = parseFloat(parts[0]);
                                lng = parseFloat(parts[1]);
                            }
                        }
                    }

                    return {
                        id: row['_id'] || index.toString(),
                        name: row['NOMBRE DE LA ESCUELA / CENTRO COMUNITARIO*'] || 'Unknown School',
                        latitude: lat || 0,
                        longitude: lng || 0,
                        address: row['CALLE'] || '',
                        municipality: row['TERRITORIAL / MUNICIPIO'] || '',
                        state: row['ESTADO'] || '',
                        meterPhotoUrl: row['FOTO DEL MEDIDOR_URL'] || '',
                        meterReading: row['LECTURA DEL MEDIDOR (EN M CUBICOS)'] || '0',
                        studentsTotal: parseInt(row['r_alumnos_total']) || 0,
                        staffTotal: parseInt(row['r_adultos_total']) || 0,
                        project: row['PROYECTO'] || '',
                        lastUpdated: row['FECHA DE SEGUIMIENTO'] || '',
                        status: row['ESTATUS*'] || 'Active',
                    };
                }).filter((s: School) => s.latitude !== 0 && s.longitude !== 0);
                resolve(schools);
            },
            error: (error: any) => {
                reject(error);
            }
        });
    });
}
