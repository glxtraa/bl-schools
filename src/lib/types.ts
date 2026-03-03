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
  studentsTotal: number;
  staffTotal: number;
  project: string;
  lastUpdated: string;
  status: string;
  hasCoordinates: boolean;
  imageMetadata?: {
    dateTaken?: string;
    camera?: string;
  };
  infrastructure: {
    cisternLiters: number;
    tinacoLiters: number;
    totalLiters: number;
  };
  notes: string;
}
