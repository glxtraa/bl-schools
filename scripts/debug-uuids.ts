import Papa from 'papaparse';
import fs from 'fs';

const csvPath = 'src/data/school-data.csv';
const fileContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(fileContent, {
    header: true,
    complete: (results) => {
        results.data.forEach((row: any) => {
            const name = row['NOMBRE DE LA ESCUELA / CENTRO COMUNITARIO*'];
            const uuid = row['_uuid'];
            const id = row['_id'];
            const logbook = row['LOGBOOK'];
            const deviceid = row['deviceid'];
            const meterNumber = row['NUMERO DE MEDIDOR'];
            const userId = row['ID USUARIO*'];

            if (name) {
                console.log(`\nSchool: ${name}`);
                console.log(`  _uuid: ${uuid}`);
                console.log(`  LOGBOOK: ${logbook}`);
                console.log(`  deviceid: ${deviceid}`);
                console.log(`  NUMERO DE MEDIDOR: ${meterNumber}`);
                console.log(`  ID USUARIO*: ${userId}`);

                // Scan all keys for anything looking like a UUID
                for (const key in row) {
                    const val = row[key];
                    if (val && typeof val === 'string' && val.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/)) {
                        console.log(`  Found UUID in ${key}: ${val}`);
                    }
                }
            }
        });
    }
});
