import type { Game } from "../../types/game";
import type { CollectionDef, GameFilterKey } from "./gaming.types";

const HOURS_THRESHOLD_SECONDS = 50 * 3600;
const NEW_WINDOW_SECONDS = 30 * 86400;

interface FilterDef {
  key: GameFilterKey;
  label: string;
  test: (game: Game) => boolean;
}

export const FILTERS: FilterDef[] = [
  { key: "all", label: "Tất cả", test: () => true },
  { key: "fav", label: "Yêu thích", test: (g) => g.isFavorite },
  { key: "hours", label: "Chơi nhiều", test: (g) => g.playtimeSeconds >= HOURS_THRESHOLD_SECONDS },
  { key: "fresh", label: "Chưa chơi", test: (g) => g.playtimeSeconds === 0 },
  { key: "new", label: "Mới thêm", test: (g) => Date.now() / 1000 - g.createdAt <= NEW_WINDOW_SECONDS },
];

export const COLLECTIONS: CollectionDef[] = [
  { key: "fav", label: "Yêu thích", sub: "Game bạn đánh dấu sao", background: "linear-gradient(135deg,#7a3df0,#3a2a8a)" },
  { key: "hours", label: "Chơi nhiều nhất", sub: "Từ 50 giờ trở lên", background: "linear-gradient(135deg,#e0663a,#8a2a4a)" },
  { key: "fresh", label: "Chưa chơi", sub: "Đang chờ bạn khám phá", background: "linear-gradient(135deg,#3a8df0,#2a3f8a)" },
  { key: "new", label: "Mới thêm", sub: "Thêm trong 30 ngày qua", background: "linear-gradient(135deg,#1f9d8a,#14506a)" },
];

function visibleGames(games: Game[]): Game[] {
  return games.filter((game) => !game.isHidden);
}

/** Game chơi gần nhất lên đầu; chưa chơi thì theo ngày thêm. */
export function recentGames(games: Game[], limit = 8): Game[] {
  return visibleGames(games)
    .sort(
      (a, b) =>
        (b.lastPlayedAt ?? 0) - (a.lastPlayedAt ?? 0) || b.createdAt - a.createdAt,
    )
    .slice(0, limit);
}

export function filterGames(games: Game[], key: GameFilterKey, query: string): Game[] {
  const filter = FILTERS.find((f) => f.key === key) ?? FILTERS[0];
  const q = query.trim().toLowerCase();

  return visibleGames(games)
    .filter((game) => filter.test(game) && (!q || game.name.toLowerCase().includes(q)))
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

export function countByFilter(games: Game[], key: GameFilterKey): number {
  return filterGames(games, key, "").length;
}