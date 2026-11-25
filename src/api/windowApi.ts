import { invoke } from "@tauri-apps/api/core";

export const windowApi = {
  setFullscreen: (enabled: boolean) => invoke<void>("set_fullscreen", { enabled }),
  focus: () => invoke<void>("focus_window"),
  exit: () => invoke<void>("exit_app"),
};