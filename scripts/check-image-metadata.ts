import axios from 'axios';
import exifr from 'exifr';

async function checkMetadata() {
    const url = 'https://eu.kobotoolbox.org/api/v2/assets/a6qYYJMsNMpMwTw34myxrK/data/748605275/attachments/attan9aYM9pyomUiUWehEwju/';

    console.log('Fetching sample image...');
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        console.log('Extracting metadata...');
        const metadata = await exifr.parse(buffer);
        console.log('Metadata result:', JSON.stringify(metadata, null, 2));

        if (metadata) {
            console.log('\n--- Useful Metadata found ---');
            if (metadata.DateTimeOriginal) console.log('Date Taken:', metadata.DateTimeOriginal);
            if (metadata.latitude) console.log('GPS Latitude:', metadata.latitude);
            if (metadata.longitude) console.log('GPS Longitude:', metadata.longitude);
            if (metadata.Make) console.log('Camera:', metadata.Make, metadata.Model);
        } else {
            console.log('No EXIF metadata found.');
        }
    } catch (error: any) {
        console.error('Error fetching or parsing image:', error.message);
    }
}

checkMetadata();
