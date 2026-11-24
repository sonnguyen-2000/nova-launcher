import { useCallback, useEffect, useState } from "react";
import { scanApi } from "../api/scanApi";
import type { ScanFolder } from "../types/scan";

export function useScanFolders() {
  const [folders, setFolders] = useState<ScanFolder[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (action?: () => Promise<unknown>) => {
    try {
      if (action) await action();
      setFolders(await scanApi.listFolders());
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addFromPicker = async () => {
    const path = await scanApi.pickFolder();
    if (path) await refresh(() => scanApi.addFolder(path));
  };

  return {
    folders,
    error,
    addFromPicker,
    remove: (id: number) => refresh(() => scanApi.removeFolder(id)),
  };
}