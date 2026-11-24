import type { Game } from "../../types/game";
import type { GameGroup, GroupMode, LibraryFilters, SortMode, SourceFacet } from "../../types/library";
import { genreMain, genreTags } from "../../utils/genre";
import { getSource } from "../../utils/sources";

export const EMPTY_FILTERS: LibraryFilters = {
  sources: [],
  genres: [],
  onlyFavorites: false,
  showHidden: false,
};

export function hasActiveFilters(filters: LibraryFilters): boolean {
  return (
    filters.sources.length > 0 ||
    filters.genres.length > 0 ||
    filters.onlyFavorites ||
    filters.showHidden
  );
}

export function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function applyFilters(games: Game[], filters: LibraryFilters, query: string): Game[] {
  const q = query.trim().toLowerCase();

  return games.filter((game) => {
    if (game.isHidden && !filters.showHidden) return false;
    if (filters.onlyFavorites && !game.isFavorite) return false;
    if (filters.sources.length > 0 && !filters.sources.includes(game.source)) return false;
    if (
      filters.genres.length > 0 &&
      !genreTags(game.genre).some((tag) => filters.genres.includes(tag))
    ) {
      return false;
    }
    if (q && !`${game.name} ${game.developer} ${game.genre}`.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
}

export function sortGames(games: Game[], mode: SortMode): Game[] {
  const sorted = [...games];
  switch (mode) {
    case "playtime":
      return sorted.sort((a, b) => b.playtimeSeconds - a.playtimeSeconds);
    case "lastPlayed":
      return sorted.sort((a, b) => (b.lastPlayedAt ?? 0) - (a.lastPlayedAt ?? 0));
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }
}

export function groupGames(games: Game[], mode: GroupMode): GameGroup[] {
  if (mode === "none") {
    return games.length > 0 ? [{ key: "all", label: "", games }] : [];
  }

  const buckets = new Map<string, GameGroup>();
  for (const game of games) {
    const label = mode === "source" ? getSource(game.source).label : genreMain(game.genre);
    const bucket = buckets.get(label) ?? { key: label, label, games: [] };
    bucket.games.push(game);
    buckets.set(label, bucket);
  }
  return [...buckets.values()].sort((a, b) => a.label.localeCompare(b.label, "vi"));
}

export function collectSources(games: Game[]): SourceFacet[] {
  const counts = new Map<string, number>();
  for (const game of games) {
    counts.set(game.source, (counts.get(game.source) ?? 0) + 1);
  }
  return [...counts.entries()].map(([key, count]) => ({ key, count, ...getSource(key) }));
}

export function collectGenres(games: Game[]): string[] {
  const tags = new Set<string>();
  for (const game of games) {
    genreTags(game.genre).forEach((tag) => tags.add(tag));
  }
  return [...tags].sort((a, b) => a.localeCompare(b, "vi"));
}