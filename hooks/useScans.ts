import { create } from 'zustand';

export interface Scan {
  id: number;
  markerId: number;
  message: string;
  timestamp: number;
}

interface ScansStore {
  scans: Scan[];
  addScan: (scan: Scan) => void;
  clearScans: () => void;
}

export const useScans = create<ScansStore>((set) => ({
  scans: [],
  addScan: (scan: Scan) =>
    set((state) => ({
      scans: [...state.scans, scan],
    })),
  clearScans: () => set({ scans: [] }),
}));