/**
 * Mock Blockchain Registry
 * 
 * Simulates a smart contract that stores the SHA-256 hash of data stored on IPFS.
 * This is the "on-chain" truth used to verify that rain logs haven't been tampered with.
 */

interface RegistryEntry {
    sha256: string;
    timestamp: number;
}

// In a real app, this would be a Smart Contract on Polygon/Ethereum
class BlockchainRegistry {
    private static instance: BlockchainRegistry;
    private registry: Map<string, RegistryEntry> = new Map();

    private constructor() { }

    public static getInstance(): BlockchainRegistry {
        if (!BlockchainRegistry.instance) {
            BlockchainRegistry.instance = new BlockchainRegistry();
        }
        return BlockchainRegistry.instance;
    }

    /**
     * Simulates "minting" or recording an CID and its hash on the blockchain.
     */
    public recordHash(cid: string, sha256: string) {
        this.registry.set(cid, {
            sha256,
            timestamp: Date.now()
        });
        console.log(`[Blockchain] Recorded hash for CID ${cid}: ${sha256}`);
    }

    /**
     * Returns the recorded hash for a CID.
     */
    public getHash(cid: string): string | undefined {
        return this.registry.get(cid)?.sha256;
    }

    public isVerified(cid: string, currentHash: string): boolean {
        const onChainHash = this.getHash(cid);
        return onChainHash === currentHash;
    }
}

export const blockchainRegistry = BlockchainRegistry.getInstance();
