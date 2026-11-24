import { open } from "@tauri-apps/plugin-dialog";

export const dialogApi = {
  pickExe: async (): Promise<string | null> => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "Ứng dụng", extensions: ["exe"] }],
    });
    return typeof selected === "string" ? selected : null;
  },
};