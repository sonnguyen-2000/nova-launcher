export interface ScanFolder {
  id: number;
  path: string;
  createdAt: number;
}

export interface ScanCandidate {
  name: string;
  exePath: string;
  alreadyAdded: boolean;
}