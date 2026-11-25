import { useCallback, useEffect, useState } from "react";
import { windowApi } from "../api/windowApi";

export type UiMode = "desktop" | "gaming";

const STORAGE_KEY = "nova.uiMode";

function readStoredMode(): UiMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === "gaming" ? "gaming" : "desktop";
  } catch {
    return "desktop";
  }
}

/** Chế độ giao diện hiện tại; nhớ lựa chọn lần trước và bật/tắt toàn màn hình theo chế độ. */
export function useUiMode() {
  const [mode, setMode] = useState<UiMode>(readStoredMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Bỏ qua nếu không ghi được.
    }
    windowApi.setFullscreen(mode === "gaming").catch(() => undefined);
  }, [mode]);

  const enterGaming = useCallback(() => setMode("gaming"), []);
  const exitGaming = useCallback(() => setMode("desktop"), []);

  return { mode, enterGaming, exitGaming };
}