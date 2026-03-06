import Papa from 'papaparse';
import fs from 'fs';

const csvPath = 'src/data/school-data.csv';
const fileContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(fileContent, {
    header: true,
    complete: (results) => {
        const headers = Object.keys(results.data[0] as any);
        headers.forEach((header, index) => {
            console.log(`${index}: ${header}`);
        });
    }
});
