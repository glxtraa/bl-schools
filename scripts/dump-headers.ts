import Papa from 'papaparse';
import fs from 'fs';

const csvPath = 'src/data/school-data.csv';
const fileContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(fileContent, {
    header: true,
    step: (results, parser) => {
        console.log(JSON.stringify(Object.keys(results.data as any), null, 2));
        parser.abort();
    }
});
