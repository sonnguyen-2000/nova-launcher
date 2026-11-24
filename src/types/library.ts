import type { Game } from "./game";

export type ViewMode = "grid" | "list" | "details";
export type GroupMode = "none" | "source" | "genre";
export type SortMode = "name" | "playtime" | "lastPlayed";

export interface LibraryFilters {
  sources: string[];
  genres: string[];
  onlyFavorites: boolean;
  showHidden: boolean;
}

export interface GameGroup {
  key: string;
  label: string;
  games: Game[];
}

export interface SourceFacet {
  key: string;
  label: string;
  color: string;
  count: number;
}

/** Props chung của 3 kiểu hiển thị một game (lưới, danh sách, chi tiết). */
export interface GameItemProps {
  game: Game;
  selected: boolean;
  running: boolean;
  onSelect: () => void;
  onToggleRun: () => void;
}