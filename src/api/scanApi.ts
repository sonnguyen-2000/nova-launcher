import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { GameInput } from "../types/game";
import type { ScanCandidate, ScanFolder } from "../types/scan";

export const scanApi = {
  listFolders: () => invoke<ScanFolder[]>("list_scan_folders"),
  addFolder: (path: string) => invoke<ScanFolder>("add_scan_folder", { path }),
  removeFolder: (id: number) => invoke<void>("remove_scan_folder", { id }),
  scan: () => invoke<ScanCandidate[]>("scan_games"),
  importGames: (inputs: GameInput[]) => invoke<number>("import_games", { inputs }),

  pickFolder: async (): Promise<string | null> => {
    const selected = await open({ directory: true, multiple: false });
    return typeof selected === "string" ? selected : null;
  },
};