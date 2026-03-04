import crypto from 'crypto';
import { blockchainRegistry } from './blockchain-registry';

/**
 * Rain Data Analyzer
 * 
 * Fetches data from "IPFS", verifies integrity via "Blockchain", and analyzes rainfall.
 */

export interface RainStats {
    sensorId: string;
    totalMillimeters: number;
    lastCatch: string;
    isVerified: boolean;
    error?: string;
}

export async function analyzeRainDataFromIPFS(cid: string): Promise<Record<string, RainStats>> {
    try {
        // 1. Fetch from IPFS (client-side simulation check)
        const res = await fetch(`/data/ipfs_cache/${cid}.log`);
        const content = await res.text();

        // 2. Calculate Hash
        const currentHash = crypto.createHash('sha256').update(content).digest('hex');

        // 3. Verify on Blockchain
        // NOTE: In this simulation, we check against a local registry. 
        // In reality, this would be a read call to a Smart Contract.
        const isVerified = blockchainRegistry.isVerified(cid, currentHash);

        if (!isVerified) {
            console.error(`CRITICAL: Data tampering detected for CID ${cid}!`);
            throw new Error('Integrity Check Failed: Blockchain hash mismatch.');
        }

        // 4. Process valid data
        const stats: Record<string, RainStats> = {};

        // Simple regex parser for our log format
        const entryRegex = /'tlaloque_id' => '([^']+)',\s+'millimeters' => '([^']+)',\s+'catched_at' => '([^']+)'/g;
        let match;

        while ((match = entryRegex.exec(content)) !== null) {
            const [, id, mm, date] = match;
            const value = parseFloat(mm);

            if (!stats[id]) {
                stats[id] = {
                    sensorId: id,
                    totalMillimeters: 0,
                    lastCatch: date,
                    isVerified: true
                };
            }

            stats[id].totalMillimeters += value;
            if (new Date(date) > new Date(stats[id].lastCatch)) {
                stats[id].lastCatch = date;
            }
        }

        return stats;
    } catch (error: any) {
        console.error('Rain analysis failed:', error.message);
        throw error;
    }
}
