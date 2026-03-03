import fs from 'fs';
import path from 'path';
import axios from 'axios';
import AdmZip from 'adm-zip';
import * as shapefile from 'shapefile';
import * as turf from '@turf/turf';
import { getSchools } from '../src/lib/data-parser.ts';

const BASIN_URL = 'https://data.hydrosheds.org/file/hydrobasins/standard/hybas_na_lev06_v1c.zip';
const TEMP_DIR = path.join(process.cwd(), 'temp_basins');
const OUTPUT_FILE = path.join(process.cwd(), 'public/data/hydrobasins_l6_schools.geojson');

async function processBasins() {
    console.log('--- HydroBASINS Pipeline Started ---');

    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
    if (!fs.existsSync(path.dirname(OUTPUT_FILE))) fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

    console.log('Fetching school data...');
    const schools = await getSchools();
    const schoolPoints = schools.map(s => turf.point([s.longitude, s.latitude], { id: s.id, name: s.name }));
    console.log(`Found ${schoolPoints.length} valid school locations.`);

    const zipPath = path.join(TEMP_DIR, 'basins.zip');
    if (!fs.existsSync(zipPath)) {
        console.log('Downloading HydroBASINS Level-6 (NA)...');
        const response = await axios({
            url: BASIN_URL,
            method: 'GET',
            responseType: 'arraybuffer',
        });
        fs.writeFileSync(zipPath, response.data);
        console.log('Download complete.');
    } else {
        console.log('Using cached basins.zip');
    }

    console.log('Extracting zip...');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(TEMP_DIR, true);

    const shpFile = path.join(TEMP_DIR, 'hybas_na_lev06_v1c.shp');
    const dbfFile = path.join(TEMP_DIR, 'hybas_na_lev06_v1c.dbf');

    console.log('Parsing shapefile...');
    const basinFeatures: any[] = [];
    const source = await shapefile.open(shpFile, dbfFile);

    let result = await source.read();
    while (!result.done) {
        basinFeatures.push(result.value);
        result = await source.read();
    }
    console.log(`Loaded ${basinFeatures.length} basin polygons.`);

    console.log('Matching schools to basins...');
    const basinsWithSchoolsMap = new Map();

    for (const schoolPoint of schoolPoints) {
        let matched = false;
        for (const basinFeature of basinFeatures) {
            if (turf.booleanPointInPolygon(schoolPoint, basinFeature)) {
                const basinId = basinFeature.properties?.HYBAS_ID;
                if (basinId) {
                    if (!basinsWithSchoolsMap.has(basinId)) {
                        basinsWithSchoolsMap.set(basinId, {
                            feature: JSON.parse(JSON.stringify(basinFeature)),
                            schools: []
                        });
                    }
                    const entry = basinsWithSchoolsMap.get(basinId);
                    if (entry) {
                        entry.schools.push(schoolPoint.properties.name);
                    }
                    matched = true;
                    break;
                }
            }
        }
    }

    const finalFeatures = Array.from(basinsWithSchoolsMap.values()).map(entry => {
        if (entry.schools && entry.schools.length > 0) {
            entry.feature.properties.schools = entry.schools.join(', ');
            entry.feature.properties.school_count = entry.schools.length;
        } else {
            entry.feature.properties.schools = 'None';
            entry.feature.properties.school_count = 0;
        }
        return entry.feature;
    });

    console.log(`Matched ${finalFeatures.length} basins.`);

    const finalGeoJSON = turf.featureCollection(finalFeatures);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalGeoJSON));
    console.log(`Saved output to ${OUTPUT_FILE}`);

    console.log('--- Pipeline Complete ---');
}

processBasins().catch(console.error);
