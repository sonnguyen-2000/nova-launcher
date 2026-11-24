import { useMemo, useState } from "react";
import type { Game } from "../../types/game";
import type { GroupMode, LibraryFilters, SortMode, ViewMode } from "../../types/library";
import { GROUP_MODES, SORT_MODES, nextValue } from "./library.constants";
import {
  EMPTY_FILTERS,
  applyFilters,
  collectGenres,
  collectSources,
  groupGames,
  hasActiveFilters,
  sortGames,
  toggleItem,
} from "./library.logic";

export function useLibraryView(games: Game[]) {
  const [view, setView] = useState<ViewMode>("grid");
  const [group, setGroup] = useState<GroupMode>("none");
  const [sort, setSort] = useState<SortMode>("name");
  const [coverSize, setCoverSize] = useState(150);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<LibraryFilters>(EMPTY_FILTERS);

  const visible = useMemo(
    () => sortGames(applyFilters(games, filters, query), sort),
    [games, filters, query, sort],
  );
  const groups = useMemo(() => groupGames(visible, group), [visible, group]);
  const sources = useMemo(() => collectSources(games), [games]);
  const genres = useMemo(() => collectGenres(games), [games]);

  return {
    view,
    setView,
    group,
    sort,
    coverSize,
    setCoverSize,
    query,
    setQuery,
    filters,
    visible,
    groups,
    sources,
    genres,
    hasFilters: hasActiveFilters(filters) || query.trim() !== "",
    cycleGroup: () => setGroup((current) => nextValue(GROUP_MODES, current)),
    cycleSort: () => setSort((current) => nextValue(SORT_MODES, current)),
    toggleSource: (key: string) =>
      setFilters((f) => ({ ...f, sources: toggleItem(f.sources, key) })),
    toggleGenre: (genre: string) =>
      setFilters((f) => ({ ...f, genres: toggleItem(f.genres, genre) })),
    toggleOnlyFavorites: () => setFilters((f) => ({ ...f, onlyFavorites: !f.onlyFavorites })),
    toggleShowHidden: () => setFilters((f) => ({ ...f, showHidden: !f.showHidden })),
    clearFilters: () => {
      setFilters(EMPTY_FILTERS);
      setQuery("");
    },
  };
}