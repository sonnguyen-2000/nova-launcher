import { useState } from "react";
import { scanApi } from "../api/scanApi";
import type { ScanCandidate } from "../types/scan";
import { createGameInput } from "../utils/gameInput";

export function useScanner(onImported: () => void) {
  const [candidates, setCandidates] = useState<ScanCandidate[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const scan = async () => {
    setScanning(true);
    try {
      const found = await scanApi.scan();
      setCandidates(found);
      setSelected(new Set(found.filter((c) => !c.alreadyAdded).map((c) => c.exePath)));
      setMessage(found.length === 0 ? "Không tìm thấy game nào." : null);
    } catch (e) {
      setMessage(String(e));
    } finally {
      setScanning(false);
    }
  };

  const toggle = (exePath: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(exePath)) next.delete(exePath);
      else next.add(exePath);
      return next;
    });

  const importSelected = async () => {
    const inputs = candidates
      .filter((c) => selected.has(c.exePath))
      .map((c) => createGameInput({ name: c.name, exePath: c.exePath, source: "scan" }));
    try {
      const added = await scanApi.importGames(inputs);
      setMessage(`Đã thêm ${added} game.`);
      setCandidates([]);
      setSelected(new Set());
      onImported();
    } catch (e) {
      setMessage(String(e));
    }
  };

  return { candidates, selected, scanning, message, scan, toggle, importSelected };
}