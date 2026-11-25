export type GamingTab = "home" | "library" | "collections" | "settings";
export type GameFilterKey = "all" | "fav" | "hours" | "fresh" | "new";
export type Overlay = "none" | "system" | "quick";

export type NavAction =
  | "up" | "down" | "left" | "right"
  | "confirm" | "back" | "quick" | "menu" | "search"
  | "prevTab" | "nextTab";

export interface CollectionDef {
  key: Exclude<GameFilterKey, "all">;
  label: string;
  sub: string;
  background: string;
}

export const GAMING_TABS: { value: GamingTab; label: string }[] = [
  { value: "home", label: "Trang chủ" },
  { value: "library", label: "Thư viện" },
  { value: "collections", label: "Bộ sưu tập" },
  { value: "settings", label: "Cài đặt" },
];