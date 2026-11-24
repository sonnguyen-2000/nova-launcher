import { invoke } from "@tauri-apps/api/core";
import type { Game, GameInput } from "../types/game";

export const gameApi = {
  list: () => invoke<Game[]>("list_games"),
  get: (id: number) => invoke<Game>("get_game", { id }),
  create: (input: GameInput) => invoke<Game>("create_game", { input }),
  update: (id: number, input: GameInput) => invoke<Game>("update_game", { id, input }),
  remove: (id: number) => invoke<void>("delete_game", { id }),
  setFavorite: (id: number, value: boolean) => invoke<Game>("set_game_favorite", { id, value }),
  setHidden: (id: number, value: boolean) => invoke<Game>("set_game_hidden", { id, value }),
};