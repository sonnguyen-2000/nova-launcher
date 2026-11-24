import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import type { GameExitedEvent } from "../types/game";

export const launcherApi = {
  launch: (id: number) => invoke<void>("launch_game", { id }),
  stop: (id: number) => invoke<void>("stop_game", { id }),
  listRunning: () => invoke<number[]>("list_running_games"),
  onGameExited: (handler: (event: GameExitedEvent) => void): Promise<UnlistenFn> =>
    listen<GameExitedEvent>("game-exited", (e) => handler(e.payload)),
};