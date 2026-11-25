import { useCallback, useState } from "react";
import { scanApi } from "../api/scanApi";
import { createGameInput } from "../utils/gameInput";

/** Quét các thư mục đã lưu và tự thêm mọi game mới tìm thấy. */
export function useLibraryRescan(onDone: () => void, notify: (text: string) => void) {
  const [scanning, setScanning] = useState(false);

  const rescan = useCallback(async () => {
    setScanning(true);
    try {
      const folders = await scanApi.listFolders();
      if (folders.length === 0) {
        notify("Chưa có thư mục quét. Hãy thêm ở giao diện máy tính.");
        return;
      }

      const fresh = (await scanApi.scan()).filter((c) => !c.alreadyAdded);
      const inputs = fresh.map((c) =>
        createGameInput({ name: c.name, exePath: c.exePath, source: "scan" }),
      );
      const added = inputs.length > 0 ? await scanApi.importGames(inputs) : 0;

      notify(added > 0 ? `Đã thêm ${added} game mới` : "Không có game mới");
      onDone();
    } catch (e) {
      notify(String(e));
    } finally {
      setScanning(false);
    }
  }, [notify, onDone]);

  return { scanning, rescan };
}