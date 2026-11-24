import { useCallback, useEffect, useState } from "react";
import { gameApi } from "../api/gameApi";
import type { Game, GameInput } from "../types/game";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  /** Chạy một hành động rồi tải lại danh sách. Trả về true nếu thành công. */
  const refresh = useCallback(async (action?: () => Promise<unknown>): Promise<boolean> => {
    try {
      if (action) await action();
      setGames(await gameApi.list());
      setError(null);
      return true;
    } catch (e) {
      setError(String(e));
      return false;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const reload = useCallback(() => refresh(), [refresh]);

  return {
    games,
    error,
    reload,
    add: (input: GameInput) => refresh(() => gameApi.create(input)),
    update: (id: number, input: GameInput) => refresh(() => gameApi.update(id, input)),
    remove: (id: number) => refresh(() => gameApi.remove(id)),
    toggleFavorite: (game: Game) => refresh(() => gameApi.setFavorite(game.id, !game.isFavorite)),
    toggleHidden: (game: Game) => refresh(() => gameApi.setHidden(game.id, !game.isHidden)),
  };
}