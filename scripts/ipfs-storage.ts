import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { blockchainRegistry } from '../src/lib/blockchain-registry';

/**
 * IPFS Storage Simulation
 * 
 * Hashes a log file, generates a simulated CID, and registers it on "the blockchain".
 */

async function processLogFile(filename: string) {
    const filePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File ${filename} not found.`);
        return;
    }

    console.log(`\n--- Storing ${filename} to IPFS (Simulated) ---`);

    // 1. Read content
    const content = fs.readFileSync(filePath, 'utf8');

    // 2. Calculate SHA-256 (Integrity Check)
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    console.log(`SHA-256 Hash: ${hash}`);

    // 3. Generate Simulated CID (v1 CID style)
    // In production, you'd useipfs.add()
    const cid = `bafybeigcl${hash.substring(0, 36)}hk6i`;
    console.log(`Generated CID: ${cid}`);

    // 4. Record on "Blockchain"
    blockchainRegistry.recordHash(cid, hash);

    // 5. Store "IPFS" cache (simulated)
    const ipfsDir = path.join(process.cwd(), 'public/data/ipfs_cache');
    if (!fs.existsSync(ipfsDir)) fs.mkdirSync(ipfsDir, { recursive: true });

    fs.writeFileSync(path.join(ipfsDir, `${cid}.log`), content);
    console.log(`File saved to simulated IPFS cache: ${cid}.log`);

    // Save mapping for the dashboard to use
    const mappingPath = path.join(process.cwd(), 'public/data/ipfs_registry.json');
    let registry = {};
    if (fs.existsSync(mappingPath)) {
        registry = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
    }
    (registry as any)[new Date().toISOString().split('T')[0]] = cid;
    fs.writeFileSync(mappingPath, JSON.stringify(registry, null, 2));

    console.log(`Registry updated. CID ${cid} is now the "official" version for today.`);
}

// Run for our current log
processLogFile('2026-03-02.log');
