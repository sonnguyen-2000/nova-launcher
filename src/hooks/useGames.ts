import { useCallback, useEffect, useState } from "react";
import { gameApi } from "../api/gameApi";
import type { Game, GameInput } from "../types/game";

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (action?: () => Promise<unknown>) => {
    try {
      if (action) await action();
      setGames(await gameApi.list());
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const reload = useCallback(() => refresh(), [refresh]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    games,
    error,
    reload,
    add: (input: GameInput) => refresh(() => gameApi.create(input)),
    remove: (id: number) => refresh(() => gameApi.remove(id)),
    toggleFavorite: (game: Game) => refresh(() => gameApi.setFavorite(game.id, !game.isFavorite)),
  };
}