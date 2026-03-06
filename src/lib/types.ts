export interface School {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  neighborhood: string;
  municipality: string;
  state: string;
  zipCode: string;
  meterPhotoUrl: string;
  receiptPhotoUrl: string;
  visitPhotoUrl: string;
  nectarPhotoUrl: string;
  meterReading: string;
  index: string;
  studentsTotal: number;
  staffTotal: number;
  meterId: string;
  project: string;
  lastUpdated: string;
  status: string;
  hasCoordinates: boolean;
  userLat?: number;
  userLng?: number;
  needsVerification?: boolean;
  imageMetadata?: {
    dateTaken?: string;
    camera?: string;
  };
  infrastructure: {
    cisternLiters: number;
    tinacoLiters: number;
    totalLiters: number;
  };
  rainStats?: {
    totalMillimeters: number;
    lastCatch: string;
    isVerified: boolean;
  };
  notes: string;
  riskScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  riskReasons?: string[];
}
