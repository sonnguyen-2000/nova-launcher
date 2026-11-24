import { useCallback, useEffect, useState } from "react";
import { launcherApi } from "../api/launcherApi";

/** Theo dõi game đang chạy. `onExited` nên là hàm ổn định (useCallback). */
export function useRunningGames(onExited: () => void) {
  const [runningIds, setRunningIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setRunningIds(await launcherApi.listRunning());
  }, []);

  useEffect(() => {
    void reload();
    const unlisten = launcherApi.onGameExited(() => {
      void reload();
      onExited();
    });
    return () => {
      void unlisten.then((stop) => stop());
    };
  }, [reload, onExited]);

  const run = async (action: () => Promise<void>) => {
    try {
      await action();
      await reload();
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  };

  return {
    runningIds,
    error,
    launch: (id: number) => run(() => launcherApi.launch(id)),
    stop: (id: number) => run(() => launcherApi.stop(id)),
  };
}