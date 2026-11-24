import type { GroupMode, SortMode, ViewMode } from "../../../types/library";
import { GROUP_MODES, SORT_MODES, VIEW_MODES, labelOf } from "../library.constants";

interface ToolbarProps {
  view: ViewMode;
  onView: (view: ViewMode) => void;
  group: GroupMode;
  onCycleGroup: () => void;
  sort: SortMode;
  onCycleSort: () => void;
  coverSize: number;
  onCoverSize: (size: number) => void;
  query: string;
  onQuery: (query: string) => void;
  onAdd: () => void;
  onScan: () => void;
}

export function Toolbar(props: ToolbarProps) {
  const { view, onView, group, onCycleGroup, sort, onCycleSort, coverSize, onCoverSize, query, onQuery, onAdd, onScan } =
    props;

  return (
    <header className="toolbar">
      <div className="toolbar__brand">Ngăn Xếp</div>

      <div className="segmented">
        {VIEW_MODES.map((mode) => (
          <button
            key={mode.value}
            className={view === mode.value ? "is-active" : ""}
            onClick={() => onView(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <button className="btn" onClick={onCycleGroup}>
        Nhóm: {labelOf(GROUP_MODES, group)}
      </button>
      <button className="btn" onClick={onCycleSort}>
        Sắp xếp: {labelOf(SORT_MODES, sort)}
      </button>

      <label className="toolbar__size">
        Cỡ ảnh bìa
        <input
          type="range"
          min={110}
          max={230}
          value={coverSize}
          onChange={(e) => onCoverSize(Number(e.target.value))}
          style={{ width: 110 }}
        />
      </label>

      <div className="toolbar__spacer" />

      <button className="btn" onClick={onScan}>
        Quét thư mục
      </button>
      <button className="btn btn--primary" onClick={onAdd}>
        + Thêm game
      </button>
      <input
        className="input toolbar__search"
        placeholder="Tìm trong thư viện"
        aria-label="Tìm game"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
    </header>
  );
}