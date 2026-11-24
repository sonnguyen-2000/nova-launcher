import type { GroupMode, SortMode, ViewMode } from "../../types/library";

interface Option<T> {
  value: T;
  label: string;
}

export const VIEW_MODES: Option<ViewMode>[] = [
  { value: "grid", label: "Lưới" },
  { value: "list", label: "Danh sách" },
  { value: "details", label: "Chi tiết" },
];

export const GROUP_MODES: Option<GroupMode>[] = [
  { value: "none", label: "Không" },
  { value: "source", label: "Nguồn" },
  { value: "genre", label: "Thể loại" },
];

export const SORT_MODES: Option<SortMode>[] = [
  { value: "name", label: "Tên" },
  { value: "playtime", label: "Thời gian chơi" },
  { value: "lastPlayed", label: "Chơi gần đây" },
];

export function labelOf<T>(options: ReadonlyArray<Option<T>>, value: T): string {
  return options.find((option) => option.value === value)?.label ?? "";
}

/** Giá trị kế tiếp trong danh sách (quay vòng). */
export function nextValue<T>(options: ReadonlyArray<Option<T>>, current: T): T {
  const index = options.findIndex((option) => option.value === current);
  return options[(index + 1) % options.length].value;
}