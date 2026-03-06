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

                    const schoolName = row['NOMBRE DE LA ESCUELA / CENTRO COMUNITARIO*'] || 'Unknown School';
                    const municipality = row['TERRITORIAL / MUNICIPIO'] || '';
                    const userId = row['ID USUARIO*'];

                    // 4. Identity Mapping (Section 4.2)
                    const schoolId = userId || `${schoolName}|${municipality}`;
                    const meterNumber = row['NUMERO DE MEDIDOR'];
                    const meterId = meterNumber || schoolId;

                    const hasCoordinates = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

                    // 5. Risk Modeling (Section 9)
                    const { riskScore, riskLevel, riskReasons } = calculateRisk(row);

                    return {
                        id: schoolId,
                        index: index.toString(),
                        name: schoolName,
                        latitude: lat || 0,
                        longitude: lng || 0,
                        hasCoordinates,
                        address: row['CALLE'] || '',
                        neighborhood: row['COLONIA / LOCALIDAD'] || '',
                        municipality: municipality,
                        state: row['ESTADO'] || '',
                        zipCode: row['CODIGO POSTAL'] || '',
                        meterPhotoUrl: row['FOTO DEL MEDIDOR_URL'] || '',
                        receiptPhotoUrl: row['FOTO DE RECIBO DE SEGUIMIENTO_URL'] || '',
                        visitPhotoUrl: row['FOTO DE LA VISITA MOSAC_URL'] || '',
                        nectarPhotoUrl: row['FOTO DEL MEDIDOR DEL NECTAR_URL'] || '',
                        meterReading: row['LECTURA DEL MEDIDOR (EN M CUBICOS)'] || '0',
                        meterId,
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
                        riskScore,
                        riskLevel,
                        riskReasons
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

function calculateRisk(row: any): { riskScore: number, riskLevel: 'low' | 'medium' | 'high', riskReasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // 1. SCALL usage
    if (row['¿ESTAN USANDO EL SCALL?'] === 'NO') {
        score += 25;
        reasons.push('SCALL not in use');
    }

    // 2. Meter health
    if (row['¿EL MEDIDOR FUNCIONA CORRECTAMENTE?'] === 'NO') {
        score += 15;
        reasons.push('Meter malfunction');
    }

    // 3. Canceled activities
    if (row['SE HAN TENIDO QUE CANCELAR O RECORTAR ACTIVIDAES POR FALTA DE AGUA.'] === 'SI') {
        score += 20;
        reasons.push('Activities canceled due to water shortage');
    }

    // 4. Restricted sanitation
    if (row['¿SE HA TENIDO QUE RESTRINGIR EL ACCESO A SANITARIOS POR FALTA DE AGUA?'] === 'SI') {
        score += 20;
        reasons.push('Restricted sanitation access');
    }

    // 5. Water quality
    if (row['¿CONSIDERA QUE EL AGUA UTILIZADA EN SU ESCUELA/ESPACIO COMUNITARIO ES DE MALA CALIDAD?'] === 'SI') {
        score += 10;
        reasons.push('Reported poor water quality');
    }

    // 6. User burden
    if (row['¿LAS PERSONAS USUARIAS HAN TENIDO QUE TRAER AGUA?'] === 'SI' || row['¿LAS PERSONAS USUARIAS HAN TENIDO QUE APORTAR DINERO PARA TENER AGUA?'] === 'SI') {
        score += 10;
        reasons.push('User burden detected (bringing or paying for water)');
    }

    let level: 'low' | 'medium' | 'high' = 'low';
    if (score >= 60) level = 'high';
    else if (score >= 30) level = 'medium';

    return { riskScore: Math.min(100, score), riskLevel: level, riskReasons: reasons };
}
